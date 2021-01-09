import React, {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-elements';

import {Category, Channel} from '../core/interfaces/channel';
import {ChannelCard} from './ChannelCard';

const ChannelRow: FunctionComponent<{category: Category; onPress?: (channel: Channel) => void}> = ({
  category,
  onPress,
}) => {
  const {
    i18n: {language: lang},
  } = useTranslation();
  if (!category.channels || !category.channels.length) {
    return null;
  }

  return (
    <>
      <Text style={{fontSize: 17, marginBottom: 10, marginHorizontal: 10}}>
        {lang === 'en' ? category.name : category.name_ar}
      </Text>
      <FlatList
        data={category.channels}
        renderItem={({item}) => (
          <ChannelCard key={item.id} channel={item} onPress={onPress && (() => onPress(item))} />
        )}
        keyExtractor={(channel) => channel.id.toString()}
        horizontal
        contentContainerStyle={{marginHorizontal: 10}}
      />
    </>
  );
};

export default ChannelRow;
