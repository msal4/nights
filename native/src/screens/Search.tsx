import React, {useState, useEffect} from 'react';
import {View, Dimensions, ActivityIndicator} from 'react-native';
import {Input} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import {useAsync} from 'react-async-hook';
import {SafeAreaView} from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker2';
import {createStackNavigator} from '@react-navigation/stack';
import dayjs from 'dayjs';

import {colors, CARD_WIDTH} from '../constants/style';
import {getTitles} from '../api/title';
import {DetailScreen} from './Detail';
import {getGenres} from '../api/genre';
import {Topic} from '../core/interfaces/topic';
import {capitalizeFirst, isCloseToBottom} from '../utils/common';
import {defaultStackOptions} from '../utils/defaultStackOptions';
import Axios from 'axios';
import {PaginatedResults} from '../core/interfaces/paginated-results';
import {Title as ITitle} from '../core/interfaces/title';
import Title from '../components/Title';
import {useTranslation} from 'react-i18next';

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

const createYears = (t: (term: string) => string) => {
  const years = [t('year')];
  const end = dayjs().locale('en').year();
  const start = 1920;
  for (let year = start; year <= end; year++) {
    years.push(year.toString());
  }
  return years;
};

const Search: React.FC = () => {
  const {setQuery, query, result, setParams, params, getMore, loading} = useSearch();
  const {width} = Dimensions.get('window');
  const numCards = Math.round(width / CARD_WIDTH);
  const cardWidth = width / numCards - 15 - 15 / numCards;
  const {t} = useTranslation();
  const {genres} = useGenres();
  const [isVisible, setIsVisible] = useState(true);

  const orderings: Topic[] = createOrderings(t);
  const years = createYears(t);

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{paddingLeft: 15}}
        scrollEventThrottle={100}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            getMore();
          }
        }}>
        <Input
          placeholder={t('search')}
          keyboardAppearance="dark"
          returnKeyType="search"
          containerStyle={{height: 50, marginRight: 15}}
          placeholderTextColor={colors.lightGray}
          inputStyle={{color: colors.white}}
          leftIcon={{type: 'ionicon', name: 'search-outline', color: colors.lightGray}}
          rightIcon={{
            type: 'ionicon',
            name: 'close-outline',
            color: colors.lightGray,
            size: 20,
            onPress: () => {
              setParams({});
              setQuery('');
              setIsVisible(false);
              setTimeout(() => {
                setIsVisible(true);
              });
            },
            disabled: !Object.keys(params).length && !query,
            disabledStyle: {backgroundColor: 'transparent', opacity: 0.5},
            containerStyle: {
              borderRadius: 100,
              marginLeft: 10,
              backgroundColor: colors.gray,
              padding: 5,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
          value={query}
          onChangeText={(value) => setQuery(value)}
        />
        {isVisible ? (
          <View
            style={{
              zIndex: 1000,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 10,
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

            <Filter
              items={years.map((item) => ({id: item!, name: item!}))}
              name={t('year')}
              onChange={(year) => {
                setParams({...params, released_at: year.toString() === t('year') ? null : year});
              }}
            />
          </View>
        ) : null}
        {result && (
          <View
            style={{
              // marginTop: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {result &&
              result.results.map((title) => <Title key={title.id} title={title} width={cardWidth} />)}
          </View>
        )}
        {!result || !result?.results.length || result.results.length < 6 ? (
          <View style={{height: 300}} />
        ) : null}
        <View style={{height: 40}} />
        {loading ? <ActivityIndicator style={{marginTop: -35}} color="white" size="small" /> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const Filter: React.FC<{
  name: string;
  items: Topic[];
  onChange: (id: number) => void;
}> = ({items, name, onChange}) => {
  const width = 85;
  const height = 'auto';
  const {t} = useTranslation();

  return (
    <DropDownPicker
      items={items.map((g) => ({label: capitalizeFirst(g.name), value: g.id}))}
      defaultValue={null}
      placeholder={name}
      searchable={items.length > 3}
      searchablePlaceholder={t('search')}
      searchablePlaceholderTextColor={colors.white + 'cc'}
      searchableStyle={{
        flex: 1,
        textAlign: 'center',
        color: colors.white,
        fontSize: 10,
        height: 30,
        padding: 0,
      }}
      style={{backgroundColor: colors.red, borderWidth: 0, height: 'auto'}}
      itemStyle={{
        justifyContent: 'flex-start',
        height,
      }}
      containerStyle={{marginBottom: 10, marginRight: 10, width, height}}
      dropDownStyle={{backgroundColor: colors.gray, borderWidth: 0, padding: 0}}
      labelStyle={{color: colors.white, textAlign: 'center', flex: 1, fontSize: 10, padding: 0}}
      arrowColor={colors.white}
      onChangeItem={(item: any) => {
        // setCurrentItem(item.value);
        onChange(item.value);
      }}
      activeLabelStyle={{backgroundColor: colors.white + '55', borderRadius: 100}}
      zIndex={100}
    />
  );
};

const useGenres = () => {
  const {t} = useTranslation();
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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaginatedResults<ITitle[]>>();

  const debouncedSearchFunction = useConstant(() => {
    return AwesomeDebouncePromise(getTitles, 300);
  });

  const searchResults = useAsync(
    async () => {
      return await debouncedSearchFunction({...params, search: query});
    },
    [debouncedSearchFunction, query, params],
    {
      onSuccess: (res) => {
        setResult(res);
      },
    },
  );

  const getMore = async () => {
    if (!result || loading || !result.next) {
      return;
    }

    setLoading(true);

    try {
      const {data} = await Axios.get<PaginatedResults<ITitle[]>>(result.next);
      const results = [...result.results, ...data.results];

      data.results = results;

      setResult(data);
    } catch {}

    setLoading(false);
  };

  return {query, setQuery, searchResults, params, setParams, loading, getMore, result};
};
