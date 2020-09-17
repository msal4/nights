import React, {FunctionComponent} from 'react';

import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-elements';
import {Category} from '../core/interfaces/channel';
import {ChannelCard} from './ChannelCard';
import {useLanguage} from '../utils/lang';

const ChannelRow: FunctionComponent<{category: Category}> = ({category}) => {
  const {lang} = useLanguage();
  if (!category.channels || !category.channels.length) {
    return null;
  }

  return (
    <>
      <Text style={{fontSize: 22, marginBottom: 10, marginHorizontal: 10}}>
        {(category as any)['name' + (lang === 'en' ? '' : '_ar')]}
      </Text>
      <FlatList
        data={category.channels}
        renderItem={({item}) => <ChannelCard key={item.id} channel={item} />}
        keyExtractor={(channel) => channel.id.toString()}
        horizontal
        contentContainerStyle={{marginHorizontal: 10}}
      />
    </>
  );
};

export default ChannelRow;
