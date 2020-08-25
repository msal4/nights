import React, {FunctionComponent} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text} from 'react-native-elements';

import {Title as ITitle} from '../core/interfaces/title';
import {getImageUrl} from '../utils/common';
import {CARD_WIDTH, colors} from '../constants/style';
import {useNavigation} from '@react-navigation/native';
import {useLanguage} from '../utils/lang';

export interface TitleProps {
  title: ITitle;
  width?: number;
}

const Title: FunctionComponent<TitleProps> = ({title, width}) => {
  const uri = getImageUrl(title.images[0]?.url);
  const cardWidth = width ?? CARD_WIDTH;
  const cardHeight = cardWidth * 1.6;
  const {t, lang} = useLanguage();

  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{marginRight: 15, marginBottom: 15}}
      onPress={() => {
        navigation.navigate('Detail', title);
      }}>
      <Image style={{height: cardHeight, width: cardWidth}} source={{uri}}>
        {title.is_new ? (
          <View
            style={{
              backgroundColor: colors.green,
              position: 'absolute',
              left: 2,
              top: 5,
              paddingHorizontal: 5,
              paddingBottom: lang === 'ar' ? 3 : 1,
            }}>
            <Text style={{fontSize: 12}}>{title.type === 's' ? t('newEpisodes') : t('new')}</Text>
          </View>
        ) : null}
      </Image>
    </TouchableOpacity>
  );
};

export default Title;
