import React, {FunctionComponent} from 'react';

import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-elements';
import {Category, Channel} from '../core/interfaces/channel';
import {ChannelCard} from './ChannelCard';
import {useLanguage} from '../utils/lang';

const ChannelRow: FunctionComponent<{category: Category; onPress?: (channel: Channel) => void}> = ({
  category,
  onPress,
}) => {
  const {lang} = useLanguage();
  if (!category.channels || !category.channels.length) {
    return null;
  }

  return (
    <>
      <Text style={{fontSize: 17, marginBottom: 10, marginHorizontal: 10}}>
        {(category as any)['name' + (lang === 'en' ? '' : '_ar')]}
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
