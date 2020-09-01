import React, {useEffect, useState, useRef} from 'react';
import Realm from 'realm';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {Text, Image, Icon} from 'react-native-elements';
import Menu from 'react-native-material-menu';

import {DownloadTask, Downloader, DownloadStatus} from '../core/Downloader';

import {colors} from '../constants/style';
import {capitalizeFirst} from '../utils/common';
import {useLanguage} from '../utils/lang';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailScreen} from './Detail';

export const Downloads: React.FC = () => {
  const [tasks, setTasks] = useState<Realm.Results<DownloadTask & Realm.Object>>();

  useEffect(() => {
    setTasks(Downloader.tasks());
    Downloader.onChange(() => {
      setTasks(Downloader.tasks());
    });
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={{padding: 20}}>
        {tasks?.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </ScrollView>
    </>
  );
};
const Stack = createStackNavigator();

export const DownloadsScreen: React.FC = () => {
  const {t} = useLanguage();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.black},
        headerTintColor: colors.white,
      }}>
      <Stack.Screen name="Downloads" component={Downloads} options={{title: t('downloads')}} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export const TaskCard: React.FC<{task: DownloadTask}> = ({task}) => {
  const size = ((task.size ?? 0) / 1000000000).toFixed(1);
  const menuRef = useRef<Menu>();
  const {t} = useLanguage();
  const navigation = useNavigation();
  console.log(task.image);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}
      onPress={() => {
        if (task.type === 'm') {
          navigation.navigate('Detail', task);
        }
      }}
      onLongPress={() => {
        menuRef.current?.show();
      }}>
      <Image source={{uri: task.image}} style={{width: 170, height: 100, marginRight: 15}} />
      <View style={{flex: 1}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 15, flexWrap: 'wrap', fontWeight: 'bold'}}>{task.name}</Text>
            <Text style={{color: colors.lightGray, marginTop: 5, fontSize: 12}}>{size}GB</Text>
            <Text
              style={{
                color: task.status === DownloadStatus.ERROR ? colors.red : colors.blue,
                marginTop: 5,
                fontSize: 12,
              }}>
              {capitalizeFirst(task.status.toLowerCase())}
            </Text>
          </View>
          {Downloader.renderMenu(
            menuRef,
            task,
            <Icon
              onPress={() => {
                menuRef.current?.show();
              }}
              type="ionicon"
              name="ellipsis-vertical-sharp"
              color={colors.lightGray}
            />,
            t,
          )}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{backgroundColor: colors.gray, borderRadius: 20, overflow: 'hidden', height: 5, flex: 1}}>
            <View style={{height: '100%', backgroundColor: colors.red, width: `${task.progress}%`}} />
          </View>
          {task.status === DownloadStatus.DOWNLOADING ? (
            <Text style={{marginLeft: 5, fontSize: 12, color: colors.blue}}>{task.progress}%</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};
