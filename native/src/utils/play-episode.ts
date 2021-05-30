import {RemoteMediaClient} from 'react-native-google-cast';
import {getEpisode, getEpisodeURL, getHit, getMovieURL, getSeason} from '../api/title';
import {Episode} from '../core/interfaces/episode';
import {Title, TitleDetail} from '../core/interfaces/title';
import {swapEpisodeUrlId} from './common';

export const playEpisodeRemotely = async (ep: Episode, title: Title, client: RemoteMediaClient) => {
  let v = swapEpisodeUrlId(ep.videos[0]?.url.replace('{q}', '720').replace('{f}', 'mp4'));
  if (v) {
    const startIdx = v.indexOf('/s/');
    const endIdx = v.indexOf('/720');
    const info = v.substring(startIdx + 3, endIdx).split('/');
    if (info.length === 3) {
      try {
        const resp: {url: string}[] = (await getEpisodeURL(info[0], info[1], info[2])) as any;
        if (resp.length) {
          v = resp[0].url;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  client.loadMedia({
    autoplay: true,
    mediaInfo: {
      contentUrl: v,
      contentType: 'video/mp4',
      metadata: {
        images: ep.images,
        title: ep.name,
        subtitle: title?.plot ?? '',
        type: 'movie',
      },
    },
  });
};

export const playMovieRemotely = async (title: TitleDetail, client: RemoteMediaClient) => {
  let video = title.videos[0]?.url.replace('{q}', '720');
  const startIdx = video.indexOf('/m/');
  const endIdx = video.indexOf('/720');
  const videoId = video.substring(startIdx + 3, endIdx);
  const resp: {url: string}[] = (await getMovieURL(videoId)) as any;
  if (resp.length) {
    client.loadMedia({
      autoplay: true,
      mediaInfo: {
        contentUrl: resp[0].url,
        contentType: 'video/mp4',
        metadata: {
          images: title.images,
          title: title.name,
          subtitle: title.plot,
          type: 'movie',
        },
      },
    });
  }
};

export const playCurrentEpisodeRemotely = async (
  title: TitleDetail,
  client: RemoteMediaClient,
  token?: string | null,
) => {
  if (token) {
    try {
      const hit = await getHit(title.id);
      const e = await getEpisode(hit.episode!.id);
      e && (await playEpisodeRemotely(e, title, client));
    } catch (err) {
      if (title.seasons.length) {
        const s = await getSeason(title.seasons[0].id);
        const e = s.episodes[0];
        if (e) {
          await playEpisodeRemotely(e, title, client);
        }
      }
    }
  } else {
    if (title.seasons.length) {
      const s = await getSeason(title.seasons[0].id);
      const e = s.episodes[0];
      if (e) {
        await playEpisodeRemotely(e, title, client);
      }
    }
  }
};
