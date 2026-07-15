import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import common from "../public/locales/en/common.json";
import projectsItemData from "../public/locales/en/projects-item-data.json";
import openSourceData from "../public/locales/en/open-source-data.json";

// Mirrors the app's next-i18next setup (defaultNS "common") so `useTranslation()`
// resolves the same keys inside Storybook without the Next.js data pipeline.
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "projects-item-data", "open-source-data"],
  resources: {
    en: {
      common,
      "projects-item-data": projectsItemData,
      "open-source-data": openSourceData,
    },
  },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
