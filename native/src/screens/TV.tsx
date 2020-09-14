import React, {useState, useCallback, useEffect} from 'react';
import {View, FlatList} from 'react-native';
import {Text, Image, Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

import tvClient from '../api/tv-client';
import {Promo, Category, Channel} from '../core/interfaces/channel';
import {tvBaseURL} from '../constants/const';
import ChannelRow from '../components/ChannelRow';
import {useLanguage} from '../utils/lang';

export const TVScreen: React.FC = () => {
  const {categories} = useRows();
  const {promo} = usePromo();
  const {t, lang} = useLanguage();
  const navigation = useNavigation();

  return (
    <FlatList
      keyExtractor={(item) => item.id.toString()}
      data={[{id: 21312412}, ...(categories || [])] as Category[]}
      renderItem={({item, index}) => {
        if (index === 0) {
          return (
            <Image
              source={{uri: `${tvBaseURL}${promo?.promo_image}`}}
              style={{height: 400, marginBottom: 25}}>
              <LinearGradient colors={['#00000055', '#00000000', '#000']} style={{height: '100%'}}>
                <View
                  style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: 50}}>
                  <Button
                    title={t('watchNow')}
                    buttonStyle={{borderRadius: 9999, paddingHorizontal: 40}}
                    onPress={async () => {
                      try {
                        const channel: Channel = await tvClient.get(`channels/${promo?.channel_id}`);
                        navigation.navigate('TvPlayer', channel);
                      } catch {}
                    }}
                  />
                  <Text style={{marginTop: 10, fontSize: 17}}>
                    {promo && (promo as any)['title' + (lang === 'en' ? '' : '_ar')]}
                  </Text>
                </View>
              </LinearGradient>
            </Image>
          );
        }
        return <ChannelRow key={item.id} category={item} />;
      }}
    />
  );
};

const usePromo = () => {
  const [promo, setPromo] = useState<Promo | null>();
  const [error, setError] = useState<Error | null>();

  const getPromo = useCallback(async () => {
    try {
      const {home_promo}: {home_promo: Promo} = await tvClient.get('/home_promo');
      setPromo(home_promo);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }, []);

  useEffect(() => {
    getPromo();
  }, [getPromo]);

  return {promo, error};
};

const useRows = () => {
  const [categories, setCategories] = useState<Category[]>();
  const [error, setError] = useState<Error | null>();

  const getChannels = useCallback(async () => {
    try {
      const {categories: data}: {categories: Category[]} = await tvClient.get('/categories');
      const {channels}: {channels: Channel[]} = await tvClient.get('/channels');
      const cats = data.map(
        (c) => ({...c, channels: channels.filter((ch) => ch.category_id === c.id)} as Category),
      );
      setCategories(cats);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }, []);

  useEffect(() => {
    getChannels();
  }, [getChannels]);

  return {categories, error, getChannels};
};
