import React, {useState, useCallback, useEffect} from 'react';
import {ScrollView, View, Dimensions} from 'react-native';

import {CARD_WIDTH} from '../constants/style';
import {getMyList} from '../api/title';
import Title from '../components/Title';
import {PaginatedResults} from '../core/interfaces/paginated-results';
import {Title as ITitle} from '../core/interfaces/title';

export const MyListScreen = () => {
  const {myList} = useMyList();

  const {width} = Dimensions.get('window');
  const numCards = Math.round(width / CARD_WIDTH);
  const cardWidth = width / numCards - 15;

  return (
    <ScrollView>
      {myList && (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
          {myList.results.map((title) => (
            <Title key={title.id} title={title} width={cardWidth} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const useMyList = () => {
  const [myList, setTitles] = useState<PaginatedResults<ITitle[]>>();
  const [error, setError] = useState<PaginatedResults<ITitle[]>>();

  const fetchMyList = useCallback(async () => {
    try {
      const data = await getMyList();
      setTitles(data);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    fetchMyList();
  }, [fetchMyList]);

  return {myList, fetchMyList, error};
};
