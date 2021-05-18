import React from 'react';
import { View } from 'react-native';

import WebView from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/core';



export const WebPlayer: React.FC<WebPlayerProps> = () => {
    const navigation = useNavigation();
    const { params } = useRoute();

    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: params?.url }} javaScriptEnabled onMessage={(msg) => {
                if (msg.nativeEvent.data === "exit") {
                    navigation.goBack();
                }
            }} />
        </View>
    );
};
