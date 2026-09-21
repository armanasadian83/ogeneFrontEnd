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
    { title: "روش‌های کشت و شناسایی باکتری‌های بی‌هوازی", href: "/" },
    { title: "اصول رنگ‌آمیزی گرم و کاربرد آن در تشخیص", href: "/" },
    { title: "آشنایی با آنتی‌بیوگرام و تفسیر نتایج آن", href: "/" },
    { title: "روش‌های شناسایی سریع میکروارگانیسم‌ها", href: "/" },
    { title: "اصول ضدعفونی و استریلیزاسیون در آزمایشگاه", href: "/" },
    { title: "مقدمه‌ای بر میکروب‌شناسی محیطی و صنعتی", href: "/" },
];

const FieldTwo = () => {

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(true);
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

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
        fetchDataFromApi(`/api/service?filterKey=میکروبیولوژی`).then((res) => {
            setServiceData(res);
        });

        fetchDataFromApi(`/api/course?filterKey=میکروبیولوژی`).then((res) => {
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

    const fieldName = "میکروبیولوژی";

    const sections = [
        {
            key: "courses",
            icon: <TbSchool />,
            title: "دوره‌های آموزشی",
            meta: `${courseData?.length ?? 0} دوره فعال`,
        },
        {
            key: "articles",
            icon: <TbArticle />,
            title: "مقالات و مطالب آموزشی",
            meta: `${articles.length} مقاله`,
        },
        {
            key: "services",
            icon: <TbFlask />,
            title: "خدمات",
            meta: `${serviceData?.length ?? 0} نوع خدمت`,
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
        <div className="feildCellularAndMolecular">

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
                                        <Button variant="outlined" className="outlineButton">مشاهده تمامی دوره‌ها</Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {activeSection === "articles" && (
                            <div className="articleList">
                                {articles.map((article, index) => (
                                    <Link className="articleRow" to={article.href} key={index}>
                                        <span className="articleRow-icon"><TbDna /></span>
                                        <span className="articleRow-title">{article.title}</span>
                                        <span className="articleRow-cta">
                                            مشاهده مقاله <TbArrowLeft />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {activeSection === "services" && (
                            <div className="servicesPanel" ref={servicesListRef}>
                                <div className="servicesPanel-header">
                                    <h3 className="servicesIntro">خدمات ارائه شده در این بخش</h3>
                                    <p className="servicesPanel-meta">
                                        {serviceData?.length ?? 0} خدمت &middot; صفحه {servicesPage} از {totalServicePages}
                                    </p>
                                </div>

                                <div className="serviceList">
                                    {currentServices.map((item, index) => (
                                        <div className="serviceRow" key={index}>
                                            <span className="serviceRow-icon"><TbTestPipe /></span>
                                            <p className="serviceRow-text">{item?.name}</p>
                                        </div>
                                    ))}
                                </div>

                                {totalServicePages > 1 && (
                                    <nav className="pagination" aria-label="صفحه‌بندی خدمات">
                                        <button
                                            type="button"
                                            className="pagination-arrow"
                                            onClick={() => goToServicesPage(servicesPage - 1)}
                                            disabled={servicesPage === 1}
                                            aria-label="صفحه قبل"
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
                                            aria-label="صفحه بعد"
                                        >
                                            <TbChevronLeft />
                                        </button>
                                    </nav>
                                )}

                                <div className="ctaCard">
                                    <h3 className="ctaCard-title">درخواست خود را برای ما ارسال کنید</h3>
                                    <p className="ctaCard-subtitle">تمامی خدمات این بخش توسط تیم ما ارائه می‌شود</p>
                                    <Link to={`/service?fieldName=${encodeURIComponent(fieldName)}`}>
                                        <Button className="ctaButton">ثبت درخواست</Button>
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

export default FieldTwo;