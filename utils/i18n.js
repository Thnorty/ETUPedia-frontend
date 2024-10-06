import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import trTranslation from "../locales/tr.json";
import enTranslation from "../locales/en.json";
import deTranslation from "../locales/de.json";
import {localStorage} from "./LocalStorage";
import ExpoLocalization from 'expo-localization/src/ExpoLocalization';

const languages = [
  { code: 'tr', translation: trTranslation },
  { code: 'en', translation: enTranslation },
  { code: 'de', translation: deTranslation },
];

const resources = languages.reduce((acc, { code, translation }) => {
  acc[code] = { translation };
  return acc;
}, {});

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
}).then();

function getPreferredLocale() {
  const locales = ExpoLocalization.getLocales();
  return locales.find(locale => languages.some(lang => lang.code === locale.languageCode));
}

localStorage.load({key: 'language'}).then((language) => {
  i18n.changeLanguage(language).then().catch(e => console.error(e));
}).catch(() => {
  const locale = getPreferredLocale();
  if (locale)
    i18n.changeLanguage(locale.languageCode).then().catch(e => console.error(e));
  else
    i18n.changeLanguage("en").then().catch(e => console.error(e));
});

export {languages};
