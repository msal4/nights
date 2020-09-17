import React, {useEffect} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import Orientation from 'react-native-orientation';

import {DownloadTask} from '../core/Downloader';
import {Player} from '../components/Player';

export interface OfflinePlayerParams {
  task: DownloadTask;
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
  const {task} = params as OfflinePlayerParams;
  const navigation = useNavigation();

  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const subs = task.offlineSubtitles.map(
    (sub) =>
      ({
        title: sub.lang,
        type: 'text/vtt',
        language: sub.lang,
        uri: sub.url,
      } as Sub),
  );

  return <Player navigation={navigation} video={task.path} subtitles={subs} title={task.name} />;
};
