import { initReactI18next } from "react-i18next";
import i18n from "i18next";

import common from "./public/locales/en/common.json";
import openSourceData from "./public/locales/en/open-source-data.json";
import projectsItemData from "./public/locales/en/projects-item-data.json";

export const defaultNS = "common";
export const resources = {
  en: {
    common,
    "open-source-data": { ...openSourceData },
    "projects-item-data": { ...projectsItemData },
  },
} as const;

i18n.use(initReactI18next).init({
  lng: "en",
  ns: ["common", "open-source-data", "projects-item-data"],
  defaultNS,
  resources,
});
