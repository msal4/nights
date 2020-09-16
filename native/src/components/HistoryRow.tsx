import React, {FunctionComponent} from 'react';

import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-elements';
import {ViewHit} from '../core/interfaces/view-hit';
import {useLanguage} from '../utils/lang';
import {HistoryCard} from './HistoryCard';
import {View} from 'react-native';

export interface HistoryRowProps {
  row: ViewHit[];
}

export const HistoryRow: FunctionComponent<HistoryRowProps> = ({row}) => {
  const {t} = useLanguage();
  if (!row || !row.length) {
    return null;
  }

  return (
    <>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 17, marginBottom: 10, marginTop: 5, marginHorizontal: 10}}>
          {t('continueWatching')}
        </Text>
      </View>
      <FlatList
        data={row}
        renderItem={({item}) => <HistoryCard key={item.id} item={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        contentContainerStyle={{marginHorizontal: 10}}
      />
    </>
  );
};
