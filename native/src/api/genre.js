import client from './client';

export const getGenres = () => client.get('/genres/');
