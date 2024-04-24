import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import enTranslation from "../locales/en.json";
import trTranslation from "../locales/tr.json";
import {localStorage} from "./LocalStorage";

i18n.use(initReactI18next).init({
  resources: {
    en: {translation: enTranslation},
    tr: {translation: trTranslation},
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
}).then();

localStorage.load({key: 'language'}).then((language) => {
  i18n.changeLanguage(language).then().catch(e => console.error(e));
}).catch((error) => {
  i18n.changeLanguage("en").then().catch(e => console.error(e));
});
