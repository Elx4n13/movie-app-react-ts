import i18next from "i18next";

import { initReactI18next } from "react-i18next";

import BackEnd from "i18next-http-backend";

import languages from "./i18nLanguages";
i18next.use(initReactI18next).use(BackEnd).init({
  lng: "aze",
  fallbackLng: "aze",
});

i18next.on("languageChanged", function (lang) {
  localStorage.setItem("selectedLanguage", lang);
});

let selectedLanguage = localStorage.getItem("selectedLanguage" || "aze");
if (selectedLanguage && languages.includes(selectedLanguage)) {
  i18next.changeLanguage(selectedLanguage);
}
else {
  localStorage.setItem("selectedLanguage", "aze");
  selectedLanguage = localStorage.getItem("selectedLanguage") || "aze";
}

export default i18next;
