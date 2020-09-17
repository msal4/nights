import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import {trans} from './trans';
import {NativeModules, Platform} from 'react-native';

const LanguageContext = React.createContext({
  lang: 'ar',
  toggleLang: () => null,
  t: (term: string): string => {
    console.log('no implemented');
    return term;
  },
});

export const LanguageProvider = (props: any) => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const key = 'lang';

  useEffect(() => {
    (async () => {
      const language = await AsyncStorage.getItem(key);
      if (language) {
        language && setLang(language as any);
      } else {
        let locale = '';
        if (Platform.OS === 'ios') {
          locale =
            NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0];
        } else if (Platform.OS === 'android') {
          locale = NativeModules.I18nManager.localeIdentifier;
        }
        if (!locale.startsWith('ar')) {
          await AsyncStorage.setItem(key, 'en');
          setLang('en');
        }
      }
    })();
  }, []);

  const toggleLang = async () => {
    const language = lang === 'ar' ? 'en' : 'ar';
    setLang(language);
    await AsyncStorage.setItem(key, language);
  };

  const t = (term: string) => (trans as any)[lang][term] || term;

  return <LanguageContext.Provider value={{lang, toggleLang, t}} {...props} />;
};

export const useLanguage = () => React.useContext(LanguageContext);
