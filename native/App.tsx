import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme, Theme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';
import {ThemeProvider, Theme as ElementsTheme} from 'react-native-elements';

import {RootScreen} from './src/screens/Root';
import {colors} from './src/constants/style';
import {LanguageProvider} from './src/utils/lang';
import {AuthProvider} from './src/context/auth-context';
import {Downloader} from './src/core/Downloader';
import {OfflinePlayerScreen} from './src/screens/OfflinePlayer';
import {MoviePlayerScreen} from './src/screens/MoviePlayer';
import {SeriesPlayerScreen} from './src/screens/SeriesPlayer';
import {TvPlayerScreen} from './src/screens/TvPlayer';

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
    Downloader.open();

    return () => {
      Downloader.close();
    };
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
                  name="MoviePlayer"
                  component={MoviePlayerScreen}
                  options={{gestureResponseDistance: {horizontal: 10}}}
                />
                <Stack.Screen
                  name="SeriesPlayer"
                  component={SeriesPlayerScreen}
                  options={{gestureResponseDistance: {horizontal: 10}}}
                />
                <Stack.Screen
                  name="TvPlayer"
                  component={TvPlayerScreen}
                  options={{gestureResponseDistance: {horizontal: 10}}}
                />
                <Stack.Screen
                  name="OfflinePlayer"
                  component={OfflinePlayerScreen}
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
