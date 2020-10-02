import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import {Channel} from '../core/interfaces/channel';
import {tvBaseURL} from '../constants/const';

export interface ChannelProps {
  channel: Channel;
  onPress?: () => void;
}

export const ChannelCard: FunctionComponent<ChannelProps> = ({channel, onPress}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{marginRight: 15, marginBottom: 15}}
      onPress={
        onPress ||
        (() => {
          navigation.navigate('TvPlayer', {url: channel.url, name: channel.name});
        })
      }>
      <Image
        style={{height: 110, width: 110}}
        source={{uri: `${tvBaseURL}${channel.image}`, cache: 'force-cache'}}
      />
    </TouchableOpacity>
  );
};
