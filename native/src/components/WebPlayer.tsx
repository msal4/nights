import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';

import WebView from 'react-native-webview';
import Orientation from 'react-native-orientation';
import {useNavigation, useRoute} from '@react-navigation/core';
import {hideNavigationBar, showNavigationBar} from 'react-native-navigation-bar-color';

export const WebPlayer: React.FC = () => {
  const navigation = useNavigation();
  const {params} = useRoute() as any;

  useEffect(() => {
    Orientation.lockToLandscape();
    hideNavigationBar();

    return () => {
      Orientation.lockToPortrait();
      showNavigationBar();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar hidden />
      <WebView
        source={{uri: params?.url}}
        javaScriptEnabled
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        onMessage={(msg) => {
          if (msg.nativeEvent.data === 'exit') {
            navigation.goBack();
          }
        }}
      />
    </SafeAreaView>
  );
};
