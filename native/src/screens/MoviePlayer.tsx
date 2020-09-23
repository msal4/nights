import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';

import {TitleDetail, Title} from '../core/interfaces/title';
import {getHit, hitTopic, getTitle} from '../api/title';
import {AuthContext} from '../context/auth-context';
import {Sub, Player, OnProgressData} from '../components/Player';

export interface PlayerParams {
  title: Title;
}

export class MoviePlayerScreen extends React.Component<
  {navigation: ReturnType<typeof useNavigation>; route: ReturnType<typeof useRoute>},
  {video: string | null; subtitles: Sub[] | undefined; title: TitleDetail | null; startTime?: number}
> {
  constructor(props: any) {
    super(props);
    this.lastHit = React.createRef();

    this.state = {
      title: null,
      video: null,
      subtitles: undefined,
      startTime: undefined,
    };
  }

  static contextType = AuthContext;

  context!: React.ContextType<typeof AuthContext>;

  lastHit: React.RefObject<number>;

  async componentDidMount() {
    const {title: simpleTitle} = this.props.route.params as PlayerParams;
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
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({video, subtitles});
    await this.continueWatching(title.id);
  }

  async continueWatching(id: number) {
    try {
      const hit = await getHit(id);
      this.setState({startTime: hit.playback_position ?? 0});
      // this.videoRef.current?.player.ref.seek(hit.playback_position);
    } catch (err) {
      console.log(err);
      this.setState({startTime: 0});
    }
  }

  render() {
    const {video, subtitles, startTime} = this.state;
    const {title} = this.props.route.params as PlayerParams;
    const {token} = this.context;

    return video && startTime !== undefined ? (
      <Player
        video={video}
        subtitles={subtitles}
        title={title.name}
        load={async () => {}}
        startTime={startTime}
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
                    runtime: data.runtime,
                  }).catch((e) => {
                    console.log(e);
                  });
                }
              }
            : undefined
        }
      />
    ) : null;
  }
}
