import React, {FunctionComponent, useState, useEffect} from 'react';
import axios from 'axios';

import UrlBase from '../utils/url-base';
import {privateBase, publicBase} from '../constants/const';

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

  console.log('this is the base:', base);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.head(privateBase);
      if (res.status === 200) {
        UrlBase.baseURL = privateBase;
      } else {
        UrlBase.baseURL = publicBase;
      }
    } catch {
      UrlBase.baseURL = publicBase;
    } finally {
      UrlBase.private = UrlBase.baseURL === privateBase;
      UrlBase.client = UrlBase.createClient();
      setBase({base: UrlBase.baseURL, isPrivate: UrlBase.private});
    }
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
