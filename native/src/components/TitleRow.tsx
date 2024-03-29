import React, {FunctionComponent} from 'react';

import Title from '../components/Title';
import {Title as ITitle} from '../core/interfaces/title';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon, Text} from 'react-native-elements';
import {capitalizeFirst} from '../utils/common';
import {View} from 'react-native';
import {colors} from '../constants/style';
import {useTranslation} from 'react-i18next';

export interface TitleRowProps {
  row: ITitle[];
  name: string;
  onSeeMore?: () => void;
}

const TitleRow: FunctionComponent<TitleRowProps> = ({row, name, onSeeMore}) => {
  const {t} = useTranslation();

  if (!row || !row.length) {
    return null;
  }

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{fontSize: 17, fontWeight: 'bold', marginBottom: 10, marginTop: 5, marginHorizontal: 10}}>
          {capitalizeFirst(name)}
        </Text>
        {onSeeMore ? (
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={onSeeMore}>
            <Text>{t('seeMore')}</Text>
            <Icon type="ionicon" name="chevron-forward-sharp" color={colors.red} />
          </TouchableOpacity>
        ) : null}
      </View>
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
