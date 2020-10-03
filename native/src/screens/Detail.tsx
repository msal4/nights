import React, {useState, useCallback, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useRoute, useNavigation} from '@react-navigation/native';
import {View, ScrollView, TouchableOpacity, RefreshControl, Linking} from 'react-native';
import {Image, Icon, Text, Button} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import Menu from 'react-native-material-menu';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {getImageUrl, joinTopics} from '../utils/common';
import {ImageQuality, TitleDetail} from '../core/interfaces/title';
import {getTitle, checkMyList, removeFromMyList, addToMyList} from '../api/title';
import {colors} from '../constants/style';
import {TrailerScreen} from './Trailer';
import {InfoScreen} from './Info';
import {EpisodesScreen} from './Episodes';
import {useLanguage} from '../utils/lang';
import {Downloader, DownloadTask, DownloadStatus} from '../core/Downloader';
import {useAuth} from '../context/auth-context';
import {useUrl} from '../context/url-context';

const Tab = createMaterialTopTabNavigator();

export const DetailScreen: React.FC = () => {
  const {params}: any = useRoute();
  const menuRef = useRef<Menu>();
  const navigation = useNavigation();
  const {title, inMyList, setInMyList, setTask, task, reload} = useTitle(params.id);
  const {token} = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const {isPrivate} = useUrl();
  const circularProgress = useRef<AnimatedCircularProgress>();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    const listener = () => {
      setTask(Downloader.task(params.id));
    };

    const unsubscribe = navigation.addListener('focus', () => {
      reload();
    });

    Downloader.onChange(listener);

    return () => {
      Downloader.removeOnChangeListener(listener);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (task) {
      circularProgress.current?.animate(task.progress, 500);
    }
  }, [task]);

  const {t} = useLanguage();

  if (title && title.genres.length > 3) {
    title.genres.length = 3;
  }

  const image = getImageUrl(title?.images[0].url, ImageQuality.h900);
  // const poster = getImageUrl(title?.images[0].url);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            titleColor={colors.white}
            title={t('refreshing')}
            tintColor={colors.white}
          />
        }>
        <Image source={{uri: image}} style={{height: 300}}>
          <LinearGradient colors={['#00000088', '#00000000', '#000']} style={{height: '100%'}}>
            <SafeAreaView
              edges={['top']}
              style={{flex: 1, justifyContent: 'space-between', marginHorizontal: 20}}>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Icon
                  type="ionicon"
                  size={50}
                  color={colors.white}
                  name="chevron-back-sharp"
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {title?.imdb ? (
                    <TouchableOpacity
                      style={{marginRight: 30}}
                      onPress={() => {
                        Linking.openURL(`https://imdb.com/title/${title.imdb}`);
                      }}>
                      <Image
                        source={require('../../assets/imdb.png')}
                        resizeMode="contain"
                        placeholderStyle={{backgroundColor: 'transparent'}}
                        style={{width: 60, height: 50}}
                      />
                    </TouchableOpacity>
                  ) : null}

                  <Icon
                    type="ionicon"
                    size={50}
                    color={colors.white}
                    name={inMyList ? 'checkmark' : 'add'}
                    onPress={async () => {
                      if (!title) {
                        return;
                      }
                      if (!token) {
                        navigation.navigate('More', {screen: 'Login', initial: false});
                      }

                      if (inMyList) {
                        try {
                          await removeFromMyList(title.id);
                          setInMyList(false);
                        } catch {}
                      } else {
                        try {
                          await addToMyList(title.id);
                          setInMyList(true);
                        } catch {}
                      }
                    }}
                  />
                </View>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {/* {isPrivate ? (
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
                      if (!title) {
                        return;
                      }

                      if (title.type === 'm') {
                        navigation.navigate('MoviePlayer', {title});
                      } else {
                        navigation.navigate('SeriesPlayer', {title});
                      }
                    }}>
                    <Icon type="ionicon" name="play" size={50} color={colors.white} />
                  </TouchableOpacity>
                ) : null} */}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 10}}>{title?.name}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <View style={{flexDirection: 'row', marginRight: 10, alignItems: 'center'}}>
                      <Icon
                        type="ionicon"
                        size={14}
                        name="star"
                        color={colors.blue}
                        style={{marginRight: 5}}
                      />
                      <Text style={{fontWeight: 'bold', fontSize: 14}}>{title?.rating}</Text>
                    </View>
                    <Text style={{fontWeight: 'bold', fontSize: 14, marginRight: 10}}>
                      {title?.type === 'm'
                        ? Math.round((title?.runtime ?? 0) / 60) + ' min'
                        : (title?.seasons.length ?? '') + ' ' + t('seasons')}
                    </Text>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>{title?.released_at}</Text>
                  </View>
                  <Text style={{marginBottom: 10, color: colors.lightGray}}>{joinTopics(title?.genres)}</Text>
                  <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
                    <Text style={{color: colors.lightGray, marginRight: 10}}>{title?.rated}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon
                        type="ionicon"
                        size={18}
                        name="eye"
                        color={colors.blue}
                        style={{marginRight: 5}}
                      />
                      <Text style={{color: colors.lightGray}}>{((title?.views ?? 1) + 1) * 93}</Text>
                    </View>
                  </View>
                </View>
                {isPrivate && title?.type === 'm' ? (
                  <>
                    {task &&
                      Downloader.renderMenu(
                        menuRef,
                        task,
                        task.status === DownloadStatus.DOWNLOADING ? (
                          <TouchableOpacity
                            onPress={() => {
                              menuRef.current?.show();
                            }}>
                            <AnimatedCircularProgress
                              ref={circularProgress as any}
                              size={35}
                              fill={0}
                              width={6}
                              rotation={1}
                              tintColor={colors.blue}
                              backgroundColor={colors.gray}
                            />
                          </TouchableOpacity>
                        ) : task.status === DownloadStatus.DONE ? (
                          <Icon
                            type="ionicon"
                            name="ellipsis-vertical-sharp"
                            size={35}
                            color={colors.blue}
                            onPress={() => menuRef.current?.show()}
                          />
                        ) : (
                          <Icon
                            type="ionicon"
                            name="refresh"
                            size={35}
                            color={colors.red}
                            onPress={() => menuRef.current?.show()}
                          />
                        ),
                        t,
                        navigation,
                      )}
                    {!task && (
                      <Icon
                        type="ionicon"
                        name={'download-outline'}
                        color={colors.blue}
                        size={40}
                        // style={{flex: 0.5}}
                        onPress={async () => {
                          // const status = Downloader.checkStatus(title.id);

                          // if (status === 'DOESNOTEXIST' || status === 'ERROR') {
                          console.log('downloading...');
                          Downloader.download({
                            id: title.id,
                            name: title.name,
                            image: image!,
                            title: title.id,
                            video: title.videos[0]?.url.replace('{f}', 'mp4'),
                            subtitles: title.subtitles.map((s) => ({
                              url: s.url.replace('{f}', 'vtt'),
                              lang: s.language ?? 'ar',
                            })),
                            type: 'm',
                          });
                          // } else {
                          //   console.log('not downloading...');
                          // }
                        }}
                      />
                    )}
                  </>
                ) : null}
              </View>
            </SafeAreaView>
          </LinearGradient>
        </Image>
        {isPrivate ? (
          <Button
            style={{margin: 10, borderRadius: 100, overflow: 'hidden'}}
            onPress={async () => {
              if (!title) {
                return;
              }

              if (title.type === 'm') {
                navigation.navigate('MoviePlayer', {title});
              } else {
                navigation.navigate('SeriesPlayer', {title});
              }
            }}
            title="Play"
            icon={{type: 'ionicon', name: 'play', color: 'white'}}
          />
        ) : null}
        {title && (
          <Tab.Navigator
            tabBarOptions={{
              labelStyle: {color: colors.white},
              style: {backgroundColor: colors.black},
            }}>
            {title?.type === 's' ? (
              <Tab.Screen
                name="Episodes"
                initialParams={{title}}
                component={EpisodesScreen}
                options={{title: t('episodes')}}
              />
            ) : null}
            {title?.trailers.length ? (
              <Tab.Screen
                name="Trailer"
                initialParams={{title}}
                component={TrailerScreen}
                options={{title: t('trailer')}}
              />
            ) : null}
            <Tab.Screen
              name="Info"
              initialParams={{title}}
              component={InfoScreen}
              options={{title: t('info')}}
            />
          </Tab.Navigator>
        )}
      </ScrollView>
    </>
  );
};

const useTitle = (id: number | string) => {
  const [title, setTitle] = useState<TitleDetail | null>();
  const [error, setError] = useState<Error | null>();
  const [inMyList, setInMyList] = useState(false);
  const [task, setTask] = useState<DownloadTask>();

  const getInfo = useCallback(async () => {
    try {
      const data = await getTitle(id);
      setTitle(data);
      const t = Downloader.task(Number(id));
      console.log(t?.status);
      setTask(t);
      await checkMyList(data.id);
      setInMyList(true);
      setError(null);
    } catch (err) {
      setInMyList(false);
      setError(err);
    }
  }, [id]);

  useEffect(() => {
    setTitle(null);
    getInfo();
  }, [getInfo]);

  return {
    title,
    error,
    reload: getInfo,
    inMyList,
    setInMyList,
    task,
    setTask,
  };
};
