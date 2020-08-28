import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme, Theme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation';
import {ThemeProvider, Theme as ElementsTheme} from 'react-native-elements';

import {RootScreen} from './src/screens/Root';
import {colors} from './src/constants/style';
import {LanguageProvider} from './src/utils/lang';
import {AuthProvider} from './src/context/auth-context';
import {PlayerScreen} from './src/screens/Player';
import {Downloader} from './src/core/Downloader';

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
  useEffect(() => {
    Orientation.lockToPortrait();
    Downloader.open().then(() => {
      const tasks = Downloader.tasks();
      for (const task of tasks) {
        console.log(task.id, task.name);
      }
      // Downloader.download({id: 1, name: 'Hello', image: 'mi image', size: 199, type: 'm'});
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ThemeProvider theme={elementsTheme}>
        <AuthProvider>
          <LanguageProvider>
            <NavigationContainer theme={navigationTheme}>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Root" component={RootScreen} />
                <Stack.Screen
                  name="Player"
                  component={PlayerScreen}
                  options={{gestureResponseDistance: {horizontal: 10}}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
};
