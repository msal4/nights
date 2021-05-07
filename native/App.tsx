import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme, Theme} from '@react-navigation/native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeProvider, Theme as ElementsTheme} from 'react-native-elements';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import OneSignal from 'react-native-onesignal';
import './src/utils/i18n';
import DropDownPicker from 'react-native-dropdown-picker';

import {RootScreen} from './src/screens/Root';
import {colors} from './src/constants/style';
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

const header = () => (
  <DropDownPicker
    items={[
      {label: '720p', value: '720'},
      {label: '480p', value: '480'},
      {label: '360p', value: '360p'},
    ]}
    defaultValue={'720'}
    containerStyle={{height: 40}}
    style={{backgroundColor: colors.blueGray, borderWidth: 0}}
    itemStyle={{
      justifyContent: 'flex-start',
    }}
    dropDownStyle={{backgroundColor: colors.lightBlueGray, borderWidth: 0}}
    labelStyle={{color: colors.white, textAlign: 'center', flex: 1}}
    arrowColor={colors.white}
    zIndex={100}
  />
);

export default () => {
  useEffect(() => {
    try {
      if (!Platform.isTV) {
        changeNavigationBarColor(colors.darkGray, true, true);
      }
    } catch {}

    Downloader.open();
    OneSignal.setAppId('023b88c0-ddf6-45f7-8684-1ddd9b763a37');

    try {
      OneSignal.promptForPushNotificationsWithUserResponse(() => {});
    } catch {}

    return () => {
      Downloader.close();
    };
  }, []);

  const options = {
    headerShown: true,
    headerStyle: {backgroundColor: colors.black},
    headerBackTitle: 'Back',
    headerTitle: '',
    headerTintColor: colors.white,
  };

  return (
    <>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <ThemeProvider theme={elementsTheme}>
        <UrlProvider>
          <AuthProvider>
            <NavigationContainer theme={navigationTheme}>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Root" component={RootScreen} />
                <Stack.Screen
                  name="MoviePlayer"
                  component={MoviePlayerScreen}
                  options={{
                    ...options,
                    headerRight: header,
                  }}
                />
                <Stack.Screen
                  name="SeriesPlayer"
                  component={SeriesPlayerScreen}
                  options={{...options, headerRight: header}}
                />
                <Stack.Screen
                  name="Story"
                  component={StoryScreen}
                  options={{
                    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                    gestureDirection: 'vertical',
                    gestureResponseDistance: {vertical: 200},
                  }}
                />
                <Stack.Screen name="TvPlayer" component={TvPlayerScreen} options={options} />
                <Stack.Screen name="OfflinePlayer" component={OfflinePlayerScreen} options={options} />
              </Stack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </UrlProvider>
      </ThemeProvider>
    </>
  );
};
