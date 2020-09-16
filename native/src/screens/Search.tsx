import React, {useState, useEffect} from 'react';
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
import DropDownPicker from 'react-native-dropdown-picker';
import {getGenres} from '../api/genre';
import {Topic} from '../core/interfaces/topic';
import {capitalizeFirst} from '../utils/common';
import {defaultStackOptions} from '../utils/defaultStackOptions';

const Stack = createStackNavigator();

export const SearchScreen: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{...defaultStackOptions, headerShown: false}}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

const createOrderings = (t: (term: string) => string): Topic[] => [
  {id: 'name', name: t('nameAsc')},
  {id: '-name', name: t('nameDesc')},
  {id: '-views', name: `${t('popularity')} ${t('asc')}`},
  {id: 'views', name: `${t('popularity')} ${t('desc')}`},
  {id: 'rating', name: `${t('rating')} ${t('asc')}`},
  {id: '-rating', name: `${t('rating')} ${t('desc')}`},
  {id: 'created_at', name: t('releaseDateAsc')},
  {id: '-created_at', name: t('releaseDateDesc')},
];

const Search: React.FC = () => {
  const {setQuery, searchResults: result, setParams, params} = useSearch();
  const {width} = Dimensions.get('window');
  const numCards = Math.round(width / CARD_WIDTH);
  const cardWidth = width / numCards - 15 - 15 / numCards;
  const {t} = useLanguage();
  const {genres} = useGenres();

  const orderings: Topic[] = createOrderings(t);

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingLeft: 15}}>
        <Input
          placeholder={t('search')}
          containerStyle={{height: 50, marginRight: 15}}
          placeholderTextColor={colors.lightGray}
          inputStyle={{color: colors.white}}
          leftIcon={{type: 'ionicon', name: 'search-outline', color: colors.lightGray}}
          onChangeText={(value) => setQuery(value)}
        />

        {result && (
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {genres && (
              <Filter
                items={genres}
                name={t('genres')}
                onChange={(genre) => {
                  setParams({...params, genres: genre});
                }}
              />
            )}

            <Filter
              items={orderings}
              name={t('sort')}
              onChange={(item) => {
                setParams({...params, ordering: item});
              }}
            />

            <Filter
              items={[
                {id: null, name: t('type')} as any,
                {id: 'm', name: t('movies')},
                {id: 's', name: t('series')},
              ]}
              name={t('type')}
              onChange={(type) => {
                setParams({...params, type});
              }}
            />
            {result.result &&
              result.result.results.map((title) => <Title key={title.id} title={title} width={cardWidth} />)}
          </View>
        )}
        {!result || !result.result?.results.length || result.result.results.length < 6 ? (
          <View style={{height: 300}} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const Filter: React.FC<{name: string; items: Topic[]; onChange: (id: number) => void}> = ({
  items,
  name,
  onChange,
}) => {
  const [currentItem, setCurrentItem] = useState<number>();
  const width = 120;
  const {t} = useLanguage();

  return (
    <DropDownPicker
      items={items.map((g) => ({label: capitalizeFirst(g.name), value: g.id}))}
      defaultValue={currentItem}
      placeholder={name}
      searchable={items.length > 3}
      searchablePlaceholder={t('search')}
      searchablePlaceholderTextColor={colors.white + 'cc'}
      searchableStyle={{flex: 1, textAlign: 'center', color: colors.white}}
      style={{backgroundColor: colors.red, borderWidth: 0}}
      itemStyle={{
        justifyContent: 'flex-start',
      }}
      containerStyle={{marginBottom: 10, marginRight: 10, width}}
      dropDownStyle={{backgroundColor: colors.gray, borderWidth: 0}}
      labelStyle={{color: colors.white, textAlign: 'center', flex: 1}}
      arrowColor={colors.white}
      onChangeItem={(item) => {
        setCurrentItem(item.value);
        onChange(item.value);
      }}
    />
  );
};

const useGenres = () => {
  const {t} = useLanguage();
  const defaultGenre = {name: t('genres'), id: null};
  const [genres, setGenres] = useState<Topic[]>([defaultGenre as any]);

  useEffect(() => {
    getGenres()
      .then((data) => setGenres([defaultGenre as any, ...data]))
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {genres};
};

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [params, setParams] = useState({});

  const debouncedSearchFunction = useConstant(() => {
    return AwesomeDebouncePromise(getTitles, 300);
  });

  const searchResults = useAsync(async () => {
    return await debouncedSearchFunction({...params, search: query});
  }, [debouncedSearchFunction, query, params]);

  return {setQuery, searchResults, params, setParams};
};
