import React, { FunctionComponent, useRef, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, Icon, Image } from 'react-native-elements';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Menu from 'react-native-material-menu';
import LinearGradient from 'react-native-linear-gradient';

import { Episode } from '../core/interfaces/episode';
import { colors } from '../constants/style';
import { useNavigation } from '@react-navigation/native';
import { TitleDetail } from '../core/interfaces/title';
import { Season } from '../core/interfaces/season';
import { Downloader, SubtitleItem, DownloadTask, DownloadStatus } from '../core/Downloader';
import { swapEpisodeUrlId, getImageUrl } from '../utils/common';
import { useUrl } from '../context/url-context';
import { useTranslation } from 'react-i18next';
import { privateBase } from '../constants/const';
import { useRemoteMediaClient } from 'react-native-google-cast';
import { playEpisodeRemotely } from '../utils/play-episode';

export interface EpisodeCardProps {
  title: TitleDetail;
  season: Season;
  episode: Episode;
  task?: DownloadTask;
  screenName?: string;
}

const EpisodeCard: FunctionComponent<EpisodeCardProps> = ({ episode, title, task, season }) => {
  const menuRef = useRef<Menu>();

  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isPrivate } = useUrl();
  const circularProgress = useRef<AnimatedCircularProgress>();
  const client = useRemoteMediaClient();

  useEffect(() => {
    if (task) {
      circularProgress.current?.animate(task.progress, 500);
    }
  }, [task]);

  const progress =
    episode.hits?.length > 0 ? (episode.hits[0].playback_position / episode.hits[0].runtime) * 100 : 0;

  const image = episode.image ?? getImageUrl(title.images[0]?.url);

  const playEpisode = isPrivate
    ? () => {
      if (client) {
        playEpisodeRemotely(episode, title, client);
        return;
      }

      navigation.navigate('WebPlayer', {
        url: `${privateBase}/series/${title.id}/${season.id}/${episode.index}/play`,
      });

      // if (Platform.OS === 'ios' && screenName === 'Player') {
      //   (navigation as any).replace('SeriesPlayer', {title, season, episode});
      // } else {
      //   navigation.navigate('SeriesPlayer', {title, season, episode});
      // }
    }
    : undefined;

  return (
    <View
      style={{
        flexDirection: 'row',
        // alignItems: 'center',
        height: 80,
        overflow: 'hidden',
        marginTop: 20,
      }}>
      <TouchableOpacity onPress={playEpisode}>
        <Image
          resizeMethod="resize"
          transition={false}
          source={{ uri: image }}
          style={{ justifyContent: 'center', alignItems: 'center', width: 135, height: 80, marginRight: 10 }}>
          {isPrivate ? (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: colors.blueGray,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 40,
              }}>
              <Icon type="ionicon" name="play" size={20} color={colors.white} style={{ marginLeft: 2 }} />
            </View>
          ) : null}
          {isPrivate && progress ? (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: 5,
                overflow: 'hidden',
                borderRadius: 999,
                backgroundColor: colors.gray,
              }}>
              <LinearGradient
                useAngle
                angle={90}
                colors={[colors.blue, colors.red]}
                style={{ height: '100%', width: `${progress}%` }}
              />
            </View>
          ) : null}
        </Image>
      </TouchableOpacity>
      <View style={{ overflow: 'hidden', flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: colors.red, marginRight: 5 }}>{episode.index + 1}</Text>
          <Text style={{ fontSize: 9 }}>{episode.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={{ opacity: 0.5, flex: 1, flexWrap: 'wrap', fontSize: 7 }}>{episode.plot}</Text>
        </View>
      </View>
      {isPrivate ? (
        <TouchableOpacity
          style={{ marginLeft: 5 }}
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
          {!task ? <Icon type="ionicon" name="download-outline" color={colors.blue} size={30} /> : null}
          {task &&
            Downloader.renderMenu(
              menuRef,
              task,
              task.status === DownloadStatus.DOWNLOADING ? (
                <AnimatedCircularProgress
                  ref={circularProgress as any}
                  size={35}
                  fill={0}
                  width={6}
                  rotation={1}
                  tintColor={colors.blue}
                  backgroundColor={colors.gray}
                />
              ) : task.status === DownloadStatus.DONE ? (
                <Icon type="ionicon" name="ellipsis-vertical-sharp" size={20} color={colors.blue} />
              ) : (
                <Icon type="ionicon" name="refresh" size={25} color={colors.red} />
              ),
              t,
              navigation,
            )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default EpisodeCard;
