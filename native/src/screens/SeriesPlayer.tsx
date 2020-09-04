import React from 'react';
import VideoPlayer from 'react-native-video-controls';
import {useRoute, useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import {InteractionManager} from 'react-native';

import {TitleDetail} from '../core/interfaces/title';
import {Episode} from '../core/interfaces/episode';
import {Season} from '../core/interfaces/season';
import {Channel} from '../core/interfaces/channel';
import {getHit} from '../api/title';
import {AuthContext} from '../context/auth-context';

export interface PlayerParams {
  title?: TitleDetail;
  season?: Season;
  episode?: Episode;
  channel?: Channel;
}

interface Sub {
  title: string;
  language: string;
  type: 'text/vtt';
  uri: string;
}

export class PlayerScreen extends React.Component<
  {navigation: ReturnType<typeof useNavigation>; route: ReturnType<typeof useRoute>},
  {video: string | null; subtitles: Sub[] | null; title: TitleDetail | null}
> {
  constructor(props: any) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      title: null,
      video: null,
      subtitles: null,
    };
  }

  static contextType = AuthContext;

  context!: React.ContextType<typeof AuthContext>;

  videoRef: React.RefObject<Video>;

  componentDidMount() {
    const {route} = this.props;
    const {title} = route.params as PlayerParams;
    const {token} = this.context;

    console.log(title);

    if (!title) {
      return;
    }

    InteractionManager.runAfterInteractions(async () => {
      const video = title.videos[0].url;
      const subtitles = title.subtitles.map(
        (sub) =>
          ({
            title: sub.language ?? 'ar',
            type: 'text/vtt',
            language: sub.language ?? 'ar',
            uri: sub.url.replace('{f}', 'vtt'),
          } as Sub),
      );
      console.log(subtitles);
      this.setState({video, subtitles});

      if (token) {
        try {
          const hit = await getHit(title.id);
          if (hit) {
            this.videoRef.current?.seek(hit.playback_position);
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  render() {
    const {video, subtitles} = this.state;
    console.log(subtitles);
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
          // onLoad={() => {
          //   setLoading(false);
          // }}
          // controls
          // muted
        />
      </>
    ) : null;
  }
}
