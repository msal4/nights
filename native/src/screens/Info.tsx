import React, {FunctionComponent} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {useRoute} from '@react-navigation/native';

import {TitleDetail} from '../core/interfaces/title';
import {joinTopics} from '../utils/common';
import TitleRow from '../components/TitleRow';
import {useLanguage} from '../utils/lang';
import {colors} from '../constants/style';

interface InfoParams {
  title: TitleDetail;
}

export const InfoScreen: FunctionComponent = () => {
  const params: InfoParams = useRoute().params as any;
  const {title} = params;
  const {t} = useLanguage();

  if (title.cast.length > 3) {
    title.cast.length = 3;
  }

  return (
    <>
      <View style={{padding: 10}}>
        {title.plot ? (
          <View style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>{t('plot')}</Text>
            <Text style={{opacity: 0.75}}>{title.plot}</Text>
          </View>
        ) : null}
        {title.cast && title.cast.length ? (
          <View style={{marginBottom: 30}}>
            <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>{t('cast')}</Text>
            <Text style={{opacity: 0.75}}>{joinTopics(title.cast)}</Text>
          </View>
        ) : null}
        {title.imdb ? (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`https://imdb.com/title/${title.imdb}`);
            }}
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: colors.green,
              padding: 5,
              borderRadius: 5,
            }}>
            <Icon type="fontisto" name="imdb" color={colors.white} />
            <Text style={{fontSize: 15, marginLeft: 10}}>{t('seeOnImdb')}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TitleRow name={t('similar')} row={title.recommended} />
    </>
  );
};
