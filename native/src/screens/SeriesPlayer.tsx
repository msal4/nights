import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {InteractionManager, Platform, View} from 'react-native';

import {Title, TitleDetail} from '../core/interfaces/title';
import {getHit, hitTopic, getSeason, getEpisode, getTitle, getEpisodeURL} from '../api/title';
import {useAuth} from '../context/auth-context';
import {Sub, Player, OnProgressData} from '../components/Player';
import {Season} from '../core/interfaces/season';
import {Episode} from '../core/interfaces/episode';
import {swapEpisodeUrlId} from '../utils/common';

export interface SeriesPlayerParams {
  title: Title;
  season?: Season;
  episode?: Episode;
}

export const SeriesPlayerScreen: React.FC = () => {
  const lastHit = useRef();
  const {params} = useRoute() as {name: string; params: SeriesPlayerParams};

  const {token} = useAuth();
  const [titleDetail, setTitleDetail] = useState<TitleDetail | null>();
  const [seasonId, setSeasonId] = useState<number | null>();
  const [season, setSeason] = useState<Season | null>();
  const [episode, setEpisode] = useState<Episode | null>();
  const [video, setVideo] = useState<string | null>();
  const [subtitles, setSubtitles] = useState<Sub[]>();
  const [startTime, setStartTime] = useState<number>();
  const navigation = useNavigation();

  const continueWatching = (ep: Episode) => {
    try {
      setStartTime(ep.hits[0]?.playback_position ?? 0);
    } catch (err) {
      setStartTime(0);
    }
  };

  const playEpisode = async (ep: Episode) => {
    let v = swapEpisodeUrlId(ep.videos[0]?.url.replace('{q}', '720').replace('{f}', 'mp4'));
    if (v) {
      console.log(v);
      const startIdx = v.indexOf('/s/');
      const endIdx = v.indexOf('/720');
      const info = v.substring(startIdx + 3, endIdx).split('/');
      if (info.length === 3) {
        try {
          const resp: {url: string}[] = (await getEpisodeURL(info[0], info[1], info[2])) as any;
          if (resp.length) {
            v = resp[0].url;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    const s = ep.subtitles.map(
      (sub) =>
        ({
          title: sub.language ?? 'ar',
          type: 'text/vtt',
          language: sub.language ?? 'ar',
          uri: swapEpisodeUrlId(sub.url)?.replace('{f}', 'vtt'),
        } as Sub),
    );

    setSubtitles(s);
    setVideo(v);

    continueWatching(ep);
  };

  const loadEpisode = async () => {
    // eslint-disable-next-line no-shadow
    const {title: simpleTitle, season, episode} = params;

    const title = await getTitle(simpleTitle.id);
    setTitleDetail(title);

    if (!season || !episode) {
      if (token) {
        try {
          const hit = await getHit(title.id);
          const e = await getEpisode(hit.episode!.id);
          setSeasonId(hit.season);
          setEpisode(e);
          hit.episode && (await playEpisode(e));
        } catch (err) {
          if (title.seasons.length) {
            const s = await getSeason(title.seasons[0].id);
            const e = s.episodes[0];
            if (e) {
              setEpisode(e);
              setSeason(s);
              playEpisode(e);
            }
          }
        }
      } else {
        if (title.seasons.length) {
          const s = await getSeason(title.seasons[0].id);
          const e = s.episodes[0];
          if (e) {
            setEpisode(e);
            setSeason(s);
            playEpisode(e);
          }
        }
      }
    } else {
      setEpisode(episode);
      setSeason(season);
      playEpisode(episode);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: params.episode?.name || params.title.name,
    });
    if (Platform.OS === 'ios') {
      InteractionManager.runAfterInteractions(loadEpisode);
    } else {
      loadEpisode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.episode?.id]);

  return titleDetail ? (
    <>
      {video && startTime !== undefined ? (
        <Player
          titleDetail={titleDetail}
          startTime={startTime}
          video={video}
          subtitles={subtitles}
          title={episode?.name}
          onProgress={
            token
              ? (data: OnProgressData) => {
                  const last = lastHit.current ?? 0;
                  if (data.currentTime > last + 30 || data.currentTime < last) {
                    (lastHit as any).current = data.currentTime;
                    const hitData = {
                      playback_position: data.currentTime,
                      runtime: data.runtime,
                      season: season?.id || seasonId,
                      episode: episode?.id,
                    };

                    hitTopic(titleDetail.id, hitData as any);
                  }
                }
              : undefined
          }
        />
      ) : null}
    </>
  ) : (
    <View />
  );
};
