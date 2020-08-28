import React, {useEffect, useState} from 'react';
import Realm from 'realm';

import {DownloadTask, Downloader, DownloadStatus} from '../core/Downloader';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {Text, Image, Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../constants/style';
import {capitalizeFirst} from '../utils/common';

export const DownloadsScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Realm.Results<DownloadTask & Realm.Object>>();

  useEffect(() => {
    setTasks(Downloader.tasks());
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <ScrollView contentContainerStyle={{padding: 20}}>
        {tasks?.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export const TaskCard: React.FC<{task: DownloadTask}> = ({task}) => {
  const size = ((task.size ?? 0) / 1000000000).toFixed(1);

  return (
    <TouchableOpacity style={{marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}>
      <Image source={{uri: task.image}} style={{width: 170, height: 100, marginRight: 15}} />
      <View style={{flex: 1}}>
        <Text style={{fontSize: 15, flexWrap: 'wrap', fontWeight: 'bold'}}>{task.name}</Text>
        <Text style={{color: colors.lightGray, marginTop: 5}}>{size}GB</Text>
        <Text style={{color: task.status === DownloadStatus.ERROR ? colors.red : colors.blue, marginTop: 5}}>
          {capitalizeFirst(task.status.toLowerCase())}
        </Text>
      </View>
      <Icon type="ionicon" name="pause-outline" color={colors.blue} />
    </TouchableOpacity>
  );
};
