import {PaginatedResults} from '../core/interfaces/paginated-results';
import {Story, StoryDetail} from '../core/interfaces/story';
import UrlBase from '../utils/url-base';
const {client} = UrlBase;

export const getStories = (): Promise<PaginatedResults<Story[]>> => {
  return client.get('/news_stories/');
};

export const getStory = (id: number): Promise<StoryDetail> => {
  return client.get(`/news_stories/${id}/`);
};

export const createComment = (topic: number, body: string): Promise<any> => {
  return client.post(`/comments/`, {topic, body});
};

export const addLike = (topic: number): Promise<any> => {
  return client.post('/likes/', {topic});
};

export const removeLike = (topic: number): Promise<any> => {
  return client.delete(`/likes/${topic}/`);
};

export const getLike = (topic: number): Promise<any> => {
  return client.get(`/likes/${topic}/`);
};
