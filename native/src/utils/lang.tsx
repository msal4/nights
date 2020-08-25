import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import {trans} from './trans';

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
      language && setLang(language as any);
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
