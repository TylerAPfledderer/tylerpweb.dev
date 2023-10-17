const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: [
      "da",
      "de",
      "en",
      "es",
      "fi",
      "fr",
      "it",
      "ja",
      "nl",
      "pl",
      "pt",
      "sv",
      "uk",
    ],
  },
  localePath: path.resolve("./public/locales"),
};
