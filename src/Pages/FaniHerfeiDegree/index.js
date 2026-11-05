import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowUpLeft, FiChevronDown, FiChevronLeft, FiExternalLink } from "react-icons/fi";
import Logo from "../../assets/degree/full logo.png";
import OrgLogo from "../../assets/degree/faniherfeiOrg.png";
import TablePic from "../../assets/degree/table.png";
import DegreeExample from "../../assets/degree/degreeExample.jpeg";
import { MyContext } from "../../App";
import { degreeGuideGroups } from "./degreeGuideData";
import "./degree.css";

const certificateTypes = [
  { number: "۰۱", title: "مدرک رسمی", description: "گواهینامه‌ای که پس از قبولی در آزمون‌های سازمان آموزش فنی و حرفه‌ای صادر می‌شود.", titleEn: "Official certificate", descriptionEn: "A certificate issued after passing examinations held by the Technical and Vocational Training Organization." },
  { number: "۰۲", title: "مدرک مورد تأیید", description: "گواهینامه‌ای که آموزشگاه‌های آزادِ مورد تأیید سازمان، برای دوره‌های خود ارائه می‌کنند.", titleEn: "Approved certificate", descriptionEn: "A course certificate issued by a private institute approved by the organization." },
  { number: "۰۳", title: "گذر مهارتی", description: "گواهینامه شرکت در همایش‌ها، سمینارها و کارگاه‌های کوتاه‌مدت مهارتی.", titleEn: "Skills participation", descriptionEn: "A participation certificate for conferences, seminars and short skills workshops." },
];
const degreeSteps = [
  { number: "۰۱", title: "دوره", description: "شرکت در دوره آموزشی مرتبط با مهارت مورد نظر", titleEn: "Course", descriptionEn: "Complete training relevant to your chosen skill" },
  { number: "۰۲", title: "آزمون", description: "شرکت در آزمون‌های نظری و عملی مطابق برنامه سازمان", titleEn: "Examination", descriptionEn: "Take the theoretical and practical examinations on the organization’s schedule" },
  { number: "۰۳", title: "ارزیابی", description: "سنجش مهارت و کسب نمره قبولی در ارزیابی‌ها", titleEn: "Assessment", descriptionEn: "Demonstrate your skills and achieve the required passing scores" },
  { number: "۰۴", title: "استعلام", description: "دریافت و استعلام گواهینامه از طریق سامانه سازمان", titleEn: "Verification", descriptionEn: "Receive and verify your certificate through the organization’s portal" },
];
// English rendering of the existing comparison image, using the same ratings.
const comparisonColumns = ["Official education diploma", "Government employment", "Migration abroad", "Private companies", "Official translation value"];
const comparisonRows = [
  { name: "Academic-centre certificate", ratings: ["yes", "discretionary", "no", "yes", "no"] },
  { name: "Government-employee certificate", ratings: ["no", "no", "no", "discretionary", "no"] },
  { name: "Technical and vocational certificate", ratings: ["yes", "yes", "yes", "yes", "yes"] },
  { name: "Neighbourhood-centre certificate", ratings: ["no", "no", "no", "discretionary", "no"] },
];
const comparisonRatings = { yes: "Recognized", no: "Not recognized", discretionary: "Discretionary" };

const FaniHerfeiDegree = () => {
  const { t, dir, isEnglish, localize } = useLanguage();
  const { setIsShowFooter, setIsShowNavbar, setIsShowCalenderBar } = useContext(MyContext);
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsShowFooter(true);
    setIsShowNavbar(true);
    setIsShowCalenderBar(true);
  }, [setIsShowFooter, setIsShowNavbar, setIsShowCalenderBar]);

  return (
    <main className="degreeLanding" dir={dir}>
      <section className="degreeHero" aria-labelledby="degree-title">
        <div className="degreeShell">
          <nav className="degreeBreadcrumb" aria-label={t("مسیر صفحه", "Breadcrumb")}>
            <Link to="/">{t("خانه", "Home")}</Link><FiChevronLeft aria-hidden="true" />
            <span aria-current="page">{t("مدرک فنی و حرفه‌ای", "Technical and vocational certificate")}</span>
          </nav>
          <div className="degreeHeroGrid">
            <div className="degreeHeroCopy">
              <h1 id="degree-title">{t("مدرک فنی و حرفه‌ای", "Technical and vocational certificate")}</h1>
              <p>{t("مسیر دریافت گواهینامه مهارت، از آموزش تا ارزیابی", "Your path to skills certification, from training to assessment")}</p>
            </div>
            <figure className="degreeSpecimen">
              <a href={DegreeExample} target="_blank" rel="noopener noreferrer" aria-label={t("مشاهده نمونه گواهینامه مهارت در اندازه کامل (پنجره جدید)", "View the full-size sample skills certificate (opens in a new window)")}>
                <img src={DegreeExample} width="750" height="1072" alt={t("نمونه گواهینامه مهارت سازمان آموزش فنی و حرفه‌ای", "Sample skills certificate from the Technical and Vocational Training Organization")} />
              </a>
              <figcaption>{t("نمونه گواهینامه مهارت", "Sample skills certificate")} <FiArrowUpLeft aria-hidden="true" /></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <div className="degreeShell">
        <section className="degreeIntro" aria-labelledby="degree-intro-title">
          <div>
            <h2 id="degree-intro-title">{t("چرا آموزشگاه اوژن؟", "Why Ogene Institute?")}</h2>
            <p>{t("آموزشگاه نانو زیست فناوری اوژن (تکوین)، برگزارکننده دوره‌ها و کارگاه‌های کاربردی در حوزه نانو زیست فناوری است. با گذراندن برخی دوره‌های آموزشگاه، امکان اقدام برای دریافت مدرک فنی و حرفه‌ای در سرفصل‌های مرتبط را دارید.", "Ogene Nano-Biotechnology Institute (Takvin) offers practical courses and workshops in nano-biotechnology. Completing selected courses allows you to apply for technical and vocational certification in relevant subjects.")}</p>
          </div>
          <img src={Logo} width="700" height="380" loading="lazy" alt={t("آموزشگاه نانو زیست فناوری اوژن (تکوین)", "Ogene Nano-Biotechnology Institute (Takvin)")} />
        </section>
        <section className="degreeTypes" aria-labelledby="degree-types-title">
          <div className="degreeSectionHeading">
            <h2 id="degree-types-title">{t("با انواع گواهینامه آشنا شوید", "Explore the types of certificate")}</h2>
            <p>{t("با تفاوت گواهینامه‌های رسمی، مورد تأیید و گذر مهارتی آشنا شوید.", "Understand the differences between official, approved and skills participation certificates.")}</p>
          </div>
          <div className="degreeTypeGrid">
            {certificateTypes.map((type) => (
              <article className="degreeType" key={isEnglish ? String(certificateTypes.indexOf(type) + 1).padStart(2, "0") : type.number}>
                <span className="degreeTypeNumber" aria-hidden="true">{isEnglish ? String(certificateTypes.indexOf(type) + 1).padStart(2, "0") : type.number}</span>
                <h3>{localize(type, 'title')}</h3><p>{localize(type, 'description')}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="degreeProcess" aria-labelledby="degree-process-title">
        <div className="degreeShell">
          <div className="degreeSectionHeading">
            <h2 id="degree-process-title">{t("مسیر دریافت مدرک", "Your path to certification")}</h2>
            <p>{t("از شرکت در دوره تا دریافت گواهینامه، این مسیر طی می‌شود.", "Follow these steps from taking a course to receiving your certificate.")}</p>
          </div>
          <ol className="degreeStepGrid">
            {degreeSteps.map((step) => (
              <li className="degreeStep" key={isEnglish ? String(degreeSteps.indexOf(step) + 1).padStart(2, "0") : step.number}>
                <div className="degreeStepHeading"><span aria-hidden="true">{isEnglish ? String(degreeSteps.indexOf(step) + 1).padStart(2, "0") : step.number}</span><h3>{localize(step, 'title')}</h3></div>
                <p>{localize(step, 'description')}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="degreeGuide degreeShell" aria-labelledby="degree-guide-title">
        <div className="degreeGuideGrid">
          <div>
            <h2 id="degree-guide-title">{t("راهنمای مدرک فنی و حرفه‌ای", "Technical and vocational certificate guide")}</h2>
            <p className="degreeGuideLead">{t("برای آشنایی بیشتر با انواع گواهینامه، شرایط دریافت و مراحل مرتبط، بخش مورد نظر را باز کنید.", "Open a section to learn about certificate types, eligibility and the steps involved.")}</p>
            <div className="degreeDisclosureList">
              {degreeGuideGroups.map((group) => (
                <details className="degreeDisclosure" key={group.id} aria-labelledby={`degree-guide-${group.id}`}>
                  <summary id={`degree-guide-${group.id}`}><span>{localize(group, 'title')}</span><FiChevronDown aria-hidden="true" /></summary>
                  <div className="degreeDisclosureBody">
                    {group.sections.map((section) => (
                      <section key={localize(section, 'title')}>
                        <h3>{localize(section, 'title')}</h3>
                        {(isEnglish ? section.paragraphsEn : section.paragraphs).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                        {section.items ? <ul>{(isEnglish ? section.itemsEn : section.items).map((item, index) => <li key={index}>{item}</li>)}</ul> : null}
                      </section>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
          <figure className="degreeComparison">
            <figcaption><h3>{t("مقایسه انواع مدارک", "Compare qualifications")}</h3><p>{t("جدول مقایسه مدارک و راهنمای آن", "Qualification comparison table and key")}</p></figcaption>
            {isEnglish ? (
              <div className="degreeComparisonScroll" tabIndex={0} role="region" aria-label="Qualification comparison table">
                <table className="degreeComparisonTable">
                  <caption>Comparison shown in the institute’s original qualification guide</caption>
                  <thead><tr><th scope="col">Qualification</th>{comparisonColumns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
                  <tbody>{comparisonRows.map((row) => <tr key={row.name}><th scope="row">{row.name}</th>{row.ratings.map((rating, index) => <td key={comparisonColumns[index]}><span className={`degreeRating degreeRating-${rating}`}>{comparisonRatings[rating]}</span></td>)}</tr>)}</tbody>
                </table>
              </div>
            ) : <a href={TablePic} target="_blank" rel="noopener noreferrer" aria-label={t("مشاهده جدول مقایسه مدارک در اندازه کامل (پنجره جدید)", "View the full-size qualification comparison table (opens in a new window)")}>
              <img src={TablePic} width="1727" height="527" loading="lazy" alt={t("جدول مقایسه مدارک فنی و حرفه‌ای، جهاد دانشگاهی، کارکنان دولت و سرای محله از نظر کاربرد و ارزش ترجمه؛ همراه با راهنمای رنگ‌ها", "Comparison of vocational, academic-centre, government-employee and neighbourhood-centre certificates by use and translation value, with a colour key")} />
              <span className="degreeImageLink">{t("مشاهده جدول در اندازه کامل", "View full-size table")} <FiArrowUpLeft aria-hidden="true" /></span>
            </a>}
          </figure>
        </div>
        <section className="degreeOfficial" aria-labelledby="degree-official-title">
          <img src={OrgLogo} width="300" height="194" loading="lazy" alt={t("نشان سازمان آموزش فنی و حرفه‌ای کشور", "Iran Technical and Vocational Training Organization emblem")} />
          <div>
            <h2 id="degree-official-title">{t("لینک‌های رسمی و مرتبط", "Official and related links")}</h2>
            <p>{t("برای کسب اطلاعات بیشتر و استعلام گواهینامه، به وب‌سایت‌های سازمان مراجعه کنید.", "Visit the organization’s websites for more information and certificate verification.")}</p>
            <div className="degreeOfficialLinks">
              <a href="https://irantvto.ir/" target="_blank" rel="noopener noreferrer">{t("سایت سازمان فنی و حرفه‌ای", "Organization website")} <FiExternalLink aria-hidden="true" /></a>
              <a href="https://www.portaltvto.com/" target="_blank" rel="noopener noreferrer">{t("پرتال سازمان", "Organization portal")} <FiExternalLink aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </section>

      <section className="degreeRequestBanner" aria-labelledby="degree-request-title">
        <div className="degreeShell">
          <h2 id="degree-request-title">{t("برای دریافت مدرک آماده‌اید؟", "Ready to request your certificate?")}</h2>
          <p>{t("اطلاعات دوره و مشخصات خود را در فرم درخواست وارد کنید.", "Enter your course details and personal information in the request form.")}</p>
          <Link className="degreeRequestLink" to="/degree/request">{t("دریافت مدرک", "Request a certificate")} <FiArrowLeft aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
};
export default FaniHerfeiDegree;
