import React, {useEffect, useState} from 'react';
// import VideoPlayer from 'react-native-video-controls';
import {useRoute} from '@react-navigation/native';
import Orientation from 'react-native-orientation';

import {TitleDetail} from '../core/interfaces/title';
import {Episode} from '../core/interfaces/episode';
import {Season} from '../core/interfaces/season';
import {swapEpisodeUrlId} from '../utils/common';
import {InteractionManager} from 'react-native';
import {Channel} from '../core/interfaces/channel';
import {getHit} from '../api/title';
import {ViewHit} from '../core/interfaces/view-hit';
import {useAuth} from '../context/auth-context';
import Video from 'react-native-video';

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

let videoRef: Video | null;

export const PlayerScreen: React.FC = () => {
  const {params} = useRoute();
  const {title, episode, channel} = params as PlayerParams;
  const [info, setInfo] = useState<{
    video: string;
    subtitles: Sub[];
  } | null>();
  // const [loading, setLoading] = useState(true);
  const {token} = useAuth();
  const {hit} = useHit(title?.id, token);
  // const navigation = useNavigation();

  useEffect(() => {
    console.log('is this working');
    console.log(videoRef);
    if (videoRef) {
      console.log('this one is from video');
      console.dir(videoRef, {depth: null});
      if (hit) {
        console.log('this one is from hit');
        videoRef.seek(hit.playback_position);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hit, videoRef]);

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
      {/* {loading ? <LoadingIndicator /> : null} */}
      <Video
        ref={(ref) => {
          videoRef = ref;
        }}
        // navigator={navigation}
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
        controls
        muted
      />
    </>
  ) : null;
};

const useHit = (id?: string | number, token?: string | null) => {
  const [error, setError] = useState<Error | null>(null);
  const [hit, setHit] = useState<ViewHit | null>(null);

  const getHitDetail = async () => {
    try {
      if (token && id) {
        try {
          const data = await getHit(id);
          setHit(data);
        } catch (err) {
          console.log(err);
        }
      }
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    getHitDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  return {hit, error};
};
