import React, {useEffect} from 'react';
// import VideoPlayer from 'react-native-video-controls';
import {useRoute} from '@react-navigation/native';
import Orientation from 'react-native-orientation';
import Video from 'react-native-video';

import {SubtitleItem} from '../core/Downloader';

export interface OfflinePlayerParams {
  video: string;
  subtitles?: SubtitleItem[];
}

interface Sub {
  title: string;
  language: string;
  type: 'text/vtt';
  uri: string;
}

// let videoRef: Video | null;

export const OfflinePlayerScreen: React.FC = () => {
  const {params} = useRoute();
  const {video, subtitles} = params as OfflinePlayerParams;

  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const subs = subtitles?.map(
    (sub) =>
      ({
        title: sub.lang,
        type: 'text/vtt',
        language: sub.lang,
        uri: sub.url,
      } as Sub),
  );

  return (
    <Video
      // ref={(ref) => {
      //   videoRef = ref;
      // }}
      // navigator={navigation}
      source={{uri: video}}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
      selectedTextTrack={subs?.length ? {type: 'language', value: 'ar'} : undefined}
      textTracks={subs?.length ? subs : undefined}
      controls
      muted
    />
  );
};
