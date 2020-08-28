import React, {useState} from 'react';
import {ScrollView, View, Dimensions} from 'react-native';
import {Input} from 'react-native-elements';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import {useAsync} from 'react-async-hook';
import {SafeAreaView} from 'react-native-safe-area-context';

import {colors, CARD_WIDTH} from '../constants/style';
import {getTitles} from '../api/title';
import Title from '../components/Title';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailScreen} from './Detail';
import {useLanguage} from '../utils/lang';

const Search: React.FC = () => {
  const {setQuery, searchResults: result} = useSearch();
  const {width} = Dimensions.get('window');
  const numCards = Math.round(width / CARD_WIDTH);
  const cardWidth = width / numCards - 15;
  const {t} = useLanguage();

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <ScrollView>
        <Input
          placeholder={t('search')}
          placeholderTextColor={colors.lightGray}
          inputStyle={{color: colors.white}}
          leftIcon={{type: 'ionicon', name: 'search-outline', color: colors.lightGray}}
          onChangeText={(value) => setQuery(value)}
        />
        {result && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {result.result &&
              result.result.results.map((title) => <Title key={title.id} title={title} width={cardWidth} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const useSearch = () => {
  const [query, setQuery] = useState('');

  const debouncedSearchFunction = useConstant(() => {
    return AwesomeDebouncePromise(getTitles, 300);
  });

  const searchResults = useAsync(async () => {
    return await debouncedSearchFunction({search: query});
  }, [debouncedSearchFunction, query]);

  return {setQuery, searchResults};
};

const Stack = createStackNavigator();
export const SearchScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};
