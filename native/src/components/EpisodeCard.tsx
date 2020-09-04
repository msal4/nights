import React, {FunctionComponent, useRef} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image, Text, Icon} from 'react-native-elements';

import {Episode} from '../core/interfaces/episode';
import {colors} from '../constants/style';
import {useNavigation} from '@react-navigation/native';
import {TitleDetail} from '../core/interfaces/title';
import {Season} from '../core/interfaces/season';
import {Downloader, SubtitleItem, DownloadTask, DownloadStatus} from '../core/Downloader';
import {swapEpisodeUrlId, getImageUrl} from '../utils/common';
import Menu from 'react-native-material-menu';
import {useLanguage} from '../utils/lang';

export interface EpisodeCardProps {
  title: TitleDetail;
  season: Season;
  episode: Episode;
  task?: DownloadTask;
}

const EpisodeCard: FunctionComponent<EpisodeCardProps> = ({episode, title, task, season}) => {
  const menuRef = useRef<Menu>();
  const navigation = useNavigation();
  const {t} = useLanguage();

  const progress =
    episode.hits?.length > 0 ? (episode.hits[0].playback_position / episode.hits[0].runtime) * 100 : 0;

  const image = episode.image ?? getImageUrl(title.images[0]?.url);

  return (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center', height: 80, overflow: 'hidden', marginTop: 20}}
      onPress={() => {
        navigation.navigate('SeriesPlayer', {title, season, episode});
      }}>
      <Image source={{uri: image}} style={{width: 135, height: 80, marginRight: 10}}>
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
      <TouchableOpacity
        onPress={() => {
          if (task) {
            return menuRef.current?.show();
          }

          const video = episode.videos[0].url;
          const subtitles = episode.subtitles.map(
            (sub) =>
              ({
                lang: sub.language ?? 'ar',
                url: swapEpisodeUrlId(sub.url)?.replace('{f}', 'vtt'),
              } as SubtitleItem),
          );

          Downloader.download({
            id: episode.id,
            name: episode.name,
            season: season.id,
            image: image!,
            title: title.id,
            type: 'e',
            video,
            subtitles,
          });
        }}>
        {!task ? (
          <Icon
            type="ionicon"
            name="download-outline"
            color={colors.blue}
            size={30}
            style={{marginLeft: 5}}
          />
        ) : null}
        {task &&
          Downloader.renderMenu(
            menuRef,
            task,
            <Icon
              type="ionicon"
              name="ellipsis-vertical-sharp"
              color={task.status === DownloadStatus.ERROR ? colors.red : colors.blue}
            />,
            t,
            navigation,
          )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default EpisodeCard;
