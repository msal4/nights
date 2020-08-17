import client from './client';

export const getPromos = (params) => client.get('/promos/', {params});

export const getRecentlyAdded = (params = {}) =>
  client.get('/recently_added/', {params});

export const getTrending = (params = {}) => client.get('/trending/', {params});

export const getGenreRows = (params = {}) =>
  client.get('/genre_rows/', {params});
