import React, {useState, useCallback, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';

import tvClient from '../api/tv-client';

export const TVScreen: React.FC = () => {
  const {categories, error} = useRows();

  if (error || !categories) {
    return null;
  }

  return (
    <ScrollView>
      {categories.map((cat) => (
        <View key={cat.id}>
          <Text>{cat.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

interface Category {
  id: number;
  name: string;
  name_ar: string;
  channels: Channel[];
}

interface Channel {
  id: number;
  name: string;
  url: string;
  image: string;
  category: number;
  enabled: number;
}

const useRows = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [error, setError] = useState<Error | null>();

  const getChannels = useCallback(async () => {
    try {
      const {categories: data}: {categories: Category[]} = await tvClient.get('/categories');
      const {channels}: {channels: Channel[]} = await tvClient.get('/channels');
      const cats = data.map(
        (c) => ({...c, channels: channels.filter((ch) => ch.category === c.id)} as Category),
      );
      setCategories(cats);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }, []);

  useEffect(() => {
    getChannels();
  }, [getChannels]);

  return {categories, error, getChannels};
};
