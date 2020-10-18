import {Topic} from '../core/interfaces/topic';
import UrlBase from '../utils/url-base';

export const getGenres = (): Promise<Topic[]> => UrlBase.client.get('/genres/');
