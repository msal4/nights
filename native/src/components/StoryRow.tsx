import React, {FunctionComponent} from 'react';
import {View, Image} from 'react-native';

import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from 'react-native-elements';
import {colors} from '../constants/style';
import {useNavigation} from '@react-navigation/native';
import {Story} from '../core/interfaces/story';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';

export interface StoryRowProps {
  row: Story[];
}

export const StoryRow: FunctionComponent<StoryRowProps> = ({row}) => {
  const {t} = useTranslation();
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
          {t('stories')}
        </Text>
      </View>
      <FlatList
        data={row}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => {
                navigation.navigate('Story', {stories: row, index});
              }}>
              <LinearGradient
                colors={[colors.red, colors.blue]}
                angle={-45}
                useAngle
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 999,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  key={item.id}
                  style={{
                    width: 90,
                    height: 90,
                    borderWidth: 4,
                    borderColor: colors.black,
                    overflow: 'hidden',
                    borderRadius: 999,
                  }}
                  source={{uri: item.image.replace('original/', '300/')}}
                />
              </LinearGradient>
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
