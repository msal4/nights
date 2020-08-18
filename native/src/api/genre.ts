import {Topic} from '../core/interfaces/topic';
import client from './client';

export const getGenres = (): Promise<Topic[]> => client.get('/genres/');
