import React, {useState, useEffect} from 'react';
import {Image, Text} from 'react-native-elements';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {getPromos} from '../api/home';
import {TitleDetail, ImageQuality} from '../core/interfaces/title';
import {getImageUrl, joinTopics} from '../utils/common';
import {PROMO_HEIGHT, colors} from '../constants/style';
import {useNavigation} from '@react-navigation/native';
import {checkMyList, addToMyList, removeFromMyList} from '../api/title';

export const HomePromo: React.FC = () => {
  const {promo, inMyList, setInMyList} = usePromo();

  const navigation = useNavigation();
  return (
    <>
      <Image
        source={{uri: getImageUrl(promo?.images[0].url, ImageQuality.h900)}}
        style={{height: PROMO_HEIGHT}}>
        <LinearGradient colors={['#00000055', '#00000000', '#000']} style={{height: '100%'}}>
          <View style={{flex: 1, justifyContent: 'space-between'}}>
            <View />
            <View style={{alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 10}}>{promo?.name}</Text>
              <Text style={{marginBottom: 15, color: colors.lightGray, marginHorizontal: 10}}>
                {joinTopics(promo?.genres)}
              </Text>
              <View style={{marginHorizontal: 50}}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <Icon
                    name={inMyList ? 'checkmark' : 'add'}
                    size={50}
                    color={colors.blue}
                    onPress={async () => {
                      if (!promo) {
                        return;
                      }
                      if (inMyList) {
                        try {
                          await removeFromMyList(promo.id);
                          setInMyList(false);
                        } catch {}
                      } else {
                        try {
                          await addToMyList(promo.id);
                          setInMyList(true);
                        } catch {}
                      }
                    }}
                  />
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
                    <Icon name="play" size={50} color={colors.white} style={{marginLeft: 5}} />
                  </TouchableOpacity>
                  <Icon
                    name="information-circle-outline"
                    size={50}
                    color={colors.blue}
                    onPress={() => {
                      navigation.navigate('Detail', promo);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Image>
    </>
  );
};

const usePromo = () => {
  const [promo, setPromo] = useState<TitleDetail>();
  const [inMyList, setInMyList] = useState(false);
  const [error, setError] = useState<Error | null>();

  const getTitle = async () => {
    try {
      const promos = await getPromos({limit: 1});
      const p = promos[0];
      setPromo(p);
      await checkMyList(p.id);
      setInMyList(true);
      setError(null);
    } catch (err) {
      setError(err);
      setInMyList(false);
      console.log(err);
    }
  };
  useEffect(() => {
    getTitle();
  }, []);

  return {promo, inMyList, setInMyList, error};
};
