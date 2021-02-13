import React, {FunctionComponent} from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Image} from 'react-native-elements';

import {Title as ITitle} from '../core/interfaces/title';
import {getImageUrl} from '../utils/common';
import {CARD_WIDTH, colors} from '../constants/style';

export interface TitleProps {
  title: ITitle;
  width?: number;
}

const Title: FunctionComponent<TitleProps> = ({title, width}) => {
  const uri = getImageUrl(title.images[0]?.url);
  const cardWidth = width ?? CARD_WIDTH;
  const cardHeight = cardWidth * 1.6;
  const {t} = useTranslation();

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{marginRight: 15, marginBottom: 15}}
      onPress={() => {
        navigation.navigate('Detail', title);
      }}>
      <Image resizeMethod="resize" style={{height: cardHeight, width: cardWidth}} source={{uri}}>
        {title.is_new ? (
          <View
            style={{
              backgroundColor: colors.green,
              position: 'absolute',
              left: 3,
              top: 4,
              paddingHorizontal: 5,
              borderRadius: 2,
            }}>
            <Text style={{fontSize: 8, color: colors.black}}>
              {title.type === 's' ? t('newEpisodes') : t('new')}
            </Text>
          </View>
        ) : null}
      </Image>
    </TouchableOpacity>
  );
};

export default Title;
