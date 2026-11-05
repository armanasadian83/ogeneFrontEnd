import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";
import persianEn from "react-date-object/locales/persian_en";
import { FiArrowLeft, FiBookOpen, FiCalendar, FiChevronLeft, FiUser } from "react-icons/fi";
import { PiCertificateLight } from "react-icons/pi";
import { MyContext } from "../../App";
import "./degreeRequest.css";

const personalFields = [
    { name: "firstName", label: "نام", labelEn: "First name", autoComplete: "given-name", placeholder: "نام خود را وارد کنید", placeholderEn: "Enter your first name" },
    { name: "lastName", label: "نام خانوادگی", labelEn: "Last name", autoComplete: "family-name", placeholder: "نام خانوادگی خود را وارد کنید", placeholderEn: "Enter your last name" },
    { name: "englishName", label: "نام به انگلیسی", labelEn: "First name in English", latin: true, autoComplete: "off", placeholder: "First name (English)" },
    { name: "englishLastName", label: "نام خانوادگی به انگلیسی", labelEn: "Last name in English", latin: true, autoComplete: "off", placeholder: "Last name (English)" },
    { name: "nationalCode", label: "کد ملی", labelEn: "National ID number", inputMode: "numeric", maxLength: 10, autoComplete: "off", placeholder: "کد ملی ۱۰ رقمی خود را وارد کنید", placeholderEn: "Enter your 10-digit national ID" },
    { name: "phone", label: "شماره همراه", labelEn: "Mobile number", inputMode: "tel", autoComplete: "tel-national", maxLength: 11, placeholder: "مثال: ۰۹۱۲۳۴۵۶۷۸۹", placeholderEn: "Example: 09123456789" },
    { name: "birthdate", label: "تاریخ تولد", labelEn: "Date of birth", date: true },
    { name: "email", label: "ایمیل (اختیاری)", labelEn: "Email (optional)", optional: true, type: "email", latin: true, autoComplete: "email", placeholder: "example@domain.com" },
];
const courseFields = [
    { name: "courseTitle", label: "عنوان دوره", labelEn: "Course title", autoComplete: "off", placeholder: "عنوان دوره را وارد کنید", placeholderEn: "Enter the course title" },
    { name: "endDate", label: "تاریخ پایان دوره (اختیاری)", labelEn: "Course end date (optional)", date: true, optional: true },
];
const initialFields = Object.fromEntries([...personalFields, ...courseFields, { name: "notes" }].map(({ name }) => [name, ""]));
const formAdvice = [
    "نام و نام خانوادگی را مطابق مشخصات ثبت‌نام وارد کنید.",
    "عنوان دوره را کامل بنویسید.",
    "اطلاعات تماس خود را بررسی کنید.",
];
const formAdviceEn = ["Enter your first and last names exactly as registered.","Write the full course title.","Check your contact details."];
const toEnglishDigits = (value) => String(value).replace(/[۰-۹٠-٩]/g, (digit) =>
    String(digit.charCodeAt(0) - (digit <= "٩" ? 0x660 : 0x6f0)));

function RequestField({ field, value, onChange }) {
    const { t, dir, language, isEnglish, localize } = useLanguage();
    const id = `degree-request-${field.name}`;
    return (
        <div className="degreeRequestField">
            <label htmlFor={id}>{localize(field, 'label')}{!field.optional ? <span className="degreeRequestRequired" aria-hidden="true">*</span> : null}</label>
            {field.date ? (
                <div className="degreeRequestDate">
                    <DatePicker
                        id={id}
                        name={field.name}
                        value={value}
                        onChange={(date) => onChange(field.name, date ? toEnglishDigits(date.format("YYYY/MM/DD")) : "")}
                        calendar={persian}
                        locale={isEnglish ? persianEn : persianFa}
                        format="YYYY/MM/DD"
                        placeholder={t("روز / ماه / سال", "Year / month / day")}
                        required={!field.optional}
                        editable
                        containerStyle={{ width: "100%" }}
                        inputClass="degreeRequestInput"
                        calendarPosition={isEnglish ? "bottom-left" : "bottom-right"}
                        onOpenPickNewDate={false}
                        digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                    />
                    <FiCalendar aria-hidden="true" />
                </div>
            ) : (
                <input
                    id={id}
                    name={field.name}
                    type={field.type || "text"}
                    value={value}
                    onChange={(event) => onChange(field.name, field.inputMode ? toEnglishDigits(event.target.value) : event.target.value)}
                    required={!field.optional}
                    maxLength={field.maxLength || 100}
                    inputMode={field.inputMode}
                    autoComplete={field.autoComplete}
                    placeholder={localize(field, 'placeholder')}
                    dir={field.latin ? "ltr" : dir}
                    lang={field.latin ? "en" : language}
                    className="degreeRequestInput"
                />
            )}
        </div>
    );
}

export default function DegreeRequest() {
    const { t, dir, isEnglish } = useLanguage();
    const { setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar, setIsBaleIconShown } = useContext(MyContext);
    const [formFields, setFormFields] = useState(initialFields);

    useEffect(() => {
        setIsShowNavbar(true);
        setIsShowFooter(true);
        setIsShowCalenderBar(false);
        setIsBaleIconShown(false);
        window.scrollTo(0, 0);
        return () => {
            setIsShowCalenderBar(true);
            setIsBaleIconShown(true);
        };
    }, [setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar, setIsBaleIconShown]);

    const changeField = (name, value) => setFormFields((previous) => ({ ...previous, [name]: value }));

    return (
        <main className="degreeRequestPage" dir={dir}>
            <div className="degreeRequestContainer">
                <nav className="degreeRequestBreadcrumb" aria-label={t("مسیر صفحه", "Breadcrumb")}>
                    <Link to="/">{t("خانه", "Home")}</Link><FiChevronLeft aria-hidden="true" />
                    <Link to="/degree">{t("مدرک فنی و حرفه‌ای", "Technical and vocational certificate")}</Link><FiChevronLeft aria-hidden="true" />
                    <span aria-current="page">{t("درخواست مدرک", "Certificate request")}</span>
                </nav>

                <header className="degreeRequestHeader">
                    <h1 id="degree-request-page-title">{t("درخواست مدرک", "Certificate request")}</h1>
                    <p>{t("مشخصات خود و دوره‌ای را که گذرانده‌اید وارد کنید.", "Enter your personal details and the course you completed.")}</p>
                </header>

                <div className="degreeRequestLayout">
                    <form className="degreeRequestForm" aria-labelledby="degree-request-page-title" onSubmit={(event) => event.preventDefault()} noValidate>
                        <section className="degreeRequestSection" aria-labelledby="degree-personal-title">
                            <h2 id="degree-personal-title"><FiUser aria-hidden="true" /> {t("اطلاعات فردی", "Personal information")}</h2>
                            <div className="degreeRequestGrid">
                                {personalFields.map((field) => <RequestField key={field.name} field={field} value={formFields[field.name]} onChange={changeField} />)}
                            </div>
                        </section>

                        <section className="degreeRequestSection" aria-labelledby="degree-course-title">
                            <h2 id="degree-course-title"><FiBookOpen aria-hidden="true" /> {t("اطلاعات دوره", "Course information")}</h2>
                            <div className="degreeRequestGrid">
                                {courseFields.map((field) => <RequestField key={field.name} field={field} value={formFields[field.name]} onChange={changeField} />)}
                                <div className="degreeRequestField degreeRequestNotes">
                                    <label htmlFor="degree-request-notes">{t("توضیحات (اختیاری)", "Notes (optional)")}</label>
                                    <textarea id="degree-request-notes" name="notes" value={formFields.notes}
                                        onChange={(event) => changeField("notes", event.target.value)}
                                        placeholder={t("توضیحات تکمیلی خود را در این قسمت وارد کنید...", "Add any further details here...")} rows={3} maxLength={2000} />
                                </div>
                            </div>
                        </section>

                        <button type="button" className="degreeRequestSubmit">{t("ثبت درخواست مدرک", "Submit certificate request")}<FiArrowLeft aria-hidden="true" /></button>
                    </form>

                    <aside className="degreeRequestAdvice" aria-labelledby="degree-advice-title">
                        <PiCertificateLight className="degreeRequestCertificateIcon" aria-hidden="true" />
                        <h2 id="degree-advice-title">{t("پیش از تکمیل فرم", "Before completing the form")}</h2>
                        <ol>
                            {(isEnglish ? formAdviceEn : formAdvice).map((advice, index) => <li key={advice}><span aria-hidden="true">{(index + 1).toLocaleString(isEnglish ? "en-US" : "fa-IR", { minimumIntegerDigits: 2 })}</span><p>{advice}</p></li>)}
                        </ol>
                        <Link to="/degree" className="degreeRequestBack">{t("بازگشت به راهنمای مدرک", "Back to the certificate guide")}<FiArrowLeft aria-hidden="true" /></Link>
                    </aside>
                </div>
            </div>
        </main>
    );
}
