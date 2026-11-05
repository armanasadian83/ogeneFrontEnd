import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { FiCheck, FiGlobe } from "react-icons/fi";
import { useLanguage } from "../i18n/LanguageContext";
import "./languageSelector.css";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const selectLanguage = (next) => { setLanguage(next); setAnchor(null); };
  return (
    <div className="languageSelector">
      <button type="button" className={`languageSelectorTrigger${open ? " isOpen" : ""}`}
        id="language-selector-trigger" aria-label={t("انتخاب زبان", "Choose language")}
        title={t("انتخاب زبان", "Choose language")} aria-haspopup="menu"
        aria-expanded={open} aria-controls={open ? "language-selector-menu" : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}>
        <FiGlobe aria-hidden="true" />
      </button>
      <Menu id="language-selector-menu" anchorEl={anchor} open={open} onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{ paper: { className: "languageSelectorPaper" }, list: { "aria-labelledby": "language-selector-trigger", className: "languageSelectorMenu" } }}>
        <MenuItem role="menuitemradio" aria-checked={language === "fa"} selected={language === "fa"} onClick={() => selectLanguage("fa")}>
          <span className="languageOptionCode" lang="fa" dir="rtl">فا</span>
          <span className="languageOptionName" lang="fa" dir="rtl">فارسی</span>
          {language === "fa" ? <FiCheck aria-hidden="true" /> : <span className="languageOptionCheck" />}
        </MenuItem>
        <MenuItem role="menuitemradio" aria-checked={language === "en"} selected={language === "en"} onClick={() => selectLanguage("en")}>
          <span className="languageOptionCode" lang="en" dir="ltr">en</span>
          <span className="languageOptionName" lang="en" dir="ltr">English</span>
          {language === "en" ? <FiCheck aria-hidden="true" /> : <span className="languageOptionCheck" />}
        </MenuItem>
      </Menu>
    </div>
  );
}
