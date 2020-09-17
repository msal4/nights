import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import Video, {OnProgressData} from 'react-native-video';

import {Title} from '../core/interfaces/title';
import {getHit, hitTopic, getSeason, getEpisode, getTitle} from '../api/title';
import {AuthContext} from '../context/auth-context';
import {Sub, Player} from '../components/Player';
import {Season} from '../core/interfaces/season';
import {Episode} from '../core/interfaces/episode';
import {swapEpisodeUrlId} from '../utils/common';

export interface SeriesPlayerParams {
  title: Title;
  season?: Season;
  episode?: Episode;
}

export class SeriesPlayerScreen extends React.Component<
  {navigation: ReturnType<typeof useNavigation>; route: ReturnType<typeof useRoute>},
  {
    video: string | null;
    subtitles: Sub[] | undefined;
    season?: Season;
    episode?: Episode;
    seasonId?: number;
  }
> {
  constructor(props: any) {
    super(props);
    this.videoRef = React.createRef();
    this.lastHit = React.createRef();

    this.state = {
      video: null,
      subtitles: undefined,
    };
  }

  static contextType = AuthContext;

  context!: React.ContextType<typeof AuthContext>;
  videoRef: React.RefObject<{player: {ref: Video}}>;
  lastHit: React.RefObject<number>;

  componentDidMount() {
    this.loadEpisode();
  }

  async loadEpisode() {
    const {title: simpleTitle, season, episode} = this.props.route.params as SeriesPlayerParams;
    const {token} = this.context;

    const title = await getTitle(simpleTitle.id);

    if (!season || !episode) {
      if (token) {
        try {
          const hit = await getHit(title.id);
          const e = await getEpisode(hit.episode!.id);
          this.setState({seasonId: hit.season!, episode: e});
          hit.episode && (await this.playEpisode(e));
        } catch (err) {
          if (title.seasons.length) {
            const s = await getSeason(title.seasons[0].id);
            const e = s.episodes[0];
            if (e) {
              this.setState({season: s, episode: e});
              this.playEpisode(e);
            }
          }
        }
      } else {
        if (title.seasons.length) {
          const s = await getSeason(title.seasons[0].id);
          const e = s.episodes[0];
          if (e) {
            this.setState({season: s, episode: e});
            this.playEpisode(e);
          }
        }
      }
    } else {
      this.setState({season, episode});
      this.playEpisode(episode);
    }
  }

  async playEpisode(episode: Episode) {
    const video = episode.videos[0]?.url.replace('{q}', '720').replace('{f}', 'mp4');
    const subtitles = episode.subtitles.map(
      (sub) =>
        ({
          title: sub.language ?? 'ar',
          type: 'text/vtt',
          language: sub.language ?? 'ar',
          uri: swapEpisodeUrlId(sub.url)?.replace('{f}', 'vtt'),
        } as Sub),
    );

    this.setState({video, subtitles});
  }

  async continueWatching(episode: Episode) {
    console.log(episode);
    try {
      this.videoRef.current?.player.ref.seek(episode.hits[0]?.playback_position ?? 0);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {video, subtitles, seasonId, season, episode} = this.state;
    const {title} = this.props.route.params as SeriesPlayerParams;
    const {token} = this.context;

    return video ? (
      <Player
        videoRef={this.videoRef}
        navigation={this.props.navigation}
        video={video}
        subtitles={subtitles}
        title={episode?.name}
        load={async () => {
          if (token) {
            await this.continueWatching(episode!);
          }
        }}
        onProgress={
          token
            ? (data: OnProgressData) => {
                const last = this.lastHit.current ?? 0;
                if (data.currentTime > last + 30 || data.currentTime < last) {
                  (this.lastHit as any).current = data.currentTime;
                  const hitData = {
                    playback_position: data.currentTime,
                    runtime: data.seekableDuration,
                    season: season?.id || seasonId,
                    episode: episode?.id,
                  };
                  console.log(hitData);
                  hitTopic(title.id, hitData);
                }
              }
            : undefined
        }
      />
    ) : null;
  }
}
