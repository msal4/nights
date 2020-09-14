import axios from 'axios';
import AuthToken from './auth-token';

class UrlBase {
  static publicBase = 'http://185.217.88.44:1001';
  static privateBase = 'http://172.18.0.224';
  static baseURL = UrlBase.publicBase;
  static private = false;

  static client = UrlBase.createClient();

  static createClient() {
    const client = axios.create({
      baseURL: this.baseURL + '/api',
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
