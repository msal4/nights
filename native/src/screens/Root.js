import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';

import {HomeScreen} from './Home';
import {colors} from '../constants';

const Tab = createBottomTabNavigator();

const createIcon = (props) => (
  <Icon {...props} color={props.focused ? colors.white : props.color} />
);

export const RootScreen = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.white,
        style: {backgroundColor: colors.gray},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => createIcon({...props, name: 'home'}),
        }}
      />
      <Tab.Screen
        name="Search"
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => createIcon({...props, name: 'search'}),
        }}
      />
      <Tab.Screen
        name="TV"
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => createIcon({...props, name: 'tv'}),
        }}
      />
      <Tab.Screen
        name="Downloads"
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => createIcon({...props, name: 'file-download'}),
        }}
      />
      <Tab.Screen
        name="More"
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => createIcon({...props, name: 'menu'}),
        }}
      />
    </Tab.Navigator>
  );
};
