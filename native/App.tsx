import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme, Theme} from '@react-navigation/native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeProvider, Theme as ElementsTheme} from 'react-native-elements';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import SplashScreen from 'react-native-splash-screen';
import OneSignal from 'react-native-onesignal';

import {RootScreen} from './src/screens/Root';
import {colors} from './src/constants/style';
import {LanguageProvider} from './src/utils/lang';
import {AuthProvider} from './src/context/auth-context';
import {Downloader} from './src/core/Downloader';
import {OfflinePlayerScreen} from './src/screens/OfflinePlayer';
import {MoviePlayerScreen} from './src/screens/MoviePlayer';
import {SeriesPlayerScreen} from './src/screens/SeriesPlayer';
import {TvPlayerScreen} from './src/screens/TvPlayer';
import {UrlProvider} from './src/context/url-context';
import {StoryScreen} from './src/screens/Story';

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
    changeNavigationBarColor(colors.darkGray, true, true);
    SplashScreen.hide();
    Downloader.open();

    OneSignal.init('023b88c0-ddf6-45f7-8684-1ddd9b763a37', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });

    return () => {
      Downloader.close();
    };
  }, []);

  const options =
    Platform.OS === 'ios'
      ? {
          headerShown: true,
          headerStyle: {backgroundColor: colors.black},
          headerBackTitle: 'Back',
          headerTitle: '',
          headerTintColor: colors.white,
        }
      : {};

  return (
    <>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <ThemeProvider theme={elementsTheme}>
        <UrlProvider>
          <AuthProvider>
            <LanguageProvider>
              <NavigationContainer theme={navigationTheme}>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                  <Stack.Screen name="Root" component={RootScreen} />
                  <Stack.Screen name="MoviePlayer" component={MoviePlayerScreen} options={options} />
                  <Stack.Screen name="SeriesPlayer" component={SeriesPlayerScreen} options={options} />
                  <Stack.Screen
                    name="Story"
                    component={StoryScreen}
                    options={{
                      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                      gestureDirection: 'vertical',
                      gestureResponseDistance: {vertical: 100},
                    }}
                  />
                  <Stack.Screen name="TvPlayer" component={TvPlayerScreen} options={options} />
                  <Stack.Screen name="OfflinePlayer" component={OfflinePlayerScreen} options={options} />
                </Stack.Navigator>
              </NavigationContainer>
            </LanguageProvider>
          </AuthProvider>
        </UrlProvider>
      </ThemeProvider>
    </>
  );
};
