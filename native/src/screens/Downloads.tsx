import React, {useEffect, useState, useRef} from 'react';
import Realm from 'realm';
import {View, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import {Text, Icon} from 'react-native-elements';
import Menu from 'react-native-material-menu';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {DownloadTask, Downloader, DownloadStatus} from '../core/Downloader';
import {colors} from '../constants/style';
import {capitalizeFirst} from '../utils/common';

import {DetailScreen} from './Detail';
import {defaultStackOptions} from '../utils/defaultStackOptions';
import {useUrl} from '../context/url-context';
import {useTranslation} from 'react-i18next';

const Stack = createStackNavigator();

export const DownloadsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {isPrivate, online} = useUrl();

  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultStackOptions,
        headerStyle: {backgroundColor: colors.black},
        headerTintColor: colors.white,
      }}>
      <Stack.Screen
        name="Downloads"
        component={Downloads}
        options={{title: isPrivate && online ? t('downloads') : t('myList')}}
      />
      <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export const Downloads: React.FC = () => {
  const [tasks, setTasks] = useState<Realm.Results<DownloadTask & Realm.Object>>();

  useEffect(() => {
    const listener = () => {
      setTasks(Downloader.tasks());
    };

    listener();

    Downloader.onChange(listener);

    return () => {
      Downloader.removeOnChangeListener(listener);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      <TouchableOpacity
        onPress={() => {
          Downloader.listFiles();
        }}>
        <Text>Show me files</Text>
      </TouchableOpacity>
      {tasks?.map((t) => (
        <TaskCard key={t.id} task={t} />
      ))}
    </ScrollView>
  );
};

export const TaskCard: React.FC<{task: DownloadTask}> = ({task}) => {
  const size = ((task.size ?? 0) / 1000000000).toFixed(1);
  const menuRef = useRef<Menu>();
  const {t} = useTranslation();
  const image = task.imagePath || task.image;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}
      onPress={() => {
        navigation.navigate('Detail', {id: task.title});
      }}
      onLongPress={() => {
        menuRef.current?.show();
      }}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('OfflinePlayer', {task});
        }}>
        <ImageBackground
          source={{uri: image.startsWith('/') ? `file://${image}` : image}}
          style={{alignItems: 'center', justifyContent: 'center', width: 170, height: 100, marginRight: 15}}>
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
        </ImageBackground>
      </TouchableOpacity>
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
            navigation,
          )}
        </View>
        {task.status === DownloadStatus.DOWNLOADING ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: colors.gray,
                borderRadius: 20,
                overflow: 'hidden',
                height: 5,
                flex: 1,
              }}>
              <View style={{height: '100%', backgroundColor: colors.blue, width: `${task.progress}%`}} />
            </View>
            {task.status === DownloadStatus.DOWNLOADING ? (
              <Text style={{marginLeft: 5, fontSize: 12, color: colors.blue}}>{task.progress}%</Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
