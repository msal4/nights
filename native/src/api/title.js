import client from './client';
import {sortTopics} from '../utils/common';

export const getTitles = (params = {}) => client.get('/titles/', {params});

/**
 *
 * @param {string | number} id
 */
export const getTitle = async (id) => {
  const title = await client.get(`/titles/${id}/`);
  title.type === 's' && (title.seasons = sortTopics(title.seasons));
  return title;
};

/**
 *
 * @param {string | number} id
 */
export const getSeason = async (id) => {
  const season = await client.get(`/seasons/${id}/`);
  season.episodes = sortTopics(season.episodes);
  return season;
};

/**
 *
 * @param {string | number} id
 */
export const getEpisode = (id) => client.get(`/episodes/${id}/`);

export const getHistory = () => client.get('/history/');

/**
 *
 * @param {string | number} id
 */
export const getHit = (id) => client.get(`/history/${id}/`);

export const hitTopic = (topicId, data) =>
  client.put(`/history/${topicId}/`, data);

export const getMyList = () => client.get('/my_list/');

/**
 *
 * @param {string | number} id
 */
export const checkMyList = (id) => client.get(`/my_list/${id}/`);

/**
 *
 * @param {string | number} id
 */
export const addToMyList = (id) => client.post('/my_list/', {id});

/**
 *
 * @param {string | number} id
 */
export const removeFromMyList = (id) => client.delete(`/my_list/${id}/`);
