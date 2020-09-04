import React from 'react';
import VideoPlayer from 'react-native-video-controls';
import {useRoute, useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';

import {TitleDetail} from '../core/interfaces/title';
import {getHit, hitTopic} from '../api/title';
import {AuthContext} from '../context/auth-context';

export interface PlayerParams {
  title: TitleDetail;
}

interface Sub {
  title: string;
  language: string;
  type: 'text/vtt';
  uri: string;
}

export class PlayerScreen extends React.Component<
  {navigation: ReturnType<typeof useNavigation>; route: ReturnType<typeof useRoute>},
  {video: string | null; subtitles: Sub[] | null; title: TitleDetail | null; tempSubs: Sub[] | null}
> {
  constructor(props: any) {
    super(props);
    this.videoRef = React.createRef();
    this.lastHit = React.createRef();

    this.state = {
      title: null,
      video: null,
      subtitles: null,
      tempSubs: null,
    };
  }

  static contextType = AuthContext;

  context!: React.ContextType<typeof AuthContext>;

  videoRef: React.RefObject<{player: {ref: Video}}>;
  lastHit: React.RefObject<number>;

  componentDidMount() {
    const {title} = this.props.route.params as PlayerParams;
    const {token} = this.context;

    if (!title) {
      return;
    }

    const video = title.videos[0]?.url.replace('{q}', '720');
    const subtitles = title.subtitles.map(
      (sub) =>
        ({
          title: sub.language ?? 'ar',
          type: 'text/vtt',
          language: sub.language ?? 'ar',
          uri: sub.url.replace('{f}', 'vtt'),
        } as Sub),
    );

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({video, tempSubs: subtitles});

    if (token) {
      this.continueWatching(title.id);
    }
  }

  async continueWatching(id: number) {
    try {
      const hit = await getHit(id);
      this.videoRef.current?.player.ref.seek(hit.playback_position);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {video, subtitles, tempSubs} = this.state;
    const {title} = this.props.route.params as PlayerParams;
    const {token} = this.context;

    return video ? (
      <>
        {/* {loading ? <LoadingIndicator /> : null} */}
        <VideoPlayer
          ref={this.videoRef}
          navigator={this.props.navigation}
          source={{uri: video}}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          selectedTextTrack={subtitles?.length ? {type: 'language', value: 'ar'} : undefined}
          textTracks={subtitles?.length ? subtitles : undefined}
          onLoad={() => {
            this.setState({subtitles: tempSubs});
          }}
          onProgress={
            token
              ? (data: any) => {
                  const last = this.lastHit.current ?? 0;
                  if (data.currentTime > last + 30 || data.currentTime < last) {
                    console.log('progress');
                    console.log(data);
                    (this.lastHit as any).current = data.currentTime;
                    hitTopic(title.id, {
                      playback_position: data.currentTime,
                      runtime: data.seekableDuration,
                    });
                  }
                }
              : null
          }
          // controls
          // muted
        />
      </>
    ) : null;
  }
}
