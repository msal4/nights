import axios from 'axios';

import AuthToken from '../utils/auth-token';
import {baseURL} from '../constants/const';

const client = axios.create({
  baseURL,
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

export default client;
