import {TitleDetail, Title} from '../core/interfaces/title';
import {PaginatedResults} from '../core/interfaces/paginated-results';
import {GenreRow} from '../core/interfaces/home';
import UrlBase from '../utils/url-base';

export const getPromos = (params: any): Promise<TitleDetail[]> => UrlBase.client.get('/promos/', {params});

export const getRecentlyAdded = (params = {}): Promise<PaginatedResults<Title[]>> =>
  UrlBase.client.get('/recently_added/', {params});

export const getTrending = (params = {}): Promise<PaginatedResults<Title[]>> =>
  UrlBase.client.get('/trending/', {params});

export const getGenreRows = (params = {}): Promise<PaginatedResults<GenreRow[]>> =>
  UrlBase.client.get('/genre_rows/', {params});
