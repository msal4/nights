import UrlBase from '../utils/url-base';
import {PaginatedResults} from '../core/interfaces/paginated-results';
import {TitleDetail, Title} from '../core/interfaces/title';
import {Season} from '../core/interfaces/season';
import {Episode} from '../core/interfaces/episode';
import {ViewHitData} from '../core/interfaces/topic';
import {ViewHit} from '../core/interfaces/view-hit';
import {sortTopics} from '../utils/common';
import {contentURL} from '../constants/const';

export const getTitles = (params: {} = {}): Promise<PaginatedResults<Title[]>> => {
  return UrlBase.client.get('/titles/', {params});
};

export const getTitle = async (id: number | string): Promise<TitleDetail> => {
  const title: TitleDetail = await UrlBase.client.get(`/titles/${id}/`);
  title.type === 's' && (title.seasons = sortTopics(title.seasons));
  return title;
};

export const getSeason = async (id: number | string): Promise<Season> => {
  const season: Season = await UrlBase.client.get(`/seasons/${id}/`);
  season.episodes = sortTopics(season.episodes) as Episode[];
  return season;
};

export const getEpisode = (id: number | string): Promise<Episode> => UrlBase.client.get(`/episodes/${id}/`);

export const getHistory = (): Promise<PaginatedResults<ViewHit[]>> => UrlBase.client.get('/history/');

export const getHit = (id: string | number): Promise<ViewHit> => UrlBase.client.get(`/history/${id}/`);

export const removeHit = (id: string | number): Promise<ViewHit> =>
  UrlBase.client.delete(`/remove_hit/${id}/`);

export const hitTopic = (topicId: number | string, data: ViewHitData) =>
  UrlBase.client.put(`/history/${topicId}/`, data);

export const getMyList = (): Promise<PaginatedResults<Title[]>> => UrlBase.client.get('/my_list/');

export const checkMyList = (id: string | number) => UrlBase.client.get(`/my_list/${id}/`);

export const addToMyList = (id: string | number): Promise<{detail: string}> =>
  UrlBase.client.post('/my_list/', {id});

export const removeFromMyList = (id: string | number) => UrlBase.client.delete(`/my_list/${id}/`);

export const getMovieURL = (id: string) => UrlBase.client.get(`${contentURL}/vid.php?type=m&id=${id}`);

export const getEpisodeURL = (id: string, season: string, episode: string) =>
  UrlBase.client.get(`${contentURL}/vid.php?type=s&id=${id}&season=${season}&episode=${episode}`);
