import React, {useEffect, useRef} from 'react';
import {OnProgressData} from 'react-native-video';
import {NativeModules, Platform, StyleSheet, View} from 'react-native';
import {TheoPlayer} from './TheoPlayer';
import {ScrollView} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import {colors} from '../constants/style';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import TheoEventEmitter from '../utils/theo-event-emitter';

const theoEventEmitter = new TheoEventEmitter();

export interface Sub {
  title: string;
  language: string;
  type: 'text/vtt';
  uri: string;
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
  const listeners = useRef<any>({});

  useEffect(() => {
    if (onProgress) {
      listeners.current.timeUpdateListener = theoEventEmitter.addListener('timeupdate', (e: any) => {
        if (!duration.current) {
          duration.current = NativeModules.THEOplayerViewManager.getDuration();
        }

        if (e.currentTime > duration.current! + 30 || e.currentTime < duration.current!) {
          onProgress({currentTime: e.currentTime, seekableDuration: duration.current!, playableDuration: 0});
          console.log('timeupdate:', e);
        }
      });
    }

    if (startTime) {
      listeners.current.loadedDataListener = theoEventEmitter.addListener('loadeddata', (e: any) => {
        NativeModules.THEOplayerViewManager.setCurrentTime(startTime);
        console.log('loadeddata:', e);
      });
    }

    const currentListeners = listeners.current;

    return () => {
      Object.keys(currentListeners).forEach((key) => {
        currentListeners[key].remove();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <BaseComponent style={styles.container}>
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

      <TheoPlayer
        style={playerStyle}
        source={{
          sources: [{src: video, type: video.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegurl'}],
          textTracks: subtitles?.map((s) => ({
            default: s.language === 'ar',
            kind: 'subtitles',
            label: s.title,
            src: s.uri,
            srclang: s.language,
          })),
        }}
        autoplay
      />
    </BaseComponent>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  player: {
    flex: 1,
  },
});
