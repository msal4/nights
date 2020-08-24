import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme, Theme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RootScreen} from './src/screens/Root';
import {colors} from './src/constants/style';
import {ThemeProvider, Theme as ElementsTheme} from 'react-native-elements';
import {LanguageProvider} from './src/utils/lang';

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
  colors: {
    primary: colors.red,
  },
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
        <LanguageProvider>
          <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name="Root" component={RootScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
};
