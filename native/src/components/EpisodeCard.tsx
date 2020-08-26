import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image, Text} from 'react-native-elements';

import {Episode} from '../core/interfaces/episode';
import {colors} from '../constants/style';
import {useNavigation} from '@react-navigation/native';
import {TitleDetail} from '../core/interfaces/title';
import {Season} from '../core/interfaces/season';

export interface EpisodeCardProps {
  title: TitleDetail;
  season: Season;
  episode: Episode;
}

const EpisodeCard: FunctionComponent<EpisodeCardProps> = ({episode, title, season}) => {
  const navigation = useNavigation();

  const progress =
    episode.hits?.length > 0 ? (episode.hits[0].playback_position / episode.hits[0].runtime) * 100 : 0;

  return (
    <TouchableOpacity
      style={{flexDirection: 'row', height: 80, overflow: 'hidden', marginTop: 20}}
      onPress={() => {
        navigation.navigate('Player', {title, season, episode});
      }}>
      <Image source={{uri: episode.image}} style={{width: 150, height: 80, marginRight: 10}}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            borderRadius: 999,
            backgroundColor: colors.gray,
          }}>
          <View style={{height: '100%', width: `${progress}%`, backgroundColor: colors.red}} />
        </View>
      </Image>
      <View style={{overflow: 'hidden', flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 13, color: colors.red, marginRight: 5}}>{episode.index + 1}</Text>
          <Text style={{fontSize: 11}}>{episode.name}</Text>
        </View>
        <View style={{flexDirection: 'row', flex: 1}}>
          <Text style={{opacity: 0.75, flex: 1, flexWrap: 'wrap', fontSize: 10}}>{episode.plot}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EpisodeCard;
