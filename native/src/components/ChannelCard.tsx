import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import {Channel} from '../core/interfaces/channel';
import {tvBaseURL} from '../constants/const';

export interface ChannelProps {
  channel: Channel;
}

export const ChannelCard: FunctionComponent<ChannelProps> = ({channel}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{marginRight: 15, marginBottom: 15}}
      onPress={() => {
        navigation.navigate('Channel', channel);
      }}>
      <Image
        style={{height: 200, width: 200}}
        source={{uri: `${tvBaseURL}${channel.image}`, cache: 'force-cache'}}
      />
    </TouchableOpacity>
  );
};
