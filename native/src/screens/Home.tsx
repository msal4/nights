import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';

import {HomePromo} from '../components/HomePromo';

export const HomeScreen: React.FC = () => {
  return (
    <View>
      <HomePromo />
      <Text>Boy</Text>
    </View>
  );
};
