import React, {FunctionComponent} from 'react';

import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-elements';
import {ViewHit} from '../core/interfaces/view-hit';
import {HistoryCard} from './HistoryCard';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

export interface HistoryRowProps {
  row: ViewHit[];
  onRefresh: () => void;
}

export const HistoryRow: FunctionComponent<HistoryRowProps> = ({row, onRefresh}) => {
  const {t} = useTranslation();
  if (!row || !row.length) {
    return null;
  }

  return (
    <>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{fontSize: 17, fontWeight: 'bold', marginBottom: 10, marginTop: 5, marginHorizontal: 10}}>
          {t('continueWatching')}
        </Text>
      </View>
      <FlatList
        data={row}
        renderItem={({item}) => <HistoryCard key={item.id} item={item} onDelete={onRefresh} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        contentContainerStyle={{marginHorizontal: 10}}
      />
    </>
  );
};
