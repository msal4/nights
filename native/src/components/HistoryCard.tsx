import React, {FunctionComponent} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text, Icon} from 'react-native-elements';

import {getImageUrl} from '../utils/common';
import {useNavigation} from '@react-navigation/native';
import {ViewHit} from '../core/interfaces/view-hit';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../constants/style';

export interface HistoryCardProps {
  item: ViewHit;
}

export const HistoryCard: FunctionComponent<HistoryCardProps> = ({item}) => {
  const uri = getImageUrl(item.topic.images[0]?.url);
  const progress = (item.playback_position / item.runtime) * 100;

  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{marginRight: 15, marginBottom: 15, width: 300}}
      onPress={() => {
        navigation.navigate('Detail', item.topic);
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <TouchableOpacity>
          <Image
            style={{height: 70, width: 110, borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}
            source={{uri}}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: colors.blueGray,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 40,
              }}>
              <Icon type="ionicon" name="play" size={20} color={colors.white} style={{marginLeft: 2}} />
            </View>
          </Image>
        </TouchableOpacity>
        <View style={{marginLeft: 10, flex: 1}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{flexWrap: 'wrap', flex: 1}}>
              {item.topic.type === 's' ? `${item.episode?.name}` : item.topic.name}
            </Text>
          </View>
          <View style={{height: 5, backgroundColor: colors.gray, borderRadius: 999, overflow: 'hidden'}}>
            <LinearGradient
              useAngle
              angle={90}
              colors={[colors.blue, colors.red]}
              style={{height: '100%', width: `${progress}%`}}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
