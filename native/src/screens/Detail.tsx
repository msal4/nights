import React, {useState, useCallback, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useRoute, useNavigation} from '@react-navigation/native';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {Image, Icon, Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {getImageUrl, joinTopics} from '../utils/common';
import {ImageQuality, TitleDetail} from '../core/interfaces/title';
import {getTitle} from '../api/title';
import {colors} from '../constants/style';
import {TrailerScreen} from './Trailer';
import {InfoScreen} from './Info';
import {EpisodesScreen} from './Seasons';

const Tab = createMaterialTopTabNavigator();

export const DetailScreen: React.FC = () => {
  const {params} = useRoute();

  const navigation = useNavigation();
  const {title} = useTitle((params as any).id);

  if (title && title.genres.length > 3) {
    title.genres.length = 3;
  }

  return (
    <ScrollView>
      <Image source={{uri: getImageUrl(title?.images[0].url, ImageQuality.h900)}} style={{height: 400}}>
        <LinearGradient colors={['#00000088', '#00000000', '#000']} style={{height: '100%'}}>
          <SafeAreaView
            edges={['top']}
            style={{flex: 1, justifyContent: 'space-between', marginHorizontal: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Icon
                type="ionicon"
                size={50}
                color={colors.white}
                name="chevron-back-sharp"
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Icon type="ionicon" size={50} color={colors.white} name="add" />
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: colors.red,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 40,
                }}
                onPress={() => {}}>
                <Icon type="ionicon" name="play" size={50} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 10}}>{title?.name}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <View style={{flexDirection: 'row', marginRight: 10, alignItems: 'center'}}>
                  <Icon type="ionicon" size={18} name="star" color={colors.blue} style={{marginRight: 5}} />
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>{title?.rating}</Text>
                </View>
                <Text style={{fontWeight: 'bold', fontSize: 18, marginRight: 10}}>
                  {title?.type === 'm'
                    ? Math.round((title?.runtime ?? 0) / 60) + ' min'
                    : title?.seasons.length + ' Seasons'}
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>{title?.released_at}</Text>
              </View>
              <Text style={{marginBottom: 10, color: colors.lightGray}}>{joinTopics(title?.genres)}</Text>
              <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
                <Text style={{color: colors.lightGray, marginRight: 10}}>{title?.rated}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon type="ionicon" size={18} name="eye" color={colors.blue} style={{marginRight: 5}} />
                  <Text style={{color: colors.lightGray}}>{title?.views}</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Image>
      {title && (
        <Tab.Navigator
          tabBarOptions={{
            labelStyle: {color: colors.white},
            style: {backgroundColor: colors.black},
          }}>
          {title?.type === 's' ? (
            <Tab.Screen name="Episodes" initialParams={{title}} component={EpisodesScreen} />
          ) : null}
          {title?.trailers.length ? (
            <Tab.Screen name="Trailers" initialParams={{title}} component={TrailerScreen} />
          ) : null}
          <Tab.Screen name="Info" initialParams={{title}} component={InfoScreen} />
        </Tab.Navigator>
      )}
    </ScrollView>
  );
};

const useTitle = (id: number | string) => {
  const [title, setTitle] = useState<TitleDetail | null>();
  const [error, setError] = useState<Error | null>();

  const getInfo = useCallback(async () => {
    try {
      setTitle(null);
      const data = await getTitle(id);
      setTitle(data);
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, [id]);

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  return {title, error, getTitle: getInfo};
};
