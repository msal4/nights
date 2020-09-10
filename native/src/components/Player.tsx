import React from 'react';
import VideoPlayer from 'react-native-video-controls';
import {useNavigation} from '@react-navigation/native';
import Video, {OnProgressData} from 'react-native-video';
import Orientation from 'react-native-orientation';
import fs from 'react-native-fs';
import {NativeModules, StatusBar} from 'react-native';
import axios from 'axios';

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
  },
  {subtitles: Sub[] | undefined; loading: boolean}
> {
  constructor(props: any) {
    super(props);

    this.state = {subtitles: undefined, loading: true};
  }

  componentDidMount() {
    NativeModules.ToggleImmersiveMode.immersiveModeOn();
    Orientation.lockToLandscape();
  }

  componentWillUnmount() {
    NativeModules.ToggleImmersiveMode.immersiveModeOff();
    Orientation.lockToPortrait();
  }

  render() {
    const {video, title, videoRef, onProgress} = this.props;
    const {subtitles} = this.state;
    console.log('subtitles:', subtitles);

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
          onLoad={async () => {
            if (!this.props.subtitles) {
              return;
            }
            const subs = [];
            for (const sub of this.props.subtitles) {
              if (sub.uri.startsWith('/')) {
                const exists = await fs.exists(sub.uri);
                exists && subs.push(sub);
              } else {
                try {
                  const res = await axios.head(sub.uri);
                  if (res.status === 200) {
                    subs.push(sub);
                  }
                } catch {}
              }
            }
            this.setState({subtitles: subs, loading: false});
          }}
          onError={(err) => {
            console.log(err);
          }}
          onProgress={onProgress}
        />
      </>
    );
  }
}
