import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView} from 'react-native-gesture-handler';

import {HomePromo} from '../components/HomePromo';
import {getGenreRows} from '../api/home';
import {GenreRow} from '../core/interfaces/home';
import {PaginatedResults} from '../core/interfaces/paginated-results';
import client from '../api/client';
import TitleRow from '../components/TitleRow';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailScreen} from './Detail';

const Home = () => {
  const {rows} = useRows();

  return (
    <ScrollView>
      <HomePromo />
      {rows && rows.results.map((row) => <TitleRow key={row.id} row={row.title_list} name={row.name} />)}
    </ScrollView>
  );
};

const Stack = createStackNavigator();

export const HomeScreen: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

const useRows = () => {
  const [rows, setRows] = useState<PaginatedResults<GenreRow[]>>();
  const [error, setError] = useState<Error | null>();

  const getRows = useCallback(async (refresh = true, params?: any) => {
    try {
      if (!refresh && rows) {
        const res = (await client.get(rows.next)) as PaginatedResults<GenreRow[]>;
        setRows({...res, results: [...rows.results, ...res.results]});
        return;
      }
      const data = await getGenreRows(params);
      setRows(data);
      setError(null);
    } catch (err) {
      setError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRows();
  }, [getRows]);

  return {rows, error, getRows};
};
