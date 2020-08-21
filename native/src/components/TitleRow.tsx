import React, {FunctionComponent} from 'react';

import Title from '../components/Title';
import {Title as ITitle} from '../core/interfaces/title';
import {FlatList} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import {capitalizeFirst} from '../utils/common';

export interface TitleRowProps {
  row: ITitle[];
  name: string;
}

const TitleRow: FunctionComponent<TitleRowProps> = ({row, name}) => {
  if (!row || !row.length) {
    return null;
  }

  return (
    <>
      <Text style={{fontSize: 22, marginBottom: 10, marginHorizontal: 10}}>{capitalizeFirst(name)}</Text>
      <FlatList
        data={row}
        renderItem={(title) => <Title key={title.item.id} title={title.item} />}
        keyExtractor={(title) => title.id.toString()}
        horizontal
        contentContainerStyle={{marginHorizontal: 10}}
      />
    </>
  );
};

export default TitleRow;
