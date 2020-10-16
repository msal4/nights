import React, {useEffect, useRef} from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {TheoPlayer} from '../components/TheoPlayer';
import {TV} from './TV';
import {FlatList, Platform, StyleSheet} from 'react-native';
import Video from 'react-native-video';

const Player: React.FC<{src: string}> = ({src}) => {
  return Platform.OS === 'ios' ? (
    <Video controls source={{uri: src}} style={styles.player} />
  ) : (
    <TheoPlayer
      style={styles.player}
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
        if (Platform.OS === 'ios') {
          navigation.replace('TvPlayer', {url: channel.url, name: channel.name});
        } else {
          listRef.current?.scrollToOffset({animated: true, offset: 0});
          navigation.navigate('TvPlayer', {url: channel.url, name: channel.name});
        }
      }}
    />
  );
};

const styles = StyleSheet.create({player: {aspectRatio: 1.7, marginBottom: 10}});
