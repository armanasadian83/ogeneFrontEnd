import { FiExternalLink } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import abtinGeneLogo from "../../assets/partners/abtin-gene.jpg";

const partners = [
    {
        id: "abtin-gene",
        name: "آبتین ژن",
        nameEn: "Abtin Gene",
        domain: "www.abtingene.com",
        website: "https://www.abtingene.com",
        logo: abtinGeneLogo,
    },
];

export default function Partners() {
    const { t, localize } = useLanguage();

    return (
        <section className="aboutPartners" aria-labelledby="about-partners-title">
            <div className="aboutPartnersHeading">
                <h2 id="about-partners-title">{t("همکاران", "Our partners")}</h2>
                <p>
                    {t(
                        "با مجموعه‌های همراه اوژن بیشتر آشنا شوید.",
                        "Get to know the organizations working alongside Ogene.",
                    )}
                </p>
            </div>

            <div className="aboutPartnersList">
                {partners.map((partner) => (
                    <article className="aboutPartnerCard" key={partner.id}>
                        <div className="aboutPartnerLogo">
                            <img
                                src={partner.logo}
                                alt={localize(partner, "name")}
                                width={391}
                                height={159}
                                loading="lazy"
                            />
                        </div>
                        <div className="aboutPartnerContent">
                            <h3>{localize(partner, "name")}</h3>
                            <span className="aboutPartnerDomain" dir="ltr" lang="en">
                                {partner.domain}
                            </span>
                            <p>
                                {t(
                                    "برای آشنایی بیشتر با این مجموعه، از وب‌سایت رسمی آن دیدن کنید.",
                                    "Visit the organization’s official website to learn more.",
                                )}
                            </p>
                            <a
                                href={partner.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aboutPartnerLink"
                                aria-label={t(
                                    "مشاهده وب‌سایت {name} (در پنجره جدید)",
                                    "Visit {name}’s website (opens in a new tab)",
                                    { name: localize(partner, "name") },
                                )}
                            >
                                {t("مشاهده وب‌سایت", "Visit website")}
                                <FiExternalLink aria-hidden="true" />
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
