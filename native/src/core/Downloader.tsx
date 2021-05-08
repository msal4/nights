import React from 'react';
import Realm from 'realm';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob, {StatefulPromise, FetchBlobResponse} from 'rn-fetch-blob';
import Menu, {MenuItem} from 'react-native-material-menu';
import fs from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../constants/style';
import {OfflinePlayerParams} from '../screens/OfflinePlayer';
import {Platform} from 'react-native';

interface TaskParams {
  id: number;
  name: string;
  title: number;
  season?: number;
  image: string;
  video: string;
  subtitles?: SubtitleItem[];
  size?: number;
  type: 'e' | 'm';
  progress?: number;
  status?: DownloadStatus;
}

export interface DownloadTask extends TaskParams {
  path: string;
  imagePath?: string;
  status: DownloadStatus;
  progress: number;
  subtitles: SubtitleItem[];
  offlineSubtitles: SubtitleItem[];
}

export enum DownloadStatus {
  DOWNLOADING = 'DOWNLOADING',
  PAUSED = 'PAUSED',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

type TaskStatus = DownloadStatus | 'DOESNOTEXIST';

export interface SubtitleItem {
  url: string;
  lang: string;
}

class Subtitle {
  static schema = {
    name: 'Subtitle',
    primaryKey: 'url',
    properties: {
      url: 'string',
      lang: {type: 'string', default: 'ar'},
    },
  };
}

class Task {
  static schema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      image: 'string',
      imagePath: 'string?',
      title: 'int',
      season: 'int?',
      video: 'string',
      subtitles: 'Subtitle[]',
      offlineSubtitles: 'Subtitle[]',
      size: 'int?',
      type: 'string',
      progress: {type: 'double', default: 0},
      path: 'string',
      status: {type: 'string', default: 'DOWNLOADING'},
    },
  };
}

export class Downloader {
  private static realm: Realm;
  private static statefulPromises: {[key: number]: StatefulPromise<FetchBlobResponse>} = {};

  static async open() {
    this.realm = await Realm.open({
      schema: [Task, Subtitle],
      schemaVersion: 1,
    });

    this.realm.objects<DownloadTask>('Task').forEach((t) => {
      if (t.status === DownloadStatus.DOWNLOADING) {
        this.download(t);
      }
    });
  }

  static tasks() {
    return this.realm.objects<DownloadTask>('Task');
  }

  static task(id: number): DownloadTask | undefined {
    return this.realm.objects<DownloadTask>('Task').find((t) => t.id === id);
  }

  static titleTasks(titleId: number) {
    return this.realm.objects<DownloadTask>('Task').filter((task) => task.title === titleId);
  }

  static seasonTasks(seasonId: number) {
    return this.realm.objects<DownloadTask>('Task').filter((task) => task.season === seasonId);
  }

  static listFiles() {
    RNFetchBlob.fs.ls(this.mediaDir).then((files) => {
      console.log('mediaDir:', this.mediaDir);
      console.log(files);
    });
  }

  static mediaDir = `${RNBackgroundDownloader.directories.documents}/media`;

  static isAndroid = Platform.OS === 'android';

  static download(params: TaskParams) {
    const mediaDir = this.mediaDir;
    const imagesDir = `${RNBackgroundDownloader.directories.documents}/images`;

    const path = `${mediaDir}/${params.id}.mp4`;
    const tmpPath = `${path}.download`;
    const imagePath = `${imagesDir}/${params.id}.jpg`;

    this.realm.write(async () => {
      let task = this.task(params.id)!;

      if (task === undefined) {
        task = this.realm.create('Task', {...params, path} as any);
      }

      task.status = DownloadStatus.DOWNLOADING;
      task.progress = 0;

      // create images and media directories
      try {
        if (!(await fs.exists(imagesDir))) {
          await fs.mkdir(imagesDir);
        }
      } catch {}

      try {
        if (!(await fs.exists(mediaDir))) {
          await fs.mkdir(mediaDir);
        }
      } catch {}

      // download image
      if (!task.imagePath && task.image.startsWith('http')) {
        fs.downloadFile({fromUrl: task.image, toFile: imagePath}).promise.then((res) => {
          console.log(res);
          if (task) {
            this.realm.write(() => {
              task.imagePath = imagePath;
            });
            console.log('got image:', imagePath);
          }
        });
      }

      // download subtitles
      // I didn't think I'm gonna read this code again... sorry
      if (task.offlineSubtitles.length !== task.subtitles.length) {
        for (const sub of task.subtitles) {
          if (sub) {
            const subPath = path.replace('.mp4', `.${sub.lang}.vtt`);
            fs.downloadFile({
              fromUrl: sub.url,
              toFile: subPath,
            }).promise.then((_) => {
              if (task) {
                this.realm.write(() => {
                  task.offlineSubtitles.push({url: subPath, lang: sub.lang});
                });
                console.log('got subtitle:', subPath);
              }
            });
          }
        }
      }

      if (await fs.exists(tmpPath)) {
        await RNFetchBlob.fs.appendFile(path, tmpPath, 'uri');
        await fs.unlink(tmpPath);
      }

      let pathStat: fs.StatResult = {size: 0} as any;
      if (await fs.exists(path)) {
        pathStat = await fs.stat(path);
      }

      console.log(pathStat);

      const statefulPromise = RNFetchBlob.config({
        IOSBackgroundTask: true,
        IOSDownloadTask: true,
        fileCache: true,
        path: tmpPath,
      } as any).fetch('GET', params.video, {Range: `bytes=${pathStat.size}-`});

      this.statefulPromises[task.id] = statefulPromise;

      statefulPromise
        .progress((received, total) => {
          console.log(`received: ${received} total: ${total}`);

          const progress = Math.round(
            ((Number(received) + Number(pathStat.size)) / (Number(total) + Number(pathStat.size))) * 100,
          );
          console.log(`${task.name}: Downloaded: ${progress}%`);
          if (progress > task.progress) {
            this.realm.write(() => {
              task.size = Number(total);
              task.progress = progress;
            });
          }
        })
        .then(async (res) => {
          console.log(`${task.name}: Download is done!`);
          console.log('file saved to:', res.path());
          try {
            await RNFetchBlob.fs.appendFile(path, res.path(), 'uri');
          } catch (e) {
            console.log('error from appending file:', e);
          }
          try {
            await fs.unlink(res.path());
          } catch (e) {
            console.log('error from unlinking file', e);
          }

          this.realm.write(() => {
            task.status = DownloadStatus.DONE;
          });
        })
        .catch((error) => {
          console.log(`${task.name}: Download canceled due to error:`, error);

          this.realm.write(() => {
            task.status = DownloadStatus.ERROR;
          });
        });
    });
  }

  static async remove(id: number) {
    await this.statefulPromises[id]?.cancel();
    delete this.statefulPromises[id];

    const task = this.realm.objects<DownloadTask>('Task').find((t) => t.id === id);
    if (task !== undefined) {
      // delete files
      try {
        if (task.imagePath) {
          await fs.unlink(task.imagePath);
        }
      } catch (err) {
        console.log('image unlink failed:', err);
      }
      try {
        console.log('task path:', task.path);
        console.log('task video:', task.video);
        await fs.unlink(task.path);
        await fs.unlink(`${task.path}.download`);
      } catch (err) {
        console.log('video unlink failed:', err);
      }
      for (const sub of task.subtitles) {
        try {
          await fs.unlink(sub.url);
        } catch (err) {
          console.log('sub unlink failed:', err);
        }
      }

      // delete task
      this.realm.beginTransaction();
      this.realm.delete(task.subtitles);
      this.realm.delete(task);
      this.realm.commitTransaction();
    }
  }

  static checkStatus(id: number): TaskStatus {
    return this.task(id)?.status ?? 'DOESNOTEXIST';
  }

  static onChange(cb: () => void) {
    this.realm.addListener('change', cb);
  }

  static removeOnChangeListener(cb: () => void) {
    this.realm.removeListener('change', cb);
  }

  static close() {
    this.realm && !this.realm.isClosed && this.realm.close();
  }

  static renderMenu(
    menuRef: React.RefObject<Menu | undefined>,
    task: DownloadTask,
    element: React.ReactElement,
    t: (term: string) => string,
    navigation: ReturnType<typeof useNavigation>,
  ) {
    return (
      <Menu ref={menuRef as any} style={{backgroundColor: colors.gray}} button={element}>
        {task.status === DownloadStatus.DONE ? (
          <MenuItem
            textStyle={{color: colors.white}}
            underlayColor={colors.blue}
            onPress={() => {
              menuRef.current?.hide();
              navigation.navigate('OfflinePlayer', {task} as OfflinePlayerParams);
            }}>
            {t('play')}
          </MenuItem>
        ) : null}
        {task.status === DownloadStatus.ERROR ? (
          <MenuItem
            textStyle={{color: colors.white}}
            underlayColor={colors.blue}
            onPress={() => {
              menuRef.current?.hide();
              this.download(task);
            }}>
            {t('retry')}
          </MenuItem>
        ) : null}
        <MenuItem
          textStyle={{color: colors.white}}
          underlayColor={colors.red}
          onPress={() => {
            menuRef.current?.hide();
            this.remove(task.id);
          }}>
          {task.status === DownloadStatus.DOWNLOADING ? t('cancel') : t('delete')}
        </MenuItem>
      </Menu>
    );
  }
}
