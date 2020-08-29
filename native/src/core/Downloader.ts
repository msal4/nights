import Realm from 'realm';
import RNBackgroundDownloader from 'react-native-background-downloader';

interface TaskParams {
  id: number;
  name: string;
  image: string;
  video: string;
  subtitle?: string;
  size?: number;
  type: 'e' | 'm';
  progress?: number;
  status?: DownloadStatus;
}

export interface DownloadTask extends TaskParams {
  path: string;
  status: DownloadStatus;
  progress: number;
}

export enum DownloadStatus {
  DOWNLOADING = 'DOWNLOADING',
  PAUSED = 'PAUSED',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

type TaskStatus = DownloadStatus | 'DOESNOTEXIST';

class Task {
  static schema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      image: 'string',
      video: 'string',
      subtitle: 'string?',
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

  static async open() {
    this.realm = await Realm.open({
      schema: [Task],
      schemaVersion: 4,
    });

    await this.reatach();
  }

  static tasks() {
    return this.realm.objects<DownloadTask>('Task');
  }

  static task(id: number): DownloadTask | undefined {
    return this.realm.objects<DownloadTask>('Task').find((t) => t.id === id);
  }

  static async reatach() {
    for (const t of await RNBackgroundDownloader.checkForExistingDownloads()) {
      console.log('reataching:', t.id);

      const task = this.task(Number(t.id))!;

      t.progress((percent) => {
        console.log(`${task.name}: Downloaded: ${percent * 100}%`);
        this.realm.write(() => {
          task.progress = percent;
          console.log('updated');
        });
      })
        .done(() => {
          console.log(`${task.name}: Download is done!`);
          this.realm.write(() => {
            task.status = DownloadStatus.DONE;
          });
        })
        .error((error) => {
          console.log(`${task.name}: Download canceled due to error:`, error);
          this.realm.write(() => {
            task.status = DownloadStatus.ERROR;
          });
        });
    }
  }

  static async pauseAll() {
    for (const t of await RNBackgroundDownloader.checkForExistingDownloads()) {
      const task = this.task(Number(t.id))!;
      t.pause();
      this.realm.write(() => {
        task.status = DownloadStatus.PAUSED;
      });
    }
  }

  static download(params: TaskParams) {
    const path = `${RNBackgroundDownloader.directories.documents}/media/${params.type}/${params.id}.mp4`;

    let task: DownloadTask;
    this.realm.write(() => {
      task = this.task(params.id)!;

      if (task === undefined) {
        task = this.realm.create<DownloadTask>('Task', {...params, path});
      }
    });

    RNBackgroundDownloader.download({
      id: params.id.toString(),
      url: params.video,
      destination: path,
    })
      .begin((expectedBytes) => {
        console.log(`${task.name}: Going to download ${expectedBytes} bytes!`);
        this.realm.write(() => {
          task.size = expectedBytes;
          task.status = DownloadStatus.DOWNLOADING;
        });
      })
      .progress((percent) => {
        console.log(`${task.name}: Downloaded: ${percent * 100}%`);
        this.realm.write(() => {
          task.progress = percent;
        });
      })
      .done(() => {
        console.log(`${task.name}: Download is done!`);
        this.realm.write(() => {
          task.status = DownloadStatus.DONE;
        });
      })
      .error((error) => {
        console.log(`${task.name}: Download canceled due to error:`, error);

        this.realm.write(() => {
          task.status = DownloadStatus.ERROR;
        });
      });
  }

  static async remove(id: number) {
    const tasks = await RNBackgroundDownloader.checkForExistingDownloads();
    const rnbdTask = tasks.find((t) => t.id === id.toString());
    rnbdTask?.stop();

    const task = this.realm.objects<DownloadTask>('Task').find((t) => t.id === id);
    if (task !== undefined) {
      this.realm.beginTransaction();
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
}
