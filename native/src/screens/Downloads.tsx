import React, {useEffect, useState} from 'react';
import Realm from 'realm';

import {DownloadTask, Downloader} from '../core/Downloader';
import {ScrollView} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';

export const DownloadsScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Realm.Results<DownloadTask & Realm.Object>>();

  useEffect(() => {
    setTasks(Downloader.tasks());
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {tasks?.map((t) => (
          <View key={t.id}>
            <Text>{t.name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
