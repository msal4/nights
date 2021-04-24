import React, {FunctionComponent, useRef} from 'react';
import {View, TouchableOpacity, ImageBackground} from 'react-native';
import {Text, Icon} from 'react-native-elements';

import {getImageUrl} from '../utils/common';
import {useNavigation} from '@react-navigation/native';
import {ViewHit} from '../core/interfaces/view-hit';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../constants/style';
import Menu, {MenuItem} from 'react-native-material-menu';
import {useTranslation} from 'react-i18next';
import {removeHit} from '../api/title';

export interface HistoryCardProps {
  item: ViewHit;
  onDelete: () => void;
}

export const HistoryCard: FunctionComponent<HistoryCardProps> = ({item, onDelete}) => {
  const uri = getImageUrl(item.topic.images[0]?.url);
  const progress = (item.playback_position / item.runtime) * 100;
  const menuRef = useRef<Menu>();
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{marginRight: 15, marginBottom: 15, width: 300}}
      onPress={() => {
        navigation.navigate('Detail', item.topic);
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <TouchableOpacity
          onPress={async () => {
            const title = item.topic;
            if (title.type === 'm') {
              navigation.navigate('MoviePlayer', {title});
            } else {
              navigation.navigate('SeriesPlayer', {title});
            }
          }}>
          <ImageBackground
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
          </ImageBackground>
        </TouchableOpacity>
        <View style={{marginLeft: 10, flex: 1}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{flexWrap: 'wrap', flex: 1}}>
              {item.topic.type === 's' ? `${item.episode?.name}` : item.topic.name}
            </Text>
            <Menu
              ref={menuRef as any}
              style={{backgroundColor: colors.gray}}
              button={
                <Icon
                  onPress={() => {
                    menuRef.current?.show();
                  }}
                  type="ionicon"
                  name="ellipsis-vertical-sharp"
                  color={colors.lightGray}
                />
              }>
              <MenuItem
                textStyle={{color: colors.white}}
                underlayColor={colors.blue}
                onPress={() => {
                  menuRef.current?.hide();
                  const title = item.topic;
                  if (title.type === 'm') {
                    navigation.navigate('MoviePlayer', {title});
                  } else {
                    navigation.navigate('SeriesPlayer', {title});
                  }
                }}>
                {t('play')}
              </MenuItem>
              <MenuItem
                textStyle={{color: colors.white}}
                underlayColor={colors.red}
                onPress={async () => {
                  menuRef.current?.hide();
                  console.log(item.id);
                  try {
                    await removeHit(item.id);
                  } catch (e) {
                    console.log(e);
                  }
                  onDelete();
                }}>
                {t('delete')}
              </MenuItem>
            </Menu>
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
