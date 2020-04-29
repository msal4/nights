import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"

i18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translations: {
          lang: "عربي",
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
          username: "Username",
          password: "Password",
          register: "Register",
        },
      },
      ar: {
        translations: {
          lang: "English",
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
        },
      },
    },
    fallbackLng: "en",
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
  .then(() => console.log("Translations loaded."))

export default i18n
