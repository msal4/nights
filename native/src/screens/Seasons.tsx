import React, {FunctionComponent, useState, useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

import {TitleDetail} from '../core/interfaces/title';
import {Season} from '../core/interfaces/season';
import {getSeason} from '../api/title';
import {colors} from '../constants/style';
import EpisodeCard from '../components/EpisodeCard';

interface SeasonsParams {
  title: TitleDetail;
}

export const EpisodesScreen: FunctionComponent = () => {
  const params: SeasonsParams = useRoute().params as any;
  const {title} = params;

  const [season, setSeason] = useState(title.seasons[0]);

  const {seasonDetails} = useSeason(season.id);

  return (
    <View style={{padding: 10}}>
      <DropDownPicker
        items={title.seasons.map((value) => ({label: `Season ${value.index + 1}`, value}))}
        defaultValue={season}
        searchable
        searchablePlaceholder="Search..."
        searchablePlaceholderTextColor={colors.white + 'cc'}
        searchableStyle={{flex: 1, textAlign: 'center', color: colors.white}}
        containerStyle={{height: 40}}
        style={{backgroundColor: colors.blueGray, borderWidth: 0}}
        itemStyle={{
          justifyContent: 'flex-start',
        }}
        dropDownStyle={{backgroundColor: colors.lightBlueGray, borderWidth: 0}}
        labelStyle={{color: colors.white, textAlign: 'center', flex: 1}}
        arrowColor={colors.white}
        onChangeItem={(item) => setSeason(item.value)}
      />
      {seasonDetails && (
        <View>
          {seasonDetails.episodes.map((episode) => (
            <EpisodeCard episode={episode} />
          ))}
        </View>
      )}
    </View>
  );
};

const useSeason = (id: number) => {
  const [seasonDetails, setSeasonDetails] = useState<Season>();
  const [error, setError] = useState<Error | null>();

  const fetchSeason = useCallback(async () => {
    try {
      const season = await getSeason(id);
      setSeasonDetails(season);
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, [id]);

  useEffect(() => {
    fetchSeason();
  }, [fetchSeason]);

  return {seasonDetails, error};
};
