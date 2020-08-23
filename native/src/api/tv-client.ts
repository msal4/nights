import axios from 'axios';

const tvClient = axios.create({
  baseURL: 'http://tv.sawadland.com/api',
  timeout: 10000,
});

tvClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default tvClient;
