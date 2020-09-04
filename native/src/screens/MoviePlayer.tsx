import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import Video, {OnProgressData} from 'react-native-video';

import {TitleDetail, Title} from '../core/interfaces/title';
import {getHit, hitTopic, getTitle} from '../api/title';
import {AuthContext} from '../context/auth-context';
import {Sub, Player} from '../components/Player';
import {InteractionManager} from 'react-native';

export interface PlayerParams {
  title: Title;
}

export class MoviePlayerScreen extends React.Component<
  {navigation: ReturnType<typeof useNavigation>; route: ReturnType<typeof useRoute>},
  {video: string | null; subtitles: Sub[] | undefined; title: TitleDetail | null}
> {
  constructor(props: any) {
    super(props);
    this.videoRef = React.createRef();
    this.lastHit = React.createRef();

    this.state = {
      title: null,
      video: null,
      subtitles: undefined,
    };
  }

  static contextType = AuthContext;

  context!: React.ContextType<typeof AuthContext>;

  videoRef: React.RefObject<{player: {ref: Video}}>;
  lastHit: React.RefObject<number>;

  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      const {title: simpleTitle} = this.props.route.params as PlayerParams;
      const {token} = this.context;

      const title = await getTitle(simpleTitle.id);

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

      this.setState({video, subtitles});

      if (token) {
        this.continueWatching(title.id);
      }
    });
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
    const {video, subtitles} = this.state;
    const {title} = this.props.route.params as PlayerParams;
    const {token} = this.context;

    return video ? (
      <>
        {/* {loading ? <LoadingIndicator /> : null} */}
        <Player
          videoRef={this.videoRef}
          navigation={this.props.navigation}
          video={video}
          subtitles={subtitles}
          title={title.name}
          onProgress={
            token
              ? (data: OnProgressData) => {
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
              : undefined
          }
        />
      </>
    ) : null;
  }
}
