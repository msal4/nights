import {PaginatedResults} from '../core/interfaces/paginated-results';
import {Story, StoryDetail} from '../core/interfaces/story';
import UrlBase from '../utils/url-base';

export const getStories = (): Promise<PaginatedResults<Story[]>> => {
  return UrlBase.client.get('/news_stories/');
};

export const getStory = (id: number): Promise<StoryDetail> => {
  return UrlBase.client.get(`/news_stories/${id}/`);
};

export const createComment = (topic: number, body: string): Promise<any> => {
  return UrlBase.client.post(`/comments/`, {topic, body});
};

export const addLike = (topic: number): Promise<any> => {
  return UrlBase.client.post('/likes/', {topic});
};

export const removeLike = (topic: number): Promise<any> => {
  return UrlBase.client.delete(`/likes/${topic}/`);
};

export const getLike = (topic: number): Promise<any> => {
  return UrlBase.client.get(`/likes/${topic}/`);
};
