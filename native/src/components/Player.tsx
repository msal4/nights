import React from 'react';
import VideoPlayer from 'react-native-video-controls';
import {useNavigation} from '@react-navigation/native';
import Video, {OnProgressData} from 'react-native-video';
import Orientation from 'react-native-orientation';
import fs from 'react-native-fs';
import {NativeModules, Platform, StatusBar} from 'react-native';
import axios from 'axios';
import LoadingIndicator from './LoadingIndicator';

export interface Sub {
  title: string;
  language: string;
  type: 'text/vtt';
  uri: string;
}

export type VideoRef = React.RefObject<{player: {ref: Video}}>;

export class Player extends React.Component<
  {
    navigation: ReturnType<typeof useNavigation>;
    video: string;
    subtitles?: Sub[];
    startTime?: number;
    videoRef?: VideoRef;
    title?: string;
    onProgress?: (data: OnProgressData) => void;
    load?: () => Promise<void>;
  },
  {subtitles: Sub[] | undefined; loading: boolean}
> {
  constructor(props: any) {
    super(props);

    this.state = {subtitles: undefined, loading: true};
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      NativeModules.ToggleImmersiveMode.immersiveModeOn();
    }
    Orientation.lockToLandscape();

    (async () => {
      if (!this.props.subtitles) {
        return;
      }
      const subs = [];
      for (const sub of this.props.subtitles) {
        if (sub.uri.startsWith('/')) {
          try {
            const exists = await fs.exists(sub.uri);
            exists && subs.push(sub);
          } catch {}
        } else {
          try {
            const res = await axios.head(sub.uri);
            console.log(res.status);
            if (res.status === 200) {
              subs.push(sub);
            }
          } catch {}
        }
      }
      this.setState({subtitles: subs});
    })().then(async () => {
      try {
        this.props.load && (await this.props.load());
      } catch {}
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      NativeModules.ToggleImmersiveMode.immersiveModeOff();
    }
    Orientation.lockToPortrait();
  }

  render() {
    const {video, title, videoRef, onProgress} = this.props;
    const {subtitles, loading} = this.state;

    if (loading) {
      return <LoadingIndicator />;
    }

    return (
      <>
        <StatusBar hidden />
        <VideoPlayer
          ref={videoRef}
          navigator={this.props.navigation}
          source={{uri: video}}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          title={title}
          selectedTextTrack={subtitles?.length ? {type: 'language', value: 'ar'} : undefined}
          textTracks={subtitles?.length ? subtitles : undefined}
          onLoad={async () => {}}
          onError={(err: any) => {
            console.log(err);
          }}
          onProgress={onProgress}
        />
      </>
    );
  }
}
