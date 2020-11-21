import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import {Image, Icon, Text} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {View, TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions} from 'react-native';

import {getGenreRows, getPromos, getRecentlyAdded, getTrending} from '../api/home';
import {GenreRow} from '../core/interfaces/home';
import {PaginatedResults} from '../core/interfaces/paginated-results';
import TitleRow from '../components/TitleRow';
import {DetailScreen} from './Detail';
import {useLanguage} from '../utils/lang';
import {TitleDetail, ImageQuality, Title} from '../core/interfaces/title';
import {checkMyList, addToMyList, removeFromMyList, getHistory, getTitles} from '../api/title';
import {colors} from '../constants/style';
import {getImageUrl, isCloseToBottom, joinTopics} from '../utils/common';
import {ViewHit} from '../core/interfaces/view-hit';
import {HistoryRow} from '../components/HistoryRow';
import {useAuth} from '../context/auth-context';
import UrlBase from '../utils/url-base';
import {useUrl} from '../context/url-context';
import {defaultStackOptions} from '../utils/defaultStackOptions';
import {ComingSoonRow} from '../components/ComingSoonRow';
import {Story} from '../core/interfaces/story';
import {getStories} from '../api/story';
import {StoryRow} from '../components/StoryRow';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export const HomeScreen: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{...defaultStackOptions, headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

type Promo = TitleDetail & {inMyList?: boolean};

const Home = () => {
  const [params, setParams] = useState<Params>({});
  const {promo, picked, setPromo, setPicked, getPromoTitle} = usePromos(params);
  const {rows, getRows, recentlyAdded, trending, stories, comingSoon, loading} = useRows(params);
  const {t} = useLanguage();
  const {history, getHits} = useHistory();
  const {token} = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {isPrivate} = useUrl();
  const scrollView = useRef<ScrollView>();
  const {top} = useSafeAreaInsets();

  const reload = async () => {
    await getRows(true, params);
    await getHits();
    await getPromoTitle(params);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getHits();
      getPromoTitle(params);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const addToList = async (
    token: string | undefined | null,
    title: Promo | undefined,
    setItem: (promo: Promo) => void,
  ) => {
    if (!title) {
      return;
    }

    if (!token) {
      navigation.navigate('More', {screen: 'Login', initial: false});
    }

    if (title.inMyList) {
      try {
        await removeFromMyList(title.id);
        setItem({...title, inMyList: false});
      } catch {}
    } else {
      try {
        await addToMyList(title.id);
        setItem({...title, inMyList: true});
      } catch {}
    }
  };

  const {width} = Dimensions.get('screen');
  const promoHeight = width / 1.4;

  return (
    <ScrollView
      ref={scrollView as any}
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
        if (isCloseToBottom(nativeEvent)) {
          getRows(false);
        }
      }}>
      <Image
        source={{uri: getImageUrl(promo?.images[0]?.url, ImageQuality.h900)}}
        style={{height: promoHeight}}>
        <LinearGradient
          colors={['#000000', '#00000000', '#000']}
          style={{flex: 1, justifyContent: 'space-between'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: top,
              marginHorizontal: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                setParams({});
              }}>
              <Image
                source={require('../../assets/logo.png')}
                style={{width: 100, height: 50}}
                placeholderStyle={{backgroundColor: 'transparent'}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setParams({type: 'm'});
              }}>
              <Text style={{fontSize: 14, fontWeight: params.type === 'm' ? 'bold' : 'normal'}}>
                {t('movies')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setParams({type: 's'});
              }}>
              <Text style={{fontSize: 14, fontWeight: params.type === 's' ? 'bold' : 'normal'}}>
                {t('series')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setParams({rated: 'G'});
              }}>
              <Text style={{fontSize: 14, fontWeight: params.rated === 'G' ? 'bold' : 'normal'}}>
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
          </View>
        </LinearGradient>
      </Image>
      <View style={{marginHorizontal: 50}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 20,
          }}>
          <Icon
            type="ionicon"
            name={promo?.inMyList ? 'checkmark' : 'add'}
            size={50}
            color={colors.blue}
            onPress={() => {
              addToList(token, promo, setPromo);
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
              onPress={() => {
                if (promo?.type === 'm') {
                  navigation.navigate('MoviePlayer', {title: promo});
                } else {
                  navigation.navigate('SeriesPlayer', {title: promo});
                }
              }}>
              <Icon type="ionicon" name="play" size={50} color={colors.white} style={{marginLeft: 5}} />
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
      {/* end of promo */}
      {/* stories */}
      {stories ? <StoryRow row={stories.results} /> : null}
      {/* continue watching */}
      {history && isPrivate ? <HistoryRow row={history} /> : null}
      {/* trending */}
      {trending && <TitleRow row={trending.results} name={t('trending')} />}
      {/* recently added */}
      {recentlyAdded && <TitleRow row={recentlyAdded.results} name={t('recentlyAdded')} />}
      {/* coming soon */}
      {comingSoon && <ComingSoonRow row={comingSoon.results} />}
      {picked && (
        <>
          <Text
            style={{fontSize: 17, fontWeight: 'bold', marginBottom: 10, marginTop: 5, marginHorizontal: 10}}>
            {t('pickedForYou')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Detail', picked);
            }}>
            <Image
              source={{uri: getImageUrl(picked.images[0]?.url, ImageQuality.h900)}}
              style={{height: promoHeight, width: '100%', marginBottom: 10}}>
              <LinearGradient
                style={{flex: 1, paddingVertical: 10, paddingHorizontal: 30}}
                colors={['#00000000', '#00000000', '#00000088']}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 'auto',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{flex: 1, fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>
                        {picked.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 14, marginRight: 20}}>
                          {picked.type === 's'
                            ? `${picked.seasons.length} ${t('seasons')}`
                            : `${Math.round((picked.runtime ?? 0) / 60)} min`}
                        </Text>

                        <View style={{flexDirection: 'row', marginRight: 20, alignItems: 'center'}}>
                          <Icon
                            type="ionicon"
                            size={14}
                            name="star"
                            color={colors.blue}
                            style={{marginRight: 5}}
                          />
                          <Text style={{fontSize: 14}}>{picked.rating}</Text>
                        </View>
                        <Text style={{fontSize: 14}}>{picked.released_at}</Text>
                      </View>

                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {isPrivate ? (
                          <TouchableOpacity
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: colors.red,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 999,
                              marginRight: 15,
                            }}
                            onPress={() => {
                              if (picked.type === 'm') {
                                navigation.navigate('MoviePlayer', {title: picked});
                              } else {
                                navigation.navigate('SeriesPlayer', {title: picked});
                              }
                            }}>
                            <Icon
                              type="ionicon"
                              name="play"
                              size={30}
                              color={colors.white}
                              style={{marginLeft: 5}}
                            />
                          </TouchableOpacity>
                        ) : null}
                        <Icon
                          type="ionicon"
                          name={picked.inMyList ? 'checkmark' : 'add'}
                          size={60}
                          color={colors.white}
                          onPress={() => {
                            addToList(token, picked, setPicked);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Image>
          </TouchableOpacity>
        </>
      )}
      {/* rows */}
      {rows && rows.results.map((row) => <TitleRow key={row.id} row={row.title_list} name={row.name} />)}
      <View style={{height: 35}} />
      {loading ? <ActivityIndicator style={{marginTop: -20}} color="white" size="small" /> : null}
    </ScrollView>
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
  const {base} = useUrl();

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
  }, [getHits, base]);

  return {history, getHits};
};

const usePromos = (params: Params) => {
  const [promo, setPromo] = useState<TitleDetail & {inMyList?: boolean}>();
  const [picked, setPicked] = useState<TitleDetail & {inMyList?: boolean}>();
  const [error, setError] = useState<Error | null>();
  const {base} = useUrl();

  const getPromoTitle = async (prms?: Params) => {
    try {
      const promos = await getPromos({...params, ...(prms ?? {}), limit: 2});
      setPromo(promos[0]);
      setPicked(promos[1]);
      setError(null);

      checkMyList(promos[0].id)
        .then(() => {
          setPromo({...promos[0], inMyList: true});
        })
        .catch(() => {});

      checkMyList(promos[1].id)
        .then(() => {
          setPicked({...promos[1], inMyList: true});
        })
        .catch(() => {});
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    getPromoTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, base]);

  return {promo, picked, setPromo, setPicked, error, getPromoTitle};
};

const useRows = (params: Params) => {
  const [rows, setRows] = useState<PaginatedResults<GenreRow[]>>();
  const [recentlyAdded, setRecentlyAdded] = useState<PaginatedResults<Title[]>>();
  const [trending, setTrending] = useState<PaginatedResults<Title[]>>();
  const [comingSoon, setComingSoon] = useState<PaginatedResults<Title[]>>();
  const [error, setError] = useState<Error | null>();
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<PaginatedResults<Story[]>>();
  const {base} = useUrl();

  const getRows = async (refresh = true, p?: Params) => {
    try {
      if (!refresh && rows) {
        if (loading) {
          return;
        }
        setLoading(true);
        const res = (await UrlBase.client.get(rows.next)) as PaginatedResults<GenreRow[]>;
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
      const newsStories = await getStories();
      setStories(newsStories);
      const coming = await getTitles({...newParams, is_coming_soon: 1});
      setComingSoon(coming);
      const data = await getGenreRows(newParams);
      setRows(data);
      setError(null);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, base]);

  return {rows, recentlyAdded, trending, comingSoon, stories, error, getRows, loading};
};
