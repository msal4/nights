import React, {useEffect, useState} from 'react';
import VideoPlayer from 'react-native-video-controls';
import {useRoute, useNavigation} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

import {TitleDetail} from '../core/interfaces/title';
import {Episode} from '../core/interfaces/episode';
import {Season} from '../core/interfaces/season';
import {swapEpisodeUrlId} from '../utils/common';
import {InteractionManager} from 'react-native';
import LoadingIndicator from '../components/LoadingIndicator';
import {Channel} from '../core/interfaces/channel';

interface PlayerParams {
  title?: TitleDetail;
  season?: Season;
  episode?: Episode;
  channel?: Channel;
}

interface Sub {
  title: string;
  language: string;
  type: 'text/vtt';
  uri: string;
}

export const PlayerScreen: React.FC = () => {
  const {params} = useRoute();
  const {title, episode, channel} = params as PlayerParams;
  const [info, setInfo] = useState<{
    video: string;
    subtitles: Sub[];
  } | null>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (title) {
        if (title.type === 'm') {
          const video = title.videos[0].url;
          const subtitles = title.subtitles.map(
            (sub) =>
              ({
                title: sub.language ?? 'ar',
                type: 'text/vtt',
                language: sub.language ?? 'ar',
                uri: sub.url.replace('{f}', 'vtt'),
              } as Sub),
          );
          console.log(subtitles);
          setInfo({video, subtitles});
        } else if (episode) {
          const video = episode.videos[0].url;
          const subtitles = episode.subtitles.map(
            (sub) =>
              ({
                title: sub.language,
                type: 'text/vtt',
                language: sub.language,
                uri: swapEpisodeUrlId(sub.url),
              } as Sub),
          );
          console.log(subtitles);
          setInfo({video, subtitles});
        }
      } else if (channel) {
        setInfo({video: channel.url, subtitles: []});
      }
    });

    Orientation.lockToLandscape();

    return () => {
      Orientation.lockToPortrait();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title?.id, channel?.id]);

  return info ? (
    <>
      {loading ? <LoadingIndicator /> : null}
      <VideoPlayer
        navigator={navigation}
        source={{uri: info.video}}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        selectedTextTrack={info.subtitles.length ? {type: 'language', value: 'ar'} : undefined}
        textTracks={info.subtitles.length ? info.subtitles : undefined}
        // onLoad={() => {
        //   setLoading(false);
        // }}
        // muted
      />
    </>
  ) : null;
};
