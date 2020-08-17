/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer, ThemeProvider} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {RootScreen} from './src/screens/Root';
import {DetailsScreen} from './src/screens/Details';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider value={{dark: true}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Root" component={RootScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
