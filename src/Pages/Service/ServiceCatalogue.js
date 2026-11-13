import { FiArrowUpRight, FiDownload, FiFileText } from "react-icons/fi";
import { useLanguage } from "../../i18n/LanguageContext";
import catalogueCover from "../../assets/catalogues/abtin-gene-cover.webp";
import "./serviceCatalogue.css";

const catalogueUrl = `${(process.env.PUBLIC_URL || "").replace(/\/$/, "")}/catalogues/ogene-bioinformatics-services.pdf`;

export default function ServiceCatalogue() {
    const { t, dir, formatNumber } = useLanguage();

    return (
        <section className="serviceCatalogue" dir={dir} aria-labelledby="service-catalogue-title">
            <div className="serviceCatalogueContent">
                <h2 id="service-catalogue-title">{t("کاتالوگ خدمات اوژن", "Ogene services catalogue")}</h2>
                <p className="serviceCatalogueDescription">
                    {t(
                        "با خدمات تخصصی بیوانفورماتیک و ژنومیکس همکار ما، آبتین ژن، از تحلیل داده‌های توالی‌یابی تا مطالعات ساختاری و سیستمی آشنا شوید.",
                        "Explore our partner Abtin Gene’s specialist bioinformatics and genomics services, from sequencing data analysis to structural and systems studies.",
                    )}
                </p>
                <ul className="serviceCatalogueTopics" aria-label={t("موضوعات کاتالوگ", "Catalogue topics")}>
                    <li>{t("ژنومیکس و تحلیل واریانت", "Genomics & variant analysis")}</li>
                    <li>{t("بیان ژن و تحلیل تک‌سلولی", "Gene expression & single-cell analysis")}</li>
                    <li>{t("مطالعات ساختاری و سیستمی", "Structural & systems studies")}</li>
                </ul>
                <div className="serviceCatalogueActions">
                    <a className="serviceCatalogueDownload" href={catalogueUrl} download="ogene-services-catalogue.pdf">
                        <FiDownload aria-hidden="true" />
                        <span>{t("دریافت کاتالوگ خدمات اوژن", "Download Ogene services catalogue")}</span>
                    </a>
                    <a className="serviceCatalogueView" href={catalogueUrl} target="_blank" rel="noopener noreferrer">
                        {t("مشاهده آنلاین", "View online")}<FiArrowUpRight aria-hidden="true" />
                    </a>
                </div>
                <p className="serviceCatalogueMetadata">
                    <FiFileText aria-hidden="true" />
                    <span>PDF</span><span aria-hidden="true">·</span>
                    <span>{t(`${formatNumber(15)} صفحه`, `${formatNumber(15)} pages`)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t(`${formatNumber(14.8)} مگابایت`, `${formatNumber(14.8)} MB`)}</span>
                </p>
            </div>
            <div className="serviceCataloguePreview">
                <div className="serviceCataloguePreviewFrame">
                    <img src={catalogueCover} width="720" height="402" loading="lazy"
                        alt={t("جلد کاتالوگ خدمات بیوانفورماتیک و ژنومیکس آبتین ژن", "Cover of the Abtin Gene bioinformatics and genomics catalogue")} />
                    <div className="serviceCataloguePreviewCaption">
                        <FiFileText aria-hidden="true" />
                        <span>{t("کاتالوگ بیوانفورماتیک و ژنومیکس", "Bioinformatics & genomics catalogue")}</span>
                        <bdi>ABTINGENE</bdi>
                    </div>
                </div>
            </div>
        </section>
    );
}
