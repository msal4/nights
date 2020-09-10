import React, {FunctionComponent, useRef, useEffect} from 'react';
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
import GoogleCast from 'react-native-google-cast';
import LinearGradient from 'react-native-linear-gradient';
import {useUrl} from '../context/url-context';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

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
  const {isPrivate} = useUrl();
  const circularProgress = useRef<AnimatedCircularProgress>();

  useEffect(() => {
    if (task) {
      circularProgress.current?.animate(task.progress, 500);
    }
  }, [task]);

  const progress =
    episode.hits?.length > 0 ? (episode.hits[0].playback_position / episode.hits[0].runtime) * 100 : 0;

  const image = episode.image ?? getImageUrl(title.images[0]?.url);

  const playEpisode = isPrivate
    ? async () => {
        const state = await GoogleCast.getCastState();
        if (state === 'Connected') {
          GoogleCast.castMedia({
            mediaUrl: episode.videos[0]?.url.replace('{q}', '720').replace('{f}', 'mp4'),
            imageUrl: image,
            posterUrl: getImageUrl(title.images[0].url),
            title: episode.name,
            subtitle: episode.plot,
            studio: '1001 Nights',
            streamDuration: episode.runtime || 0, // seconds
          });
        } else {
          navigation.navigate('SeriesPlayer', {title, season, episode});
        }
      }
    : undefined;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
        overflow: 'hidden',
        marginTop: 20,
      }}>
      <TouchableOpacity onPress={playEpisode}>
        <Image
          source={{uri: image}}
          style={{justifyContent: 'center', alignItems: 'center', width: 135, height: 80, marginRight: 10}}>
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
              <Icon type="ionicon" name="play" size={20} color={colors.white} style={{marginLeft: 2}} />
            </View>
          ) : null}
          {progress ? (
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
                style={{height: '100%', width: `${progress}%`}}
              />
            </View>
          ) : null}
        </Image>
      </TouchableOpacity>
      <View style={{overflow: 'hidden', flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 11, color: colors.red, marginRight: 5}}>{episode.index + 1}</Text>
          <Text style={{fontSize: 9}}>{episode.name}</Text>
        </View>
        <View style={{flexDirection: 'row', flex: 1}}>
          <Text style={{opacity: 0.5, flex: 1, flexWrap: 'wrap', fontSize: 7}}>{episode.plot}</Text>
        </View>
      </View>
      {isPrivate ? (
        <TouchableOpacity
          style={{marginLeft: 5}}
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
          {!task ? <Icon type="ionicon" name="download-outline" color={colors.blue} size={35} /> : null}
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
                <Icon type="ionicon" name="ellipsis-vertical-sharp" size={35} color={colors.blue} />
              ) : (
                <Icon type="ionicon" name="refresh" size={35} color={colors.red} />
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
