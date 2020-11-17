import React, {FunctionComponent, useState, useEffect} from 'react';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import UrlBase from '../utils/url-base';
import {privateBase, publicBase} from '../constants/const';
import {Platform} from 'react-native';

const UrlContext = React.createContext<Base>({
  base: UrlBase.baseURL,
  isPrivate: false,
  online: true,
  load: async () => console.log('Register not implemented'),
});

export interface Base {
  base: string;
  isPrivate: boolean;
  online: boolean;
  load: () => Promise<void>;
}

const useBase = () => {
  const [base, setBase] = useState({base: UrlBase.baseURL, isPrivate: UrlBase.private, online: true});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const info = await NetInfo.fetch();
    let online = true;

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
      UrlBase.baseURL = publicBase;
      online = false;
    }

    UrlBase.private = UrlBase.baseURL === privateBase;
    UrlBase.client = UrlBase.createClient(UrlBase.baseURL);
    setBase({base: UrlBase.baseURL, isPrivate: UrlBase.private, online});
  };

  return {load, ...base};
};

const UrlProvider: FunctionComponent<{}> = (props) => {
  const base = useBase();

  return <UrlContext.Provider {...props} value={base} />;
};

const useUrl = () => React.useContext<Base>(UrlContext);

const UrlConsumer = UrlContext.Consumer;

export {useUrl, UrlProvider, UrlConsumer};
