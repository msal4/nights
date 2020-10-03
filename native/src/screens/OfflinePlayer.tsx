import React from 'react';
import {useRoute} from '@react-navigation/native';

import {DownloadTask} from '../core/Downloader';
import {Player, Sub} from '../components/Player';

export interface OfflinePlayerParams {
  task: DownloadTask;
}

export const OfflinePlayerScreen: React.FC = () => {
  const {params} = useRoute();
  const {task} = params as OfflinePlayerParams;

  const subs = task.offlineSubtitles.map(
    (sub) =>
      ({
        title: sub.lang,
        type: 'text/vtt',
        language: sub.lang,
        uri: `file://${sub.url}`,
      } as Sub),
  );

  return <Player video={`file://${task.path}`} subtitles={subs} title={task.name} />;
};
