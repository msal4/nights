import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import i18nextReactNative from 'i18next-react-native-language-detector';

i18n
  .use(i18nextReactNative)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          lang: 'English',
          stories: 'Stories',
          retry: 'Retry',
          delete: 'Delete',
          cancel: 'Cancel',
          pause: 'Resume',
          resume: 'Pause',
          results: 'Results',
          home: 'Home',
          tv: 'TV',
          movies: 'Movies',
          series: 'Series',
          kids: 'Kids',
          play: 'Play',
          refreshing: 'Refreshing',
          myList: 'My List',
          info: 'Info',
          continueWatching: 'Continue Watching',
          signIn: 'Sign in',
          search: 'Search',
          recentlyAdded: 'Recently Added',
          moreLikeThis: 'More Like This',
          comingSoon: 'Coming Soon',
          episodes: 'Episodes',
          pickedForYou: 'Picked for You',
          season: 'Season',
          episode: 'Episode',
          plot: 'Plot',
          runtime: 'Runtime',
          releaseDate: 'Release Date',
          new: 'New',
          newEpisodes: 'New Episodes',
          logout: 'Logout',
          login: 'Login',
          username: 'Username',
          password: 'Password',
          register: 'Register',
          email: 'Email',
          dontHaveAnAccount: "Don't have an account?",
          haveAnAccount: 'Already have an account?',
          trailer: 'Trailer',
          filter: 'Filter',
          filters: 'Filters',
          genres: 'Genres',
          all: 'All',
          nameAsc: 'Name Ascending',
          nameDesc: 'Name Descending',
          releaseDateAsc: 'Release Date Ascending',
          releaseDateDesc: 'Release Date Descending',
          cast: 'Cast',
          sort: 'Sort',
          type: 'Type',
          asc: 'Ascending',
          desc: 'Descending',
          popularity: 'Popularity',
          rating: 'Rating',
          back: 'Back',
          visitSite: 'Visit Site',
          watchNow: 'Watch Now',
          contactUsOnFacebook: 'Contact Us on Facebook',
          copyright: 'Copyright © 2020 1001Nights All rights reserved.',
          downloadYourEssentials: 'Download Your Essentials',
          pcSoftwareGames: 'PC software, games and more...',
          availableNowOnAllDevices: 'Available Now on All Devices',
          enjoyAllYourFavoriteMedia:
            'Enjoy all your favorite media at one place, wherever and whenever you want.',
          signUpNowToEnjoy: 'Sign Up Now to Enjoy the Full 1001 Nights Experience',
          createAccount: 'Create Account',
          loadMore: 'Load More',
          seeMore: 'See more',
          recommended: 'Recommended',
          trending: 'Trending',
          downloads: 'Downloads',
          more: 'More',
          seasons: 'Seasons',
          similar: 'Similar',
          settings: 'Settings',
          language: 'Language',
          year: 'Year',
          seeOnImdb: 'See on IMDB',
          schedule: 'Schedule',
          news: 'News',
        },
      },
      ar: {
        translation: {
          seeOnImdb: 'اذهب الى IMDB',
          stories: 'قصص',
          lang: 'عربي',
          retry: 'اعادة المحاولة',
          delete: 'حذف',
          cancel: 'الغاء',
          pause: 'ايقاف مؤقت',
          resume: 'استئناف',
          tv: 'التلفاز',
          results: 'النتائج',
          home: 'الرئيسية',
          movies: 'الافلام',
          series: 'المسلسلات',
          refreshing: 'جاري اعادة التحميل',
          comingSoon: 'قريباً',
          kids: 'الاطفال',
          play: 'تشغيل',
          year: 'السنة',
          myList: 'قائمتي',
          info: 'معلومات',
          continueWatching: 'واصل المشاهدة',
          signIn: 'تسجيل الدخول',
          search: 'بحث',
          recentlyAdded: 'احدث الاضافات',
          moreLikeThis: 'المزيد مثل هذا',
          episodes: 'الحلقات',
          pickedForYou: 'اختيرت من اجلك',
          season: 'الموسم',
          seasons: 'مواسم',
          episode: 'الحلقة',
          plot: 'القصة',
          runtime: 'الوقت',
          releaseDate: 'السنة',
          new: 'جديد',
          newEpisodes: 'حلقات جديدة',
          logout: 'تسجيل الخروج',
          username: 'اسم المستخدم',
          password: 'الرمز',
          register: 'التسجيل',
          login: 'تسجيل الدخول',
          email: 'البريد الالكتروني',
          dontHaveAnAccount: 'ليس لديك حساب؟',
          haveAnAccount: 'لديك حساب؟',
          trailer: 'الاعلان',
          filter: 'فرز',
          filters: 'فرز',
          genres: 'الفئات',
          all: 'الكل',
          nameAsc: 'الاسم تصاعديا',
          nameDesc: 'الاسم تنازليا',
          releaseDateAsc: 'تاريخ النشر تصاعديا',
          releaseDateDesc: 'تاريخ النشر تنازليا',
          cast: 'الممثلون',
          sort: 'الترتيب',
          type: 'النوع',
          asc: 'تصاعدي',
          desc: 'تنازلي',
          popularity: 'الشهرة',
          rating: 'التقييم',
          back: 'الرجوع',
          visitSite: 'اذهب الى الموقع',
          watchNow: 'شاهد الان',
          contactUsOnFacebook: 'تواصل معنا على فيسبوك',
          copyright: 'جميع الحقوق محفوظة, مجموعة الف ليلة و ليلة © 2020',
          downloadYourEssentials: 'حمل اساسياتك',
          pcSoftwareGames: 'برامج، العاب و المزيد...',
          availableNowOnAllDevices: 'متوفر الان على جميع الاجهزة',
          enjoyAllYourFavoriteMedia: 'كل وسائلك الترفيهية في مكان واحد، اينما كنت وبأي وقت تريد.',
          signUpNowToEnjoy: 'سجل حساب الان وانظم الى عائلة الف ليلة وليلة',
          createAccount: 'انشاء حساب',
          loadMore: 'المزيد',
          seeMore: 'المزيد',
          more: 'المزيد',
          recommended: 'مشابه',
          trending: 'الاكثر رواجاً',
          downloads: 'التنزيلات',
          similar: 'مشابه',
          settings: 'الاعدادات',
          language: 'اللغة',
          schedule: 'الجدول',
          news: 'الاخبار',
        },
      },
    },
    lng: 'ar',
    fallbackLng: 'ar',

    interpolation: {
      escapeValue: false,
    },
  });
