import React from 'react';
import {Player} from '../components/Player';
import {useRoute} from '@react-navigation/native';

export const TvPlayerScreen = () => {
  const {url, name} = useRoute().params as {url: string; name: string};
  console.log('url:', url);
  return <Player video={url} title={name} />;
};
