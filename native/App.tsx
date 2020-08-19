/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme, Theme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RootScreen} from './src/screens/Root';
import {colors} from './src/constants/style';
import {ThemeProvider, Theme as ElementsTheme} from 'react-native-elements';

Ionicons.loadFont();

const Stack = createStackNavigator();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.black,
    primary: colors.red,
  },
};

const elementsTheme: ElementsTheme = {
  Text: {
    style: {
      color: colors.white,
    },
  },
};

export default () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <ThemeProvider theme={elementsTheme}>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Root" component={RootScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
};
