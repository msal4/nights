import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, NativeModules, Platform, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {colors} from '../constants/style';
import {TheoPlayer} from './TheoPlayer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TitleDetail} from '../core/interfaces/title';
import {EpisodesScreen} from '../screens/Episodes';
import {InfoScreen} from '../screens/Info';
import {useLanguage} from '../utils/lang';
import Video from 'react-native-video';

export interface Sub {
  title: string;
  language: string;
  type: 'text/vtt';
  uri: string;
}

export interface OnProgressData {
  currentTime: number;
  runtime: number;
}

interface PlayerProps {
  video: string;
  subtitles?: Sub[];
  startTime?: number;
  title?: string;
  titleDetail?: TitleDetail;
  onProgress?: (data: OnProgressData) => void;
  load?: () => Promise<void>;
}

const Tab = createMaterialTopTabNavigator();

export const Player: React.FC<PlayerProps> = ({video, subtitles, startTime, onProgress, titleDetail}) => {
  // const navigation = useNavigation();
  const duration = useRef<number>();
  const {t} = useLanguage();
  const player = useRef<Video>();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!video) {
    return null;
  }

  const playerStyle: any = {...styles.player};

  if (Platform.OS === 'android') {
    let width = Math.floor(Dimensions.get('window').width);
    let height = Math.floor(Dimensions.get('window').height);

    if (isFullscreen) {
      playerStyle.width = Math.min(width, height) + 1;
    } else {
      playerStyle.width = Math.min(width, height);
    }
  }

  return (
    <ScrollView style={{flex: 1}}>
      {/* {Platform.OS === 'android' ? ( */}
      <TheoPlayer
        style={playerStyle}
        source={{
          sources: [{src: video, type: video.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegurl'}],
          textTracks: subtitles?.map((s) => ({
            default: s.language === 'ar',
            kind: 'subtitles',
            label: s.title === 'ar' ? 'Arabic' : s.title === 'en' ? 'English' : s.title,
            src: s.uri,
            srclang: s.language,
          })),
        }}
        onLoadedData={() => {
          startTime && NativeModules.THEOplayerViewManager.setCurrentTime(startTime);
        }}
        onTimeUpdate={
          onProgress &&
          (async ({nativeEvent}: any) => {
            const {currentTime} = nativeEvent;

            if (!duration.current) {
              duration.current = await NativeModules.THEOplayerViewManager.getDuration();
            }

            onProgress({currentTime, runtime: duration.current!});
          })
        }
        onPresentationModeChange={() => {
          // const {width, height} = Dimensions.get('window');
          setIsFullscreen(!isFullscreen);
        }}
        autoplay
      />
      {/* ) : (
        <Video
          ref={player as any}
          controls
          style={styles.player}
          source={{uri: video}}
          textTracks={subtitles}
          selectedTextTrack={{type: 'language', value: 'ar'}}
          onLoad={() => {
            player.current?.seek(startTime ?? 0);
          }}
          onProgress={
            onProgress &&
            (({currentTime, seekableDuration}) => {
              onProgress({currentTime, runtime: seekableDuration});
            })
          }
        />
      )} */}
      {titleDetail && (
        <Tab.Navigator
          tabBarOptions={{
            labelStyle: {color: colors.white},
            style: {backgroundColor: colors.black},
          }}>
          {titleDetail.type === 's' ? (
            <Tab.Screen
              name="Episodes"
              initialParams={{title: titleDetail, screenName: 'Player'}}
              component={EpisodesScreen}
              options={{title: t('episodes')}}
            />
          ) : null}
          <Tab.Screen
            name="Info"
            initialParams={{title: titleDetail}}
            component={InfoScreen}
            options={{title: t('info')}}
          />
        </Tab.Navigator>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  player: {
    width: '100%',
    aspectRatio: 1.7,
  },
});
