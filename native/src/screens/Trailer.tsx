import React, {FunctionComponent} from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {getImageUrl} from '../utils/common';
import {TitleDetail, ImageQuality} from '../core/interfaces/title';
import {TheoPlayer} from '../components/TheoPlayer';
import Video from 'react-native-video';

interface TrailerParams {
  title: TitleDetail;
}

export const TrailerScreen: FunctionComponent = () => {
  const params: TrailerParams = useRoute().params as any;

  const {title} = params;
  const src = title?.trailers[0]?.url.replace('{f}', 'mp4');
  const poster = getImageUrl(title.images[0]?.url, ImageQuality.h900);

  if (!src) {
    return null;
  }

  const width = Math.floor(Dimensions.get('window').width);

  return Platform.OS === 'ios' ? (
    <Video poster={poster} controls source={{uri: src}} style={{...styles.video, width}} />
  ) : (
    <TheoPlayer
      source={{sources: [{src, type: 'video/mp4'}], textTracks: [], poster}}
      style={{...styles.video, width}}
    />
  );
};

var styles = StyleSheet.create({
  video: {
    marginTop: 10,
    // width: '100%',
    // flex: 1,
    aspectRatio: 1.7,
  },
});
