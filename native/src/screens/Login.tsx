import React, {useState} from 'react';
import {Input, Button, Text} from 'react-native-elements';
import {useLanguage} from '../utils/lang';
import {colors} from '../constants/style';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useAuth} from '../context/auth-context';
import {useNavigation} from '@react-navigation/native';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const {login, register} = useAuth();
  const {t} = useLanguage();
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{marginTop: 20, padding: 10}}>
      <Input
        value={username}
        disabled={loading}
        autoCapitalize="none"
        textContentType="username"
        inputStyle={{color: colors.white}}
        leftIcon={{type: 'ionicon', name: 'person-outline', color: colors.white}}
        placeholder={t('username')}
        leftIconContainerStyle={{marginRight: 10}}
        placeholderTextColor={colors.lightGray}
        onChangeText={setUsername}
      />
      <Input
        value={password}
        disabled={loading}
        textContentType="password"
        secureTextEntry
        inputStyle={{color: colors.white}}
        leftIcon={{type: 'ionicon', name: 'md-lock-closed-outline', color: colors.white}}
        placeholder={t('password')}
        leftIconContainerStyle={{marginRight: 10}}
        placeholderTextColor={colors.lightGray}
        onChangeText={setPassword}
      />
      <Button
        title={isNew ? t('register') : t('login')}
        disabled={loading}
        onPress={async () => {
          setLoading(true);
          try {
            if (isNew) {
              await register(username, password);
            } else {
              await login(username, password);
            }
            navigation.navigate('More');
          } catch (err) {
            console.log(err);
          } finally {
            setLoading(false);
          }
        }}
      />
      <TouchableOpacity
        style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
        onPress={() => setIsNew(!isNew)}>
        <Text style={{fontSize: 18, textAlign: 'center'}}>
          {isNew ? t('haveAnAccount') + ' ' + t('login') : t('dontHaveAnAccount') + ' ' + t('register')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
