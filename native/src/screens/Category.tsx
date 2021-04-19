import React, {useState, useEffect} from 'react';
import {View, Dimensions, ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Axios from 'axios';

import {CARD_WIDTH} from '../constants/style';
import {getTitles} from '../api/title';
import {PaginatedResults} from '../core/interfaces/paginated-results';
import {Title as ITitle} from '../core/interfaces/title';
import Title from '../components/Title';
import {isCloseToBottom} from '../utils/common';
import {useRoute} from '@react-navigation/native';

export const CategoryScreen: React.FC = () => {
  const {params}: any = useRoute();
  const {result, getMore, loading} = useCategory(params.id);
  const {width} = Dimensions.get('window');
  const numCards = Math.round(width / CARD_WIDTH);
  const cardWidth = width / numCards - 15 - 15 / numCards;

  return (
    <ScrollView
      contentContainerStyle={{paddingLeft: 15, paddingVertical: 15}}
      scrollEventThrottle={100}
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
          getMore();
        }
      }}>
      {result && (
        <View
          style={{
            // marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {result && result.results.map((title) => <Title key={title.id} title={title} width={cardWidth} />)}
        </View>
      )}
      {!result || !result?.results.length || result.results.length < 6 ? (
        <View style={{height: 300}} />
      ) : null}
      <View style={{height: 40}} />
      {loading ? <ActivityIndicator style={{marginTop: -35}} color="white" size="small" /> : null}
    </ScrollView>
  );
};

const useCategory = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaginatedResults<ITitle[]>>();

  useEffect(() => {
    getTitles({genres: id}).then((resp) => setResult(resp));
  }, [id]);

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

  return {loading, getMore, result};
};
