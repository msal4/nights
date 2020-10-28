import axios from 'axios';

const tvClient = axios.create({
  baseURL: 'http://172.18.0.199/api',
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
