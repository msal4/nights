import React from 'react';
import VideoPlayer from 'react-native-video-controls';
import {useNavigation} from '@react-navigation/native';
import Video, {OnProgressData} from 'react-native-video';
import Orientation from 'react-native-orientation-locker';

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
  {subtitles: Sub[] | undefined}
> {
  constructor(props: any) {
    super(props);

    this.state = {subtitles: undefined};
  }

  componentDidMount() {
    Orientation.lockToLandscape();
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
  }

  render() {
    const {video, title, subtitles, videoRef, onProgress} = this.props;

    return (
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
        onLoad={() => {
          this.setState({subtitles});
        }}
        onProgress={onProgress}
      />
    );
  }
}
