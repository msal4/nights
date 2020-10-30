import React, {FunctionComponent, useState, useEffect} from 'react';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import UrlBase from '../utils/url-base';
import {privateBase, publicBase} from '../constants/const';
import {Platform} from 'react-native';

const UrlContext = React.createContext<Base>({
  base: UrlBase.baseURL,
  isPrivate: false,
  load: async () => console.log('Register not implemented'),
});

export interface Base {
  base: string;
  isPrivate: boolean;
  load: () => Promise<void>;
}

const useBase = () => {
  const [base, setBase] = useState({base: UrlBase.baseURL, isPrivate: UrlBase.private});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const info = await NetInfo.fetch();

    if (info.isConnected) {
      try {
        const res = await axios.head(privateBase);
        if (res.status === 200) {
          UrlBase.baseURL = privateBase;
        } else {
          UrlBase.baseURL = publicBase;
        }
      } catch {
        UrlBase.baseURL = publicBase;
      }
    } else {
      UrlBase.baseURL = privateBase;
    }

    UrlBase.private = UrlBase.baseURL === privateBase;
    UrlBase.client = UrlBase.createClient(UrlBase.baseURL);
    setBase({base: UrlBase.baseURL, isPrivate: UrlBase.private});
  };

  return {load, ...base};
};

const UrlProvider: FunctionComponent<{}> = (props) => {
  const {base, isPrivate, load} = useBase();

  return <UrlContext.Provider {...props} value={{base, isPrivate, load}} />;
};

const useUrl = () => React.useContext<Base>(UrlContext);

const UrlConsumer = UrlContext.Consumer;

export {useUrl, UrlProvider, UrlConsumer};
