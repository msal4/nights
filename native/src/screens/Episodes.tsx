import React, {FunctionComponent, useState, useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

import {TitleDetail} from '../core/interfaces/title';
import {Season} from '../core/interfaces/season';
import {getSeason} from '../api/title';
import {colors} from '../constants/style';
import EpisodeCard from '../components/EpisodeCard';
import {Downloader, DownloadTask} from '../core/Downloader';
import {useTranslation} from 'react-i18next';

interface SeasonsParams {
  title: TitleDetail;
  screenName?: string;
}

export const EpisodesScreen: FunctionComponent = () => {
  const params = useRoute().params as SeasonsParams;
  const {title} = params;
  const {t} = useTranslation();

  const [season, setSeason] = useState(title.seasons[0]);

  const {seasonDetails} = useSeason(season.id);
  const [tasks, setTasks] = useState<(DownloadTask & Realm.Object)[]>();

  useEffect(() => {
    let listener = () => {
      setTasks(Downloader.seasonTasks(season.id));
    };

    listener();

    Downloader.onChange(listener);

    return () => {
      Downloader.removeOnChangeListener(listener);
    };
  }, [season.id]);

  return (
    <View style={{padding: 10}}>
      <DropDownPicker
        items={title.seasons.map((value) => ({label: `${t('season')} ${value.index + 1}`, value}))}
        defaultValue={season}
        searchable={title.seasons.length > 3}
        searchablePlaceholder={t('search')}
        searchablePlaceholderTextColor={colors.white + 'cc'}
        searchableStyle={{textAlign: 'center', color: colors.white}}
        containerStyle={{height: 40}}
        style={{backgroundColor: colors.blueGray, borderWidth: 0}}
        itemStyle={{
          justifyContent: 'flex-start',
        }}
        dropDownStyle={{backgroundColor: colors.lightBlueGray, borderWidth: 0}}
        labelStyle={{color: colors.white, textAlign: 'center', flex: 1}}
        arrowColor={colors.white}
        onChangeItem={(item) => setSeason(item.value)}
        zIndex={100}
      />
      {seasonDetails && (
        <View>
          {seasonDetails.episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              title={title}
              task={tasks?.find((task) => task.id === episode.id)}
              screenName={params.screenName}
              season={seasonDetails}
              episode={episode}
            />
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
