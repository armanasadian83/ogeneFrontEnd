import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import "./enamadSeal.css";

// Keep the ID, code and origin policy exactly as issued by eNAMAD.
const sealCode = "DCUvppqG13XGco7UU3cpoZFr82zDH5vY";
const sealQuery = `id=6800848&Code=${sealCode}`;

export default function EnamadSeal() {
    const { t } = useLanguage();
    const [unavailable, setUnavailable] = useState(false);

    return (
        <div className="trust-seal">
            {/* eslint-disable-next-line react/jsx-no-target-blank -- Preserve eNAMAD's issued origin referrer; noopener isolates the new tab. */}
            <a href={`https://trustseal.enamad.ir/?${sealQuery}`} referrerPolicy="origin"
                target="_blank" rel="noopener" className="enamadVerification">
                {unavailable ? (
                    <span className="enamadFallback">
                        <FiExternalLink aria-hidden="true" />
                        <strong>{t("استعلام اینماد", "eNAMAD verification")}</strong>
                        <span>{t("سامانه رسمی اینماد", "Official eNAMAD website")}</span>
                    </span>
                ) : (
                    <img referrerPolicy="origin" src={`https://trustseal.enamad.ir/logo.aspx?${sealQuery}`}
                        alt={t("نماد اعتماد الکترونیکی", "Electronic Trust Symbol")}
                        style={{ cursor: "pointer" }} code={sealCode} onError={() => setUnavailable(true)} />
                )}
            </a>
        </div>
    );
}
