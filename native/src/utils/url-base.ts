import axios from 'axios';
import {privateBase, publicBase} from '../constants/const';
import AuthToken from './auth-token';

class UrlBase {
  static publicBase = publicBase;
  static privateBase = privateBase;
  static baseURL = publicBase;
  static private = false;

  static client = UrlBase.createClient(publicBase);

  static createClient(url: string) {
    const client = axios.create({
      baseURL: url + '/api',
      timeout: 10000,
    });

    client.interceptors.request.use(async (config) => ({
      ...config,
      headers: (await AuthToken.get()) && {
        Authorization: `Token ${AuthToken.token}`,
      },
    }));

    client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return client;
  }
}

export default UrlBase;
