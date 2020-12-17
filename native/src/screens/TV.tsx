import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {Text, Image, Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import tvClient from '../api/tv-client';
import {Promo, Category, Channel} from '../core/interfaces/channel';
import {tvBaseURL} from '../constants/const';
import ChannelRow from '../components/ChannelRow';
import {useLanguage} from '../utils/lang';
import {colors} from '../constants/style';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import WebView from 'react-native-webview';

export const TV: React.FC<{
  listRef?: React.MutableRefObject<FlatList>;
  header: any;
  onPress?: (channel: Channel) => void;
}> = ({listRef, header, onPress}) => {
  const {categories} = useRows();

  return (
    <FlatList
      ref={listRef}
      keyExtractor={(item) => item.id.toString()}
      data={[{id: 21312412}, ...(categories || [])] as Category[]}
      renderItem={({item, index}) => {
        if (index === 0) {
          return header;
        }
        return <ChannelRow key={item.id} category={item} onPress={onPress} />;
      }}
    />
  );
};

const PromoHeader: React.FC = () => {
  const {promo} = usePromo();
  const {lang, t} = useLanguage();
  const navigation = useNavigation();

  return (
    <Image source={{uri: `${tvBaseURL}${promo?.promo_image}`}} style={{height: 400, marginBottom: 25}}>
      <LinearGradient colors={['#00000055', '#00000000', '#000']} style={{height: '100%'}}>
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: 50}}>
          <Button
            title={t('watchNow')}
            buttonStyle={{borderRadius: 9999, paddingHorizontal: 40}}
            onPress={async () => {
              try {
                const {channel}: {channel: Channel} = await tvClient.get(`channels/${promo?.channel_id}`);

                if (channel) {
                  navigation.navigate('TvPlayer', channel);
                }
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
};

const Tab = createMaterialTopTabNavigator();

const TVTab: React.FC = () => <TV header={<PromoHeader />} />;

const ScheduleTab: React.FC = () => {
  const {lang} = useLanguage();

  return (
    <WebView
      source={{uri: 'http://tv.sawadland.com/bare-schedule'}}
      javaScriptEnabled
      injectedJavaScript={`
      (function(){
        window.localStorage.setItem('locale', '${lang === 'ar' ? '_ar' : ''}');
      })();
      `}
    />
  );
};

const NewsTab: React.FC = () => {
  const {lang} = useLanguage();

  return (
    <WebView
      source={{uri: 'http://tv.sawadland.com/bare-news'}}
      javaScriptEnabled
      injectedJavaScript={`
      (function(){
        window.localStorage.setItem('locale', '${lang === 'ar' ? '_ar' : ''}');
      })();
      `}
    />
  );
};

export const TVScreen: React.FC = () => {
  const {t} = useLanguage();

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {color: colors.white},
          style: {backgroundColor: colors.black},
        }}>
        <Tab.Screen name="TV" component={TVTab} options={{title: t('tv')}} />
        <Tab.Screen name="Schedule" component={ScheduleTab} options={{title: t('schedule')}} />
        <Tab.Screen name="News" component={NewsTab} options={{title: t('news')}} />
      </Tab.Navigator>
    </SafeAreaView>
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
