import React from 'react';
import {ListItem, Text} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';

import {useAuth} from '../context/auth-context';
import {MyListScreen} from './MyList';
import {DetailScreen} from './Detail';
import {defaultStackOptions} from '../utils/defaultStackOptions';
import {LoginScreen} from './Login';
import {colors} from '../constants/style';
import {useLanguage} from '../utils/lang';

const Stack = createStackNavigator();

export const MoreScreen: React.FC = () => {
  const {t} = useLanguage();

  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultStackOptions,
        headerStyle: {backgroundColor: colors.black},
        headerTintColor: colors.white,
      }}>
      <Stack.Screen name="More" component={More} options={{title: t('more')}} />
      <Stack.Screen name="Login" component={LoginScreen} options={{title: t('login')}} />
      <Stack.Screen name="MyList" component={MyListScreen} options={{title: t('myList')}} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

const More: React.FC = () => {
  const navigation = useNavigation();
  const {t, toggleLang} = useLanguage();
  const {token, logout} = useAuth();

  return (
    <ScrollView contentContainerStyle={{marginTop: 10}}>
      <ListItem
        title={token ? t('logout') : t('login')}
        containerStyle={{backgroundColor: '#00000000'}}
        leftIcon={{name: 'person' + (!token ? '-outline' : ''), type: 'ionicon', color: colors.white}}
        rightIcon={{
          name: token ? 'exit-outline' : 'chevron-forward-sharp',
          type: 'ionicon',
          color: colors.lightGray,
        }}
        bottomDivider
        children={{}}
        onPress={() => {
          if (token) {
            return logout();
          }
          navigation.navigate('Login');
        }}
      />
      <ListItem
        title={t('language')}
        containerStyle={{backgroundColor: '#00000000'}}
        leftIcon={{name: 'language-outline', type: 'ionicon', color: colors.white}}
        rightElement={<Text style={{fontWeight: 'bold'}}>{t('lang')}</Text>}
        bottomDivider
        onPress={toggleLang}
        children={{}}
      />
      <ListItem
        title={t('myList')}
        containerStyle={{backgroundColor: '#00000000'}}
        leftIcon={{name: 'add', type: 'ionicon', color: colors.white}}
        rightIcon={{name: 'chevron-forward-sharp', type: 'ionicon', color: colors.lightGray}}
        bottomDivider
        // chevron
        children={{}}
        onPress={() => {
          navigation.navigate('MyList');
        }}
      />
      <ListItem
        title={t('contactUsOnFacebook')}
        containerStyle={{backgroundColor: '#00000000'}}
        leftIcon={{name: 'logo-facebook', type: 'ionicon', color: colors.white}}
        rightIcon={{name: 'chevron-forward-sharp', type: 'ionicon', color: colors.lightGray}}
        bottomDivider
        // chevron
        children={{}}
        onPress={() => {
          Linking.openURL('https://www.facebook.com/1001nights.fun/');
        }}
      />
    </ScrollView>
  );
};
