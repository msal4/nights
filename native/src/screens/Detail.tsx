import React, {useState, useCallback, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useRoute, useNavigation} from '@react-navigation/native';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {Image, Icon, Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import Menu from 'react-native-material-menu';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {CastButton} from 'react-native-google-cast';

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
import {SeriesPlayerParams} from './SeriesPlayer';

const Tab = createMaterialTopTabNavigator();

export const DetailScreen: React.FC = () => {
  const {params}: any = useRoute();
  const menuRef = useRef<Menu>();
  const navigation = useNavigation();
  const {title, inMyList, setInMyList, setTask, task} = useTitle(params.id);
  const {token} = useAuth();

  useEffect(() => {
    const listener = () => {
      setTask(Downloader.task(params.id));
    };

    Downloader.onChange(listener);

    return () => {
      Downloader.removeOnChangeListener(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const {t} = useLanguage();

  if (title && title.genres.length > 3) {
    title.genres.length = 3;
  }

  const image = getImageUrl(title?.images[0].url, ImageQuality.h900);

  return (
    <>
      <ScrollView>
        <Image source={{uri: image}} style={{height: 400}}>
          <LinearGradient colors={['#00000088', '#00000000', '#000']} style={{height: '100%'}}>
            <SafeAreaView
              edges={['top']}
              style={{flex: 1, justifyContent: 'space-between', marginHorizontal: 20}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Icon
                  type="ionicon"
                  size={50}
                  color={colors.white}
                  name="chevron-back-sharp"
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                {/* <CastButton style={{width: 25, height: 25}} /> */}
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
                      navigation.navigate('Login');
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
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
                    if (title?.type === 'm') {
                      navigation.navigate('MoviePlayer', {title});
                    } else {
                      navigation.navigate('SeriesPlayer', {title} as SeriesPlayerParams);
                    }
                  }}>
                  <Icon type="ionicon" name="play" size={50} color={colors.white} />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View>
                  <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 10}}>{title?.name}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <View style={{flexDirection: 'row', marginRight: 10, alignItems: 'center'}}>
                      <Icon
                        type="ionicon"
                        size={18}
                        name="star"
                        color={colors.blue}
                        style={{marginRight: 5}}
                      />
                      <Text style={{fontWeight: 'bold', fontSize: 18}}>{title?.rating}</Text>
                    </View>
                    <Text style={{fontWeight: 'bold', fontSize: 18, marginRight: 10}}>
                      {title?.type === 'm'
                        ? Math.round((title?.runtime ?? 0) / 60) + ' min'
                        : (title?.seasons.length ?? '') + ' ' + t('seasons')}
                    </Text>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>{title?.released_at}</Text>
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
                {title?.type === 'm' ? (
                  <>
                    {task &&
                      Downloader.renderMenu(
                        menuRef,
                        task,
                        <Icon
                          onPress={() => {
                            menuRef.current?.show();
                          }}
                          type="ionicon"
                          name="ellipsis-vertical-sharp"
                          color={task.status === DownloadStatus.ERROR ? colors.red : colors.blue}
                        />,
                        t,
                        navigation,
                      )}
                    {!task && (
                      <Icon
                        type="ionicon"
                        name={'download-outline'}
                        color={colors.blue}
                        size={40}
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
      setTitle(null);
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
    getInfo();
  }, [getInfo]);

  return {title, error, getTitle: getInfo, inMyList, setInMyList, task, setTask};
};
