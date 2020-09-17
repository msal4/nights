import React, {FunctionComponent} from 'react';
import VideoPlayer from 'react-native-video-controls';

import {getImageUrl} from '../utils/common';
import {TitleDetail, ImageQuality} from '../core/interfaces/title';
import {StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';

interface TrailerParams {
  title: TitleDetail;
}

export const TrailerScreen: FunctionComponent = () => {
  const params: TrailerParams = useRoute().params as any;

  const {title} = params;
  const uri = title?.trailers[0]?.url.replace('{f}', 'mp4');
  const poster = getImageUrl(title.images[0]?.url, ImageQuality.h900);

  if (!uri) {
    return null;
  }

  return <VideoPlayer poster={poster} paused source={{uri}} style={styles.video} />;
};

var styles = StyleSheet.create({
  video: {
    marginTop: 10,
    maxHeight: 300,
    height: 300,
    width: '100%',
  },
});
