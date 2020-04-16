import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      translations: {
        home: 'Home',
        movies: 'Movies',
        series: 'Series',
        kids: 'Kids',
        play: 'Play',
        myList: 'My List',
        info: 'Info',
        continueWatching: 'Continue Watching',
      },
    },
    ar: {
      translations: {
        home: 'الصفحة الرئيسية',
        movies: 'الافلام',
        series: 'المسلسلات',
        kids: 'الاطفال',
        play: 'تشغيل',
        myList: 'قائمتي',
        info: 'معلومات',
        continueWatching: 'واصل المشاهدة',
      },
    },
  },
  fallbackLng: 'en',
  debug: true,
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
}).then(() => console.log('Translations loaded.'))

export default i18n
