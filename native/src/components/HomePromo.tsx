import React, {useState, useEffect} from 'react';
import {Image} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import {getPromos} from '../api/home';
import {TitleDetail} from '../core/interfaces/title';
import {getImageUrl} from '../utils/common';

export const HomePromo: React.FC = () => {
  const {promo} = usePromo();
  // TODO: Implement HomePromo
  return (
    <Image source={{uri: getImageUrl(promo?.images[0].url)}} style={{height: 500}}>
      <LinearGradient colors={['#00000055', '#00000000', '#000']} style={{height: 500}} />
    </Image>
  );
};

const usePromo = () => {
  const [promo, setPromo] = useState<TitleDetail>();
  const [error, setError] = useState<Error | null>();

  const getTitle = async () => {
    try {
      const promos = await getPromos({limit: 1});
      console.log(JSON.stringify(promos, null, 2));
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
