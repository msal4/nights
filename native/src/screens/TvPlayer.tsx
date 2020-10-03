import React, {useEffect, useRef} from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {TheoPlayer} from '../components/TheoPlayer';
import {TV} from './TV';
import {FlatList} from 'react-native';

const Player: React.FC<{src: string}> = ({src}) => {
  return (
    <TheoPlayer
      style={{aspectRatio: 1.7, marginBottom: 10}}
      source={{
        sources: [{src, type: 'application/x-mpegurl'}],
        textTracks: [],
      }}
      autoplay
    />
  );
};

export const TvPlayerScreen = () => {
  const {url, name} = useRoute().params as {url: string; name: string};
  const listRef = useRef<FlatList>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({headerTitle: name});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <TV
      listRef={listRef as any}
      header={<Player src={url} />}
      onPress={async (channel) => {
        listRef.current?.scrollToOffset({animated: true, offset: 0});
        navigation.navigate('TvPlayer', {url: channel.url, name: channel.name});
      }}
    />
  );
};
