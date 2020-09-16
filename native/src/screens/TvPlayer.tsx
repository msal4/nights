import React from 'react';
import {Player} from '../components/Player';
import {useNavigation, useRoute} from '@react-navigation/native';

export const TvPlayerScreen = () => {
  const navigation = useNavigation();
  const {url, name} = useRoute().params as {url: string; name: string};

  return <Player video={url} title={name} navigation={navigation} />;
};
