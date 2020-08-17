import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export const DetailsScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details World</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
};
