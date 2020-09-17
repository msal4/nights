import AsyncStorage from '@react-native-community/async-storage';
class AuthToken {
  static tokenKey = 'auth_token';
  static token: string | null = null;

  static get = async () => {
    if (AuthToken.token) {
      return AuthToken.token;
    }
    AuthToken.token = await AsyncStorage.getItem(AuthToken.tokenKey);
    return AuthToken.token;
  };

  static store = async (token: string) => {
    AuthToken.token = token;
    await AsyncStorage.setItem(AuthToken.tokenKey, token);
  };

  static remove = async () => {
    AuthToken.token = null;
    await AsyncStorage.removeItem(AuthToken.tokenKey);
  };
}

export default AuthToken;
