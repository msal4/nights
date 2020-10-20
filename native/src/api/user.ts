import UrlBase from '../utils/url-base';
import {LoginData, UserDetail} from '../core/interfaces/user';

export const loginUser = (username: string, password: string): Promise<LoginData> =>
  UrlBase.client.post('/auth/token/login/', {username, password});

export const registerUser = (email: string, username: string, password: string): Promise<UserDetail> =>
  UrlBase.client.post('/auth/users/', {email, username, password});
