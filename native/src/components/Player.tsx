import React, {useRef} from 'react';
import {NativeModules, Platform, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {colors} from '../constants/style';
import {TheoPlayer} from './TheoPlayer';

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
  onProgress?: (data: OnProgressData) => void;
  load?: () => Promise<void>;
}

export const Player: React.FC<PlayerProps> = ({video, subtitles, startTime, onProgress}) => {
  const playerStyle: any = {...styles.player};
  const navigation = useNavigation();
  const duration = useRef<number>();

  let BaseComponent: any = View;

  if (Platform.OS === 'android') {
    playerStyle.width = '100%';
    playerStyle.height = '100%';
  } else {
    BaseComponent = ScrollView;
  }

  if (!video) {
    return null;
  }

  return (
    <BaseComponent style={{flex: 1}}>
      {Platform.OS === 'android' ? (
        <SafeAreaView edges={['top']} style={{alignItems: 'flex-start', paddingTop: 20, paddingLeft: 10}}>
          <Icon
            type="ionicon"
            size={50}
            color={colors.white}
            name="chevron-back-sharp"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </SafeAreaView>
      ) : null}

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
        autoplay
      />
    </BaseComponent>
  );
};

const styles = StyleSheet.create({
  player: {
    aspectRatio: 1.7,
  },
});
