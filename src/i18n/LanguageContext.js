import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { commonTranslations } from "./common";
import { siteMessages } from "./siteMessages";

export const LANGUAGE_STORAGE_KEY = "ogene.language";
const normalize = (text) => String(text ?? "").replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/\u200c/g, " ").replace(/\s+/g, " ").trim();
const messages = new Map(Object.entries({ ...commonTranslations, ...siteMessages }).map(([fa, en]) => [normalize(fa), en]));
const supportedLanguage = (value) => value === "en" ? "en" : "fa";

export function readStoredLanguage() {
  try { return supportedLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)); }
  catch { return "fa"; }
}

export function translate(language, persian, english, parameters = {}) {
  // An object as the second argument supplies interpolation values for shared labels.
  if (english && typeof english === "object") { parameters = english; english = undefined; }
  const shared = messages.get(normalize(persian));
  const translated = shared === undefined ? persian : `${String(persian).match(/^\s*/)[0]}${shared}${String(persian).match(/\s*$/)[0]}`;
  const text = language === "en" ? (english ?? translated) : persian;
  return String(text ?? "").replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(parameters, key) ? String(parameters[key]) : match);
}

const hasText = (value) => typeof value === "string" && value.trim().length > 0;
export function localizedField(record, field, language = "fa") {
  const original = record?.[field];
  const english = record?.[`${field}En`];
  if (language === "en") {
    if (Array.isArray(original) && Array.isArray(english)) {
      return original.map((value, index) => hasText(english[index]) ? english[index] : value);
    }
    if (hasText(english)) return english;
  }
  return original ?? "";
}

function languageValue(language, setLanguage) {
  return {
    language,
    isEnglish: language === "en",
    dir: language === "en" ? "ltr" : "rtl",
    locale: language === "en" ? "en-US" : "fa-IR",
    setLanguage,
    t: (persian, english, parameters) => translate(language, persian, english, parameters),
    localize: (record, field) => localizedField(record, field, language),
    formatNumber: (value, options) => Number(value).toLocaleString(language === "en" ? "en-US" : "fa-IR", options),
  };
}

// Components also render correctly in isolation, with Persian as their default.
const LanguageContext = createContext(languageValue("fa", () => {}));

export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(readStoredLanguage);
  const setLanguage = useCallback((value) => {
    const next = supportedLanguage(value);
    updateLanguage(next);
    try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next); } catch { /* Selection still works when storage is unavailable. */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "en" ? "ltr" : "rtl";
    document.body.style.direction = language === "en" ? "ltr" : "rtl";
    document.title = language === "en" ? "Ogene Nanobiotechnology Institute (Takvin)" : "آموزشگاه نانو زیست فناوری اوژن (تکوین)";
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      if (!description.dataset.persianContent) description.dataset.persianContent = description.content;
      description.content = language === "en"
        ? "Ogene Nano-Biotechnology Institute offers training courses, laboratory and research services, and thesis guidance in genetics, nanotechnology, microbiology, biotechnology, tissue engineering, bioinformatics and related fields."
        : description.dataset.persianContent;
    }
  }, [language]);

  useEffect(() => {
    const syncLanguage = (event) => {
      if (event.key === LANGUAGE_STORAGE_KEY || event.key === null) updateLanguage(readStoredLanguage());
    };
    window.addEventListener("storage", syncLanguage);
    return () => window.removeEventListener("storage", syncLanguage);
  }, []);

  const value = useMemo(() => languageValue(language, setLanguage), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
