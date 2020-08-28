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
}

enum DownloadStatus {
  DOWNLOADING = 'DOWNLOADING',
  PAUSED = 'PAUSED',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

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

    await this.resumeAll();
  }

  static tasks() {
    return this.realm.objects<DownloadTask>('Task');
  }

  static async resumeAll() {
    for (const t of await RNBackgroundDownloader.checkForExistingDownloads()) {
      console.log('reigniting', t.id);

      const task = this.realm.objects<DownloadTask>('Task').find((to) => to.id.toString() === t.id)!;

      t.begin((expectedBytes) => {
        this.realm.write(() => {
          task.size = expectedBytes;
          task.status = DownloadStatus.DOWNLOADING;
        });
        console.log(`${task.name}: Going to download ${expectedBytes} bytes!`);
      })
        .progress((percent) => {
          this.realm.write(() => {
            task.progress = percent;
            console.log('updated');
          });
          console.log(`${task.name}: Downloaded: ${percent * 100}%`);
        })
        .done(() => {
          this.realm.write(() => {
            task.status = DownloadStatus.DONE;
          });
          console.log(`${task.name}: Download is done!`);
        })
        .error((error) => {
          this.realm.write(() => {
            task.status = DownloadStatus.ERROR;
          });
          console.log(`${task.name}: Download canceled due to error:`, error);
        });
    }
  }

  static async pauseAll() {
    for (const t of await RNBackgroundDownloader.checkForExistingDownloads()) {
      const task = this.realm.objects<DownloadTask>('Task').find((to) => to.id.toString() === t.id)!;
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
      task = this.realm.objects<DownloadTask>('Task').find((t) => t.id === params.id) as DownloadTask;

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
        this.realm.write(() => {
          task.size = expectedBytes;
          task.status = DownloadStatus.DOWNLOADING;
        });
        console.log(`${task.name}: Going to download ${expectedBytes} bytes!`);
      })
      .progress((percent) => {
        this.realm.write(() => {
          task.progress = percent;
        });
        console.log(`${task.name}: Downloaded: ${percent * 100}%`);
      })
      .done(() => {
        this.realm.write(() => {
          task.status = DownloadStatus.DONE;
        });
        console.log(`${task.name}: Download is done!`);
      })
      .error((error) => {
        this.realm.write(() => {
          task.status = DownloadStatus.ERROR;
        });
        console.log(`${task.name}: Download canceled due to error:`, error);
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
  }

  static close() {
    this.realm && !this.realm.isClosed && this.realm.close();
  }
}
