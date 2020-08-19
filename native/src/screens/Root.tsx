import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from './Home';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../constants/style';

const Tab = createBottomTabNavigator();

function tabBarIcon(name: string, {color, size, focused}: {focused: boolean; color: string; size: number}) {
  return <Icon name={name + (focused ? '' : '-outline')} size={size} color={color} />;
}

export const RootScreen: React.FC = () => {
  return (
    <Tab.Navigator tabBarOptions={{style: {backgroundColor: colors.gray}}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarIcon: (props) => tabBarIcon('home', props)}}
      />
      <Tab.Screen
        name="Search"
        component={HomeScreen}
        options={{tabBarIcon: (props) => tabBarIcon('search', props)}}
      />
      <Tab.Screen
        name="TV"
        component={HomeScreen}
        options={{tabBarIcon: (props) => tabBarIcon('tv', props)}}
      />
      <Tab.Screen
        name="Downloads"
        component={HomeScreen}
        options={{tabBarIcon: (props) => tabBarIcon('download', props)}}
      />
      <Tab.Screen
        name="More"
        component={HomeScreen}
        options={{tabBarIcon: (props) => tabBarIcon('menu', props)}}
      />
    </Tab.Navigator>
  );
};
