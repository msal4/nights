import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translations: {
          lang: "عربي",
          results: "Results",
          home: "Home",
          movies: "Movies",
          series: "Series",
          kids: "Kids",
          play: "Play",
          myList: "My List",
          info: "Info",
          continueWatching: "Continue Watching",
          signIn: "Sign in",
          search: "Search",
          recentlyAdded: "Recently Added",
          moreLikeThis: "More Like This",
          episodes: "Episodes",
          pickedForYou: "Picked for You",
          season: "Season",
          episode: "Episode",
          plot: "Plot",
          runtime: "Runtime",
          releaseDate: "Release Date",
          new: "New",
          newEpisodes: "New Episodes",
          logout: "Logout",
          login: "Login",
          username: "Username",
          password: "Password",
          register: "Register",
          email: "Email",
          dontHaveAnAccount: "Don't have an account?",
          haveAnAccount: "Already have an account?",
          trailer: "Trailer",
          filter: "Filter",
          filters: "Filters",
          genres: "Genres",
          all: "All",
          nameAsc: "Name Ascending",
          nameDesc: "Name Descending",
          releaseDateAsc: "Release Date Ascending",
          releaseDateDesc: "Release Date Descending",
          cast: "Cast",
          sort: "Sort",
          type: "Type",
          asc: "Ascending",
          desc: "Descending",
          popularity: "Popularity",
          rating: "Rating",
          back: "Back",
          visitSite: "Visit Site",
          watchNow: "Watch Now",
          contactUsOnFacebook: "Contact Us on Facebook",
          copyright: "Copyright © 2020 1001Nights All rights reserved.",
          downloadYourEssentials: "Download Your Essentials",
          pcSoftwareGames: "PC software, games and more...",
          availableNowOnAllDevices: "Available Now on All Devices",
          enjoyAllYourFavoriteMedia:
            "Enjoy all your favorite media at one place, wherever and whenever you want.",
          signUpNowToEnjoy:
            "Sign Up Now to Enjoy the Full 1001 Nights Experience",
          createAccount: "Create Account",
          loadMore: "Load More",
          seeMore: "See more",
          recommended: "Recommended",
          trending: "Trending",
        },
      },
      ar: {
        translations: {
          lang: "English",
          results: "النتائج",
          home: "الصفحة الرئيسية",
          movies: "الافلام",
          series: "المسلسلات",
          kids: "الاطفال",
          play: "تشغيل",
          myList: "قائمتي",
          info: "معلومات",
          continueWatching: "واصل المشاهدة",
          signIn: "تسجيل الدخول",
          search: "بحث",
          recentlyAdded: "احدث الاضافات",
          moreLikeThis: "المزيد مثل هذا",
          episodes: "الحلقات",
          pickedForYou: "اختيرت من اجلك",
          season: "الموسم",
          episode: "الحلقة",
          plot: "القصة",
          runtime: "الوقت",
          releaseDate: "السنة",
          new: "جديد",
          newEpisodes: "حلقات جديدة",
          logout: "تسجيل الخروج",
          username: "اسم المستخدم",
          password: "الرمز",
          register: "التسجيل",
          login: "تسجيل الدخول",
          email: "البريد الالكتروني",
          dontHaveAnAccount: "ليس لديك حساب؟",
          haveAnAccount: "لديك حساب؟",
          trailer: "اعلان",
          filter: "فرز",
          filters: "فرز",
          genres: "الفئات",
          all: "الكل",
          nameAsc: "الاسم تصاعديا",
          nameDesc: "الاسم تنازليا",
          releaseDateAsc: "تاريخ النشر تصاعديا",
          releaseDateDesc: "تاريخ النشر تنازليا",
          cast: "الممثلون",
          sort: "الترتيب",
          type: "النوع",
          asc: "تصاعدي",
          desc: "تنازلي",
          popularity: "الشهرة",
          rating: "التقييم",
          back: "الرجوع",
          visitSite: "اذهب الى الموقع",
          watchNow: "شاهد الان",
          contactUsOnFacebook: "تواصل معنا على فيسبوك",
          copyright: "جميع الحقوق محفوظة, مجموعة الف ليلة و ليلة © 2020",
          downloadYourEssentials: "حمل اساسياتك",
          pcSoftwareGames: "برامج، العاب و المزيد...",
          availableNowOnAllDevices: "متوفر الان على جميع الاجهزة",
          enjoyAllYourFavoriteMedia:
            "كل وسائلك الترفيهية في مكان واحد، اينما كنت وبأي وقت تريد.",
          signUpNowToEnjoy: "سجل حساب الان وانظم الى عائلة الف ليلة وليلة",
          createAccount: "انشاء حساب",
          loadMore: "المزيد",
          seeMore: "المزيد",
          recommended: "مشابه",
          trending: "الاكثر رواجاً",
        },
      },
    },
    fallbackLng: "ar",
    debug: true,
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      wait: true,
    },
  })
  .then(() => console.log("Translations loaded."));

export default i18n;
