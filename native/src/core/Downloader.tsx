import React from 'react';
import Realm from 'realm';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob, {StatefulPromise, FetchBlobResponse} from 'rn-fetch-blob';
import Menu, {MenuItem} from 'react-native-material-menu';
import {colors} from '../constants/style';
import fs from 'react-native-fs';

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
  status: DownloadStatus;
  progress: number;
  subtitles: SubtitleItem[];
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
      title: 'int',
      season: 'int?',
      video: 'string',
      subtitles: 'Subtitle[]',
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

    this.realm.write(() => {
      this.realm.objects<DownloadTask>('Task').forEach((t) => {
        if (t.status === DownloadStatus.DOWNLOADING) {
          t.status = DownloadStatus.ERROR;
        }
      });
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

  static download(params: TaskParams) {
    params.subtitles = params.subtitles?.filter((s) => s);
    const path = `${RNBackgroundDownloader.directories.documents}/media/${params.id}.mp4`;
    const imagePath = `${RNBackgroundDownloader.directories.documents}/images/${params.id}.jpg`;

    let task: DownloadTask;
    this.realm.write(() => {
      task = this.task(params.id)!;

      if (task === undefined) {
        task = this.realm.create<DownloadTask>('Task', {...params, path, image: '', subtitles: []});
      }
      task.status = DownloadStatus.DOWNLOADING;
      task.progress = 0;

      // download image
      if (!task.image.length) {
        RNFetchBlob.config({path: imagePath})
          .fetch('GET', params.image)
          .then((res) => {
            if (task) {
              this.realm.write(() => {
                task.image = res.path() ?? '';
              });
              console.log('got image:', res.path());
            }
          });
      }

      // download subtitles
      if (params.subtitles) {
        for (const sub of params.subtitles) {
          if (sub) {
            RNFetchBlob.config({path: path.replace('.mp4', `.${sub.lang}.vtt`)})
              .fetch('GET', sub.url)
              .then((res) => {
                if (task) {
                  this.realm.write(() => {
                    task.subtitles.push({url: res.path(), lang: sub.lang});
                  });
                  console.log('got subtitle:', res.path());
                }
              });
          }
        }
      }

      const statefulPromise = RNFetchBlob.config({path})
        .fetch('GET', params.video)
        .progress((recieved, total) => {
          const progress = Math.floor((Number(recieved) / Number(total)) * 100);
          console.log(`${task.name}: Downloaded: ${progress}%`);
          if (progress > task.progress) {
            this.realm.write(() => {
              task.size = Number(total);
              task.progress = progress;
            });
          }
        });

      this.statefulPromises[task.id] = statefulPromise;

      statefulPromise
        .then((res) => {
          console.log(`${task.name}: Download is done!`);
          console.log('file saved to:', res.path());
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
        await fs.unlink(task.image);
      } catch {}
      try {
        await fs.unlink(task.video);
      } catch {}
      for (const sub of task.subtitles) {
        try {
          await fs.unlink(sub.url);
        } catch {}
      }

      // delete task
      this.realm.beginTransaction();
      task.subtitles.forEach((s) => {
        try {
          this.realm.delete(s);
        } catch {}
      });
      this.realm.delete(task);
      this.realm.commitTransaction();
    }

    // TODO: DELETE FILES
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
  ) {
    console.log('rendered menu');
    return (
      <Menu ref={menuRef as any} style={{backgroundColor: colors.gray}} button={element}>
        {task.status === DownloadStatus.DONE ? (
          <MenuItem
            textStyle={{color: colors.white}}
            underlayColor={colors.blue}
            onPress={() => {
              menuRef.current?.hide();
              // this.download(task);
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
        {/* {task.status === DownloadStatus.PAUSED || task.status === DownloadStatus.DOWNLOADING ? (
          <MenuItem
            textStyle={{color: colors.white}}
            underlayColor={colors.blue}
            onPress={() => {
              menuRef.current?.hide();
            }}>
            {task.status === DownloadStatus.DOWNLOADING ? t('pause') : t('resume')}
          </MenuItem>
        ) : null} */}
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
