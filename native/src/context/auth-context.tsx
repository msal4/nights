import React, {FunctionComponent, useState, useEffect} from 'react';

import AuthToken from '../utils/auth-token';
import {loginUser, registerUser} from '../api/user';

const AuthContext = React.createContext<Auth>({
  token: null,
  login: async () => console.log('Login not implemented'),
  logout: async () => console.log('Logout not implemented'),
  register: async () => console.log('Register not implemented'),
});

type LoginFunction = (username: string, password: string) => Promise<void>;

export interface Auth {
  token: string | null;
  login: LoginFunction;
  register: LoginFunction;
  logout: () => Promise<void>;
}

const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => setToken(await AuthToken.get()))();
  }, []);

  const storeToken = async (t: string) => {
    await AuthToken.store(t);
    setToken(t);
  };

  const removeToken = async () => {
    await AuthToken.remove();
    setToken(null);
  };

  return {token, storeToken, removeToken};
};

const AuthProvider: FunctionComponent<{}> = (props) => {
  const {token, storeToken, removeToken} = useToken();

  const register: LoginFunction = async (username, password) => {
    await registerUser('', username, password);
    await login(username, password);
  };

  const login: LoginFunction = async (username, password) => {
    const data = await loginUser(username, password);
    await storeToken(data.auth_token);
  };

  const logout = removeToken;

  return <AuthContext.Provider value={{token, login, logout, register}} {...props} />;
};

const useAuth = () => React.useContext<Auth>(AuthContext);

const AuthConsumer = AuthContext.Consumer;

export {AuthProvider, useAuth, AuthConsumer, AuthContext};
