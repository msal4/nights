import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import {HomeScreen} from './Home';
import {colors} from '../constants/style';
import {SearchScreen} from './Search';
import {TVScreen} from './TV';
import {MoreScreen} from './More';
import {DownloadsScreen} from './Downloads';
import {useUrl} from '../context/url-context';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator();

function tabBarIcon(name: string, {color, size, focused}: {focused: boolean; color: string; size: number}) {
  return <Icon name={name + (focused ? '' : '-outline')} size={size} color={color} />;
}

export const RootScreen: React.FC = () => {
  const {t} = useTranslation();
  const {isPrivate} = useUrl();

  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: {fontSize: 8},
        style: {backgroundColor: colors.darkGray, borderTopWidth: 0},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarIcon: (props) => tabBarIcon('home', props), title: t('home')}}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{tabBarIcon: (props) => tabBarIcon('search', props), title: t('search')}}
      />
      {isPrivate ? (
        <Tab.Screen
          name="TV"
          component={TVScreen}
          options={{tabBarIcon: (props) => tabBarIcon('tv', props), title: t('tv')}}
        />
      ) : null}
      <Tab.Screen
        name={isPrivate ? 'Downloads' : 'MyList'}
        component={DownloadsScreen}
        options={{
          tabBarIcon: (props) => tabBarIcon(isPrivate ? 'download' : 'add', props),
          title: isPrivate ? t('downloads') : t('myList'),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{tabBarIcon: (props) => tabBarIcon('menu', props), title: t('more')}}
      />
    </Tab.Navigator>
  );
};
