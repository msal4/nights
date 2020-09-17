import {Topic} from '../core/interfaces/topic';
import UrlBase from '../utils/url-base';
const {client} = UrlBase;

export const getGenres = (): Promise<Topic[]> => client.get('/genres/');
