import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useRef, useState } from "react";
import FieldsBanner from "./banner";
import CourseCard from "../../Components/Cards/courseCard";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import {
    TbSchool,
    TbArticle,
    TbFlask,
    TbArrowLeft,
    TbDna,
    TbChevronLeft,
    TbChevronRight,
    TbTestPipe,
} from "react-icons/tb";
import { fetchDataFromApi } from "../../utils/api";

import { MyContext } from "../../App";

// Static placeholder content for the articles section.
// Swap for a real endpoint (e.g. /api/article?filterKey=...) once one exists.
const articles = [
    { title: "اصول ایمنی و کار با تجهیزات آزمایشگاهی", titleEn: "Safety principles for using laboratory equipment", href: "/" },
    { title: "روش‌های صحیح تهیه و نگهداری بافرها", titleEn: "Preparing and storing buffers correctly", href: "/" },
    { title: "استانداردهای کالیبراسیون تجهیزات آزمایشگاهی", titleEn: "Standards for calibrating laboratory equipment", href: "/" },
    { title: "اصول نمونه‌گیری و آماده‌سازی نمونه", titleEn: "Fundamentals of sampling and sample preparation", href: "/" },
    { title: "مدیریت پسماندهای آزمایشگاهی و نکات ایمنی", titleEn: "Laboratory waste management and safety", href: "/" },
    { title: "آشنایی با تجهیزات پایه آزمایشگاه‌های تحقیقاتی", titleEn: "An introduction to basic research laboratory equipment", href: "/" },
];

const FieldFour = () => {

    const { t, dir, localize } = useLanguage();
    const { setIsShowFooter, setIsShowNavbar, setIsShowCalenderBar } = useContext(MyContext);

    useEffect(() => {
        setIsShowFooter(true);
        setIsShowNavbar(true);
        setIsShowCalenderBar(true);
    }, [setIsShowFooter, setIsShowNavbar, setIsShowCalenderBar]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Which section is showing in the content panel.
    // "courses" is selected automatically on first mount.
    const [activeSection, setActiveSection] = useState("courses");

    const servicesListRef = useRef(null);

    // Services pagination — 4 items per page.
    const SERVICES_PER_PAGE = 4;
    const [servicesPage, setServicesPage] = useState(1);

    // backend

    const [serviceData, setServiceData] = useState([]);
    const [courseData, setCourseData] = useState([]);

    useEffect(() => {
        fetchDataFromApi(`/api/service?filterKey=خدمات عمومی`).then((res) => {
            setServiceData(res);
        });

        fetchDataFromApi(`/api/course?filterKey=خدمات عمومی`).then((res) => {
            setCourseData(res);
        });
    }, []);

    useEffect(() => {
        setServicesPage(1);
    }, [serviceData]);

    const totalServicePages = Math.max(1, Math.ceil((serviceData?.length ?? 0) / SERVICES_PER_PAGE));

    const currentServices = (serviceData ?? []).slice(
        (servicesPage - 1) * SERVICES_PER_PAGE,
        servicesPage * SERVICES_PER_PAGE
    );

    const goToServicesPage = (page) => {
        const clamped = Math.min(Math.max(page, 1), totalServicePages);
        setServicesPage(clamped);
        servicesListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Builds a compact page list like: 1 2 3 ... 9
    const getServicePageNumbers = () => {
        const pages = [];
        const total = totalServicePages;
        const current = servicesPage;

        pages.push(1);
        if (current > 3) pages.push("...");

        for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
            pages.push(p);
        }

        if (current < total - 2) pages.push("...");
        if (total > 1) pages.push(total);

        return [...new Set(pages)];
    };

    const fieldName = "خدمات عمومی";

    const sections = [
        {
            key: "courses",
            icon: <TbSchool />,
            title: t("دوره‌های آموزشی", "Courses"),
            meta: t("{count} دوره فعال", "{count} active courses", { count: courseData?.length ?? 0 }),
        },
        {
            key: "articles",
            icon: <TbArticle />,
            title: t("مقالات و مطالب آموزشی", "Articles and learning resources"),
            meta: t("{count} مقاله", "{count} articles", { count: articles.length }),
        },
        {
            key: "services",
            icon: <TbFlask />,
            title: t("خدمات", "Services"),
            meta: t("{count} نوع خدمت", "{count} services", { count: serviceData?.length ?? 0 }),
        },
    ];

    const renderNavItem = (section) => (
        <button
            key={section.key}
            type="button"
            className={`fieldNav-item${activeSection === section.key ? " is-active" : ""}`}
            onClick={() => setActiveSection(section.key)}
        >
            <span className="fieldNav-left">
                <span className="fieldNav-iconChip">{section.icon}</span>
                <span className="fieldNav-text">
                    <span className="fieldNav-title">{section.title}</span>
                    <span className="fieldNav-meta">{section.meta}</span>
                </span>
            </span>
            <TbChevronLeft className="fieldNav-arrow" />
        </button>
    );

    return (
        <div className="feildCellularAndMolecular" dir={dir}>

            <FieldsBanner
                name={fieldName}
                courseCount={courseData?.length ?? 0}
                serviceCount={serviceData?.length ?? 0}
                articleCount={articles.length}
            />

            <div className="container">
                <div className="fieldPanel">

                    {/* Right column: section nav */}
                    <div className="fieldNav">
                        {sections.map(renderNavItem)}
                    </div>

                    {/* Left column: active section content */}
                    <div className="fieldContent">

                        {activeSection === "courses" && (
                            <div className="courseGrid">
                                {courseData?.length !== undefined && courseData?.length !== 0 &&
                                    courseData.map((item, index) => (
                                        <div className="courseGrid-item" key={index}>
                                            <CourseCard item={item} />
                                        </div>
                                    ))
                                }
                                <div className="fieldContent-footer">
                                    <Link to="/courseShop">
                                        <Button variant="outlined" className="outlineButton">{t("مشاهده تمامی دوره‌ها", "View all courses")}</Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {activeSection === "articles" && (
                            <div className="articleList">
                                {articles.map((article, index) => (
                                    <Link className="articleRow" to={article.href} key={index}>
                                        <span className="articleRow-icon"><TbDna /></span>
                                        <span className="articleRow-title">{localize(article, 'title')}</span>
                                        <span className="articleRow-cta">
                                            {t("مشاهده مقاله", "Read article")} <TbArrowLeft />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {activeSection === "services" && (
                            <div className="servicesPanel" ref={servicesListRef}>
                                <div className="servicesPanel-header">
                                    <h3 className="servicesIntro">{t("خدمات ارائه شده در این بخش", "Services in this field")}</h3>
                                    <p className="servicesPanel-meta">
                                        {t("{count} خدمت · صفحه {page} از {total}", "{count} services · Page {page} of {total}", { count: serviceData?.length ?? 0, page: servicesPage, total: totalServicePages })}
                                    </p>
                                </div>

                                <div className="serviceList">
                                    {currentServices.map((item, index) => (
                                        <div className="serviceRow" key={index}>
                                            <span className="serviceRow-icon"><TbTestPipe /></span>
                                            <p className="serviceRow-text">{localize(item, 'name')}</p>
                                        </div>
                                    ))}
                                </div>

                                {totalServicePages > 1 && (
                                    <nav className="pagination" aria-label={t("صفحه‌بندی خدمات", "Services pagination")}>
                                        <button
                                            type="button"
                                            className="pagination-arrow"
                                            onClick={() => goToServicesPage(servicesPage - 1)}
                                            disabled={servicesPage === 1}
                                            aria-label={t("صفحه قبل", "Previous page")}
                                        >
                                            <TbChevronRight />
                                        </button>

                                        {getServicePageNumbers().map((page, index) =>
                                            page === "..." ? (
                                                <span className="pagination-ellipsis" key={`ellipsis-${index}`}>...</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    key={page}
                                                    className={`pagination-item${page === servicesPage ? " is-active" : ""}`}
                                                    onClick={() => goToServicesPage(page)}
                                                    aria-current={page === servicesPage ? "page" : undefined}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        )}

                                        <button
                                            type="button"
                                            className="pagination-arrow"
                                            onClick={() => goToServicesPage(servicesPage + 1)}
                                            disabled={servicesPage === totalServicePages}
                                            aria-label={t("صفحه بعد", "Next page")}
                                        >
                                            <TbChevronLeft />
                                        </button>
                                    </nav>
                                )}

                                <div className="ctaCard">
                                    <h3 className="ctaCard-title">{t("درخواست خود را برای ما ارسال کنید", "Send us your request")}</h3>
                                    <p className="ctaCard-subtitle">{t("تمامی خدمات این بخش توسط تیم ما ارائه می‌شود", "Our team provides all services in this field")}</p>
                                    <Link to={`/service?fieldName=${encodeURIComponent(fieldName)}`}>
                                        <Button className="ctaButton">{t("ثبت درخواست", "Submit a request")}</Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>

        </div>
    );
}

export default FieldFour;