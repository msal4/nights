import React, {FunctionComponent} from 'react';

import {ImageQuality, Title as ITitle} from '../core/interfaces/title';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Image, Text} from 'react-native-elements';
import {getImageUrl, joinTopics} from '../utils/common';
import {View} from 'react-native';
import {useLanguage} from '../utils/lang';
import {CARD_WIDTH, colors} from '../constants/style';
import {useNavigation} from '@react-navigation/native';

export interface ComingSoonRowProps {
  row: ITitle[];
}

export const ComingSoonRow: FunctionComponent<ComingSoonRowProps> = ({row}) => {
  const {t} = useLanguage();
  const navigation = useNavigation();

  if (!row || !row.length) {
    return null;
  }

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{fontSize: 17, fontWeight: 'bold', marginBottom: 10, marginTop: 5, marginHorizontal: 10}}>
          {t('comingSoon')}
        </Text>
      </View>
      <FlatList
        data={row}
        renderItem={({item}) => {
          if (item.genres.length > 3) {
            item.genres.length = 3;
          }

          return (
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => {
                navigation.navigate('Detail', item);
              }}>
              <Image
                key={item.id}
                style={{width: 280, height: CARD_WIDTH * 1.4, overflow: 'hidden', borderRadius: 15}}
                source={{uri: getImageUrl(item.images[0]?.url, ImageQuality.h900)}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 17,
                  marginTop: 10,
                  marginBottom: 5,
                }}>
                {item.name.length > 28 ? item.name.substring(0, 28) + '...' : item.name}
              </Text>
              <Text
                style={{
                  color: colors.lightGray,
                  textAlign: 'center',
                  marginHorizontal: 10,
                }}>
                {joinTopics(item.genres)}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(title) => title.id.toString()}
        horizontal
        contentContainerStyle={{marginHorizontal: 10, marginBottom: 15}}
      />
    </>
  );
};
