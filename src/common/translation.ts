import React, { useState } from "react";
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { dataDir, join } from "@tauri-apps/api/path";
const dataDirPath = await dataDir();
export enum Language {
  en = "en",
  ua = "ua",
  ru = "ru",
  tr = "tr",
}

import { default as enTranslation } from "../translations/en";

let lang: string = "en";

export default lang;

export async function getLanguageTranslation(
  language: string,
  phraseName: string
) {
  try {
    switch (language) {
      case "en": {
        switch (phraseName) {
          case "productName": {
            return enTranslation.productName;
          }
          case "modpackSelectorText": {
            return enTranslation.modpackSelectorText;
          }
        }
      }
    }
    return "";
  } catch (e) {
    return "Failed to load translation: " + language + " Phrase: " + phraseName;
  }
}
