import React, {useEffect} from 'react';
import {OnProgressData} from 'react-native-video';
import {Dimensions, NativeModules, Platform, StyleSheet, View} from 'react-native';
import {TheoPlayer} from './TheoPlayer';
import {ScrollView} from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation';
import {Icon} from 'react-native-elements';
import {colors} from '../constants/style';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

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

export const Player: React.FC<PlayerProps> = ({video, subtitles}) => {
  const playerStyle: any = {...styles.player};
  const navigation = useNavigation();

  useEffect(() => {
    // Orientation.lockToLandscape();
    return () => {
      NativeModules.THEOplayerViewManager?.destroy();
      // Orientation.lockToPortrait();
      // NativeModules.ToggleImmersiveMode.immersiveModeOff();
    };
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
  console.log(
    subtitles?.map((s) => ({
      default: s.language === 'ar',
      kind: 'subtitles',
      label: s.title,
      src: s.uri,
      srclang: s.language,
    })),
  );

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
    // aspectRatio: 1.7,
    flex: 1,
  },
});
