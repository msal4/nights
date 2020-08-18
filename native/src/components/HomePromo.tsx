import React, {useState, useEffect} from 'react';
import {View} from 'react-native';

import {getPromos} from '../api/home';
import {TitleDetail} from '../core/interfaces/title';

export const HomePromo: React.FC = () => {
  const {} = usePromo();
  // TODO: Implement HomePromo
  return <View />;
};

const usePromo = () => {
  const [promo, setPromo] = useState<TitleDetail>();
  const [error, setError] = useState<Error | null>();

  const getTitle = async () => {
    try {
      const promos = await getPromos({limit: 1});
      console.log(promos);
      setPromo(promos[0]);
      setError(null);
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };
  useEffect(() => {
    getTitle();
  }, []);

  return {promo, error};
};
