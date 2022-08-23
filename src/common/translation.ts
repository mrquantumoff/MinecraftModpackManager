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

let strings = {};

let lang = "en";

export default lang;

export async function getLanguageTranslation(
  language: string,
  phraseName: any
) {
  const file = await join(
    dataDirPath,
    "mcmodpackmanagerbymrquantumoff",
    "languages",
    language + ".json"
  );
  try {
    const conts = await readTextFile(file);
    const obj = JSON.parse(conts);
    return obj.phrases[0].name;
  } catch (e) {
    return (
      "Failed to load translation file: " + language + " Phrase: " + phraseName
    );
  }
}
