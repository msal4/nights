import React, {FunctionComponent} from 'react';
import Video from 'react-native-video';

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
  // const player = useRef<Video>();
  const uri = title?.trailers[0]?.url.replace('{f}', 'mp4');
  const poster = getImageUrl(title.images[0]?.url, ImageQuality.h900);

  if (!uri) {
    return null;
  }

  return (
    <Video
      poster={poster}
      controls
      paused
      source={{uri}} // Can be a URL or a local file.
      // ref={player} // Store reference
      onBuffer={() => {
        console.log('buffering...');
      }} // Callback when remote video is buffering
      onError={(e) => {
        console.log('error:', e.error.errorString);
      }} // Callback when video cannot be loaded
      style={styles.video}
    />
  );
};

var styles = StyleSheet.create({
  video: {
    marginTop: 10,
    height: 300,
    width: '100%',
  },
});
