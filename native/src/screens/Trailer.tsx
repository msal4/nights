import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {getImageUrl} from '../utils/common';
import {TitleDetail, ImageQuality} from '../core/interfaces/title';
import {TheoPlayer} from '../components/TheoPlayer';
import Video from 'react-native-video';

interface TrailerParams {
  title: TitleDetail;
}

export const TrailerScreen: FunctionComponent = () => {
  const params: TrailerParams = useRoute().params as any;
  const player = useRef<Video>();
  const navigation = useNavigation();
  const [paused, setPaused] = useState(false);

  const {title} = params;
  const src = title?.trailers[0]?.url.replace('{f}', 'mp4');
  const poster = getImageUrl(title.images[0]?.url, ImageQuality.h900);

  if (!src) {
    return null;
  }

  const width = Math.floor(Dimensions.get('window').width);

  useEffect(() => {
    const blur = navigation.addListener('blur', () => {
      setPaused(true);
    });

    return () => {
      navigation.removeListener('blur', blur);
    };
  }, []);

  return Platform.OS === 'ios' ? (
    <Video
      ref={player as any}
      paused={paused}
      poster={poster}
      controls
      muted
      source={{uri: src}}
      style={{...styles.video, width}}
    />
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
