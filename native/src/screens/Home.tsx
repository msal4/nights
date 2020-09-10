import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView} from 'react-native-gesture-handler';

import {getGenreRows, getPromos, getRecentlyAdded, getTrending} from '../api/home';
import {GenreRow} from '../core/interfaces/home';
import {PaginatedResults} from '../core/interfaces/paginated-results';
import TitleRow from '../components/TitleRow';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailScreen} from './Detail';
import {useLanguage} from '../utils/lang';
import {useNavigation} from '@react-navigation/native';
import {TitleDetail, ImageQuality, Title} from '../core/interfaces/title';
import {checkMyList, addToMyList, removeFromMyList, getHistory} from '../api/title';
import {Image, Icon, Text} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {View, TouchableOpacity, SafeAreaView, NativeScrollEvent, RefreshControl} from 'react-native';
import {colors, PROMO_HEIGHT} from '../constants/style';
import {getImageUrl, joinTopics} from '../utils/common';
import {ViewHit} from '../core/interfaces/view-hit';
import {HistoryRow} from '../components/HistoryRow';
import {useAuth} from '../context/auth-context';
import GoogleCast from 'react-native-google-cast';
import UrlBase from '../utils/url-base';
import {useUrl} from '../context/url-context';
const {client} = UrlBase;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const Home = () => {
  const [params, setParams] = useState<Params>({});
  const {promo, inMyList, setInMyList, getPromoTitle} = usePromo(params);
  const {rows, getRows, recentlyAdded, trending} = useRows(params);
  const {t} = useLanguage();
  const {history, getHits} = useHistory();
  const {token} = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {isPrivate} = useUrl();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getRows(true, params);
    await getHits();
    await getPromoTitle(params);
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <ScrollView
      scrollEventThrottle={100}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          titleColor={colors.white}
          title={t('refreshing')}
          tintColor={colors.white}
        />
      }
      onScroll={({nativeEvent}) => {
        console.log(nativeEvent);
        if (isCloseToBottom(nativeEvent)) {
          getRows(false);
        }
      }}>
      <Image
        source={{uri: getImageUrl(promo?.images[0]?.url, ImageQuality.h900)}}
        style={{height: PROMO_HEIGHT}}>
        <LinearGradient colors={['#000000', '#00000000', '#000']} style={{height: '100%'}}>
          <SafeAreaView style={{flex: 1, justifyContent: 'space-between'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
                marginHorizontal: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setParams({});
                }}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={{width: 100, height: 50}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setParams({type: 'm'});
                }}>
                <Text style={{fontSize: 17, fontWeight: params.type === 'm' ? 'bold' : 'normal'}}>
                  {t('movies')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setParams({type: 's'});
                }}>
                <Text style={{fontSize: 17, fontWeight: params.type === 's' ? 'bold' : 'normal'}}>
                  {t('series')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setParams({rated: 'G'});
                }}>
                <Text style={{fontSize: 17, fontWeight: params.rated === 'G' ? 'bold' : 'normal'}}>
                  {t('kids')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Detail', promo);
                }}>
                <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 25, marginBottom: 10}}>
                  {promo?.name}
                </Text>
                <Text
                  style={{
                    marginBottom: 15,
                    color: colors.lightGray,
                    textAlign: 'center',
                    marginHorizontal: 10,
                  }}>
                  {joinTopics(promo?.genres)}
                </Text>
              </TouchableOpacity>
              <View style={{marginHorizontal: 50}}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <Icon
                    type="ionicon"
                    name={inMyList ? 'checkmark' : 'add'}
                    size={50}
                    color={colors.blue}
                    onPress={async () => {
                      if (!promo) {
                        return;
                      }
                      if (!token) {
                        navigation.navigate('Login');
                      }

                      if (inMyList) {
                        try {
                          await removeFromMyList(promo.id);
                          setInMyList(false);
                        } catch {}
                      } else {
                        try {
                          await addToMyList(promo.id);
                          setInMyList(true);
                        } catch {}
                      }
                    }}
                  />
                  {isPrivate ? (
                    <TouchableOpacity
                      style={{
                        width: 80,
                        height: 80,
                        backgroundColor: colors.red,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 40,
                      }}
                      onPress={async () => {
                        const state = await GoogleCast.getCastState();
                        if (state === 'Connected') {
                          if (promo?.type === 'm') {
                            GoogleCast.castMedia({
                              mediaUrl: promo.videos[0]?.url.replace('{q}', '720').replace('{f}', 'mp4'),
                              imageUrl: getImageUrl(promo.images[0].url, ImageQuality.h900),
                              posterUrl: getImageUrl(promo.images[0].url),
                              title: promo.name,
                              subtitle: promo.plot,
                              studio: '1001 Nights',
                              streamDuration: promo.runtime || 0, // seconds
                            });
                          }
                        } else {
                          if (promo?.type === 'm') {
                            navigation.navigate('MoviePlayer', {title: promo});
                          } else {
                            navigation.navigate('SeriesPlayer', {title: promo});
                          }
                        }
                      }}>
                      <Icon
                        type="ionicon"
                        name="play"
                        size={50}
                        color={colors.white}
                        style={{marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  ) : null}
                  <Icon
                    type="ionicon"
                    name="information-circle-outline"
                    size={50}
                    color={colors.blue}
                    onPress={() => {
                      navigation.navigate('Detail', promo);
                    }}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Image>
      {/* end of promo */}
      {history && isPrivate ? <HistoryRow row={history} /> : null}
      {/* recently added */}
      {recentlyAdded && <TitleRow row={recentlyAdded.results} name={t('recentlyAdded')} />}
      {/* trending */}
      {trending && <TitleRow row={trending.results} name={t('trending')} />}
      {/* rows */}
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

interface Params {
  limit?: number;
  rated?: string;
  type?: string;
}

const useHistory = () => {
  const [history, setHistory] = useState<ViewHit[] | null>();
  const {token} = useAuth();

  const getHits = useCallback(async () => {
    try {
      const data = await getHistory();
      setHistory(data.results);
    } catch {
      setHistory(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    getHits();
  }, [getHits]);

  return {history, getHits};
};

const usePromo = (params: Params) => {
  const [promo, setPromo] = useState<TitleDetail>();
  const [inMyList, setInMyList] = useState(false);
  const [error, setError] = useState<Error | null>();

  const getPromoTitle = async (prms?: Params) => {
    try {
      const promos = await getPromos({...params, ...(prms ?? {}), limit: 1});
      const p = promos[0];
      setPromo(p);
      await checkMyList(p.id);
      setInMyList(true);
      setError(null);
    } catch (err) {
      setError(err);
      setInMyList(false);
    }
  };
  useEffect(() => {
    getPromoTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return {promo, inMyList, setInMyList, error, getPromoTitle};
};

const useRows = (params: Params) => {
  const [rows, setRows] = useState<PaginatedResults<GenreRow[]>>();
  const [recentlyAdded, setRecentlyAdded] = useState<PaginatedResults<Title[]>>();
  const [trending, setTrending] = useState<PaginatedResults<Title[]>>();
  const [error, setError] = useState<Error | null>();
  const [loading, setLoading] = useState(false);

  const getRows = async (refresh = true, p?: Params) => {
    try {
      if (!refresh && rows) {
        if (loading) {
          return;
        }
        setLoading(true);
        const res = (await client.get(rows.next)) as PaginatedResults<GenreRow[]>;
        setRows({...res, results: [...rows.results, ...res.results]});
        setLoading(false);
        return;
      }
      setLoading(true);
      const newParams = {...params, ...(p || {})} as Params;
      const recent = await getRecentlyAdded(newParams);
      setRecentlyAdded(recent);
      const trend = await getTrending(newParams);
      setTrending(trend);
      const data = await getGenreRows(newParams);
      setRows(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return {rows, recentlyAdded, trending, error, getRows};
};
