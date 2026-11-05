import { customerMessage } from "../account/customerMessages";
import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MyContext } from "../../App";
import Button from "@mui/material/Button";
import {
    HiOutlineUser,
    HiOutlineCalendar,
    HiOutlineIdentification,
} from "react-icons/hi";
import { FiSave, FiX } from "react-icons/fi";

// Use your existing api helpers
import { fetchDataFromApi, isClientResponse, readStoredSession, safeReturnTo, toStoredUser, updateAccountData } from "../../utils/api";

// Persian (Jalali) date picker
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import persian_en from "react-date-object/locales/persian_en";

// ============================================
// Helper: convert Persian/Arabic digits → English digits
// ============================================
const toEnglishDigits = (str) => {
    if (!str) return str;
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    return String(str).replace(/[۰-۹٠-٩]/g, (ch) => {
        const p = persianDigits.indexOf(ch);
        if (p > -1) return String(p);
        const a = arabicDigits.indexOf(ch);
        if (a > -1) return String(a);
        return ch;
    });
};

const completionDetails = (user) => ({
    englishName: typeof user?.englishName === "string" ? user.englishName.trim() : "",
    englishLastName: typeof user?.englishLastName === "string" ? user.englishLastName.trim() : "",
    nationalCode: toEnglishDigits(user?.nationalCode || "").trim(),
    birthdate: toEnglishDigits(user?.birthdate || "").trim(),
});

function validateDetails(details) {
    const errors = {};
    if (!details.englishName.trim()) errors.englishName = "نام به انگلیسی را وارد کنید.";
    else if (!/^[A-Za-z]+(?:[ '’-][A-Za-z]+)*$/.test(details.englishName.trim())) errors.englishName = "نام را با حروف انگلیسی وارد کنید.";
    if (!details.englishLastName.trim()) errors.englishLastName = "نام خانوادگی به انگلیسی را وارد کنید.";
    else if (!/^[A-Za-z]+(?:[ '’-][A-Za-z]+)*$/.test(details.englishLastName.trim())) errors.englishLastName = "نام خانوادگی را با حروف انگلیسی وارد کنید.";
    if (!/^\d{10}$/.test(details.nationalCode)) errors.nationalCode = "کد ملی باید ۱۰ رقم باشد.";
    if (!/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/.test(details.birthdate)) errors.birthdate = "تاریخ تولد را کامل و معتبر وارد کنید.";
    return errors;
}

const pageMessages = {
    "شما دسترسی به اطلاعات این حساب کاربری ندارید.": "You do not have access to this account.",
    "دریافت اطلاعات کاربر انجام نشد. دوباره تلاش کنید.": "Your profile could not be loaded. Please try again.",
    "حساب کاربری معتبر نیست. دوباره وارد شوید.": "Your account is invalid. Please sign in again.",
    "نام به انگلیسی را وارد کنید.": "Enter your first name in English.",
    "نام را با حروف انگلیسی وارد کنید.": "Use English letters for your first name.",
    "نام خانوادگی به انگلیسی را وارد کنید.": "Enter your last name in English.",
    "نام خانوادگی را با حروف انگلیسی وارد کنید.": "Use English letters for your last name.",
    "کد ملی باید ۱۰ رقم باشد.": "National ID must contain 10 digits.",
    "تاریخ تولد را کامل و معتبر وارد کنید.": "Enter a complete, valid date of birth."
};

const CompleteInfo = () => {
    const { t, dir, isEnglish } = useLanguage();
    const context = useContext(MyContext);
    const history = useNavigate();
    const { setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar } = context;

    useEffect(() => {
        setIsShowNavbar?.(true);
        setIsShowFooter?.(true);
        setIsShowCalenderBar?.(true);
    }, [setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar]);

    // ✅ Read :id from the URL
    const { id: userIdFromUrl } = useParams();

    // ✅ Read returnTo from the URL (e.g. ?returnTo=%2Fcourse%2Fabc)
    const [searchParams] = useSearchParams();
    const ownId = readStoredSession()?.user.userId;
    const returnTo = safeReturnTo(searchParams.get("returnTo"), ownId ? `/accountPage/${ownId}` : "/");

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSaved, setIsSaved] = useState(false);
    const submitLock = useRef(false);
    const currentId = useRef(userIdFromUrl);
    const mounted = useRef(true);
    const successTimer = useRef();
    currentId.current = userIdFromUrl;
    const { setIsLoggedIn, setUser: setContextUser } = context;

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; clearTimeout(successTimer.current); };
    }, []);

    const [formData, setFormData] = useState({
        englishName: "",
        englishLastName: "",
        nationalCode: "",
        birthdate: "", // stored as English digits, e.g. "1370/05/12"
    });

    // ============================================
    // Load user from the API using :id from URL
    // ============================================
    useEffect(() => {
        const session = readStoredSession();
        if (!session) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn?.(false);
            setContextUser?.({ name: "", lastName: "", email: "", userId: "" });
            history(`/logIn?returnTo=${encodeURIComponent(`/complete-info/${userIdFromUrl || ""}`)}`, { replace: true });
            return;
        }
        clearTimeout(successTimer.current);
        submitLock.current = false;
        setIsLoading(false);
        setUser(null);
        setIsSaved(false);
        setErrors({});
        if (!userIdFromUrl || session.user.userId !== userIdFromUrl) {
            setLoadError("شما دسترسی به اطلاعات این حساب کاربری ندارید.");
            setIsFetching(false);
            return;
        }
        const controller = new AbortController();
        setIsFetching(true);
        setLoadError("");
        const fetchUser = async () => {
            try {
                const res = await fetchDataFromApi(`/api/client/${userIdFromUrl}`, { signal: controller.signal, throwOnError: true });
                if (controller.signal.aborted) return;
                if (!isClientResponse(res, userIdFromUrl)) throw new Error("INVALID_PROFILE");
                setUser(res);
                setFormData(completionDetails(res));
            } catch (err) {
                if (!controller.signal.aborted) setLoadError(err.msg || "دریافت اطلاعات کاربر انجام نشد. دوباره تلاش کنید.");
            } finally {
                if (!controller.signal.aborted) setIsFetching(false);
            }
        };

        fetchUser();
        return () => controller.abort();
    }, [userIdFromUrl, history, loadAttempt, setIsLoggedIn, setContextUser]);

    // ============================================
    // Handlers
    // ============================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "nationalCode" ? toEnglishDigits(value) : value,
        }));
        setErrors((previous) => ({ ...previous, [name]: undefined }));
    };

    const handleBirthdateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            birthdate: date ? toEnglishDigits(date.format("YYYY/MM/DD")) : "",
        }));
        setErrors((previous) => ({ ...previous, birthdate: undefined }));
    };

    // ============================================
    // Validation
    // ============================================
    // ============================================
    // Save — uses updateAccountData (PUT with axios)
    // ============================================
    const handleSave = async () => {
        if (submitLock.current || isFetching || !user || isSaved) return;
        const session = readStoredSession();
        const userId = userIdFromUrl;
        if (!session || session.user.userId !== userId || !isClientResponse(user, userId)) {
            setLoadError("حساب کاربری معتبر نیست. دوباره وارد شوید.");
            return;
        }
        const details = completionDetails(formData);
        const fieldErrors = validateDetails(details);
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length) return;
        submitLock.current = true;
        setIsLoading(true);
        let leaving = false;
        try {
            // Only update the four completion fields; do not resend stale phone/account fields.
            const res = await updateAccountData(`/api/client/${userId}`, details);
            if (!mounted.current || currentId.current !== userId) return;
            if (!isClientResponse(res, userId) || Object.keys(validateDetails(completionDetails(res))).length) {
                throw new Error("INVALID_PROFILE");
            }
            if (readStoredSession()?.user.userId !== userId) {
                throw new Error("SESSION_CHANGED");
            }
            const updatedUser = toStoredUser(res);
            setUser(res);
            setFormData(completionDetails(res));
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setContextUser?.(updatedUser);
            context.setAlertBox({
                open: true,
                error: false,
                msg: t("اطلاعات با موفقیت ذخیره شد!", "Your details were saved successfully."),
            });
            leaving = true;
            setIsSaved(true);
            successTimer.current = setTimeout(() => history(returnTo, { replace: true }), 1500);
        } catch (err) {
            if (mounted.current && currentId.current === userId) context.setAlertBox({
                open: true,
                error: true,
                msg: customerMessage(t, err.msg || t("ذخیره اطلاعات انجام نشد. دوباره تلاش کنید.", "Your details could not be saved. Please try again.")),
            });
        } finally {
            if (!leaving) submitLock.current = false;
            if (mounted.current && currentId.current === userId) setIsLoading(false);
        }
    };

    // ✅ Respect returnTo on cancel too
    const handleCancel = () => {
        if (!isLoading) history(returnTo);
    };

    // ============================================
    // Render
    // ============================================
    return (
        <div className="container" dir={dir}>
            <div className="ciPage">

                <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb">
                    <Link to="/"><b> {t("خانه", "Home")} </b></Link> /
                    <Link to={`/accountPage/${userIdFromUrl}`}><b>{t("حساب کاربری", "Account")}</b></Link> /
                    <Link to=""><b>{t("تکمیل اطلاعات", "Complete profile")}</b></Link>
                </p>

                <div className="ciCard">

                    <div className="ciCardHeader">
                        <div className="ciCardTitle">
                            <HiOutlineUser />
                            <h4>{t("تکمیل اطلاعات کاربری", "Complete your profile")}</h4>
                        </div>
                    </div>

                    <div className="ciCardBody">

                        <p className="ciDescription">
                            {t("لطفاً اطلاعات زیر را تکمیل کنید. این اطلاعات برای صدور گواهینامه و ارتباطات رسمی استفاده می‌شود.", "Complete the details below. They are used for certificates and official communication.")}
                        </p>

                        {isFetching ? (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <p>{t("در حال بارگذاری اطلاعات...", "Loading your details...")}</p>
                            </div>
                        ) : loadError ? (
                            <div role="alert">
                                <p>{t(loadError, pageMessages[loadError])}</p>
                                <Button onClick={() => setLoadAttempt((previous) => previous + 1)}>{t("تلاش دوباره", "Try again")}</Button>
                                <Button onClick={handleCancel}>{t("بازگشت", "Back")}</Button>
                            </div>
                        ) : (
                            <>
                                <div className="ciGrid">

                                    <div className="ciField">
                                        <label className="ciLabel" htmlFor="complete-englishName">
                                            <HiOutlineUser />
                                            {t("نام به انگلیسی", "First name in English")}
                                        </label>
                                        <input
                                            id="complete-englishName"
                                            type="text"
                                            name="englishName"
                                            value={formData.englishName}
                                            onChange={handleInputChange}
                                            className="ciInput"
                                            dir="ltr"
                                            required disabled={isLoading || isSaved} maxLength={100}
                                            aria-invalid={Boolean(errors.englishName)}
                                            aria-describedby={errors.englishName ? "complete-englishName-error" : undefined}
                                        />
                                        {errors.englishName ? <span id="complete-englishName-error" className="text-danger">{t(errors.englishName, pageMessages[errors.englishName])}</span> : null}
                                    </div>

                                    <div className="ciField">
                                        <label className="ciLabel" htmlFor="complete-englishLastName">
                                            <HiOutlineUser />
                                            {t("نام خانوادگی به انگلیسی", "Last name in English")}
                                        </label>
                                        <input
                                            id="complete-englishLastName"
                                            type="text"
                                            name="englishLastName"
                                            value={formData.englishLastName}
                                            onChange={handleInputChange}
                                            className="ciInput"
                                            dir="ltr"
                                            required disabled={isLoading || isSaved} maxLength={100}
                                            aria-invalid={Boolean(errors.englishLastName)}
                                            aria-describedby={errors.englishLastName ? "complete-englishLastName-error" : undefined}
                                        />
                                        {errors.englishLastName ? <span id="complete-englishLastName-error" className="text-danger">{t(errors.englishLastName, pageMessages[errors.englishLastName])}</span> : null}
                                    </div>

                                    <div className="ciField">
                                        <label className="ciLabel" htmlFor="complete-nationalCode">
                                            <HiOutlineIdentification />
                                            {t("کد ملی", "National ID")}
                                        </label>
                                        <input
                                            id="complete-nationalCode"
                                            type="text"
                                            name="nationalCode"
                                            value={formData.nationalCode}
                                            onChange={handleInputChange}
                                            className="ciInput"
                                            placeholder={t("ده رقمی", "10 digits")}
                                            dir="ltr"
                                            maxLength="10"
                                            required disabled={isLoading || isSaved} inputMode="numeric"
                                            aria-invalid={Boolean(errors.nationalCode)}
                                            aria-describedby={errors.nationalCode ? "complete-nationalCode-error" : undefined}
                                        />
                                        {errors.nationalCode ? <span id="complete-nationalCode-error" className="text-danger">{t(errors.nationalCode, pageMessages[errors.nationalCode])}</span> : null}
                                    </div>

                                    <div className="ciField">
                                        <label className="ciLabel" htmlFor="complete-birthdate">
                                            <HiOutlineCalendar />
                                            {t("تاریخ تولد", "Date of birth")}
                                        </label>
                                        <DatePicker
                                            id="complete-birthdate"
                                            value={formData.birthdate}
                                            onChange={handleBirthdateChange}
                                            calendar={persian}
                                            locale={isEnglish ? persian_en : persian_fa}
                                            calendarPosition="bottom-center"
                                            containerStyle={{ width: "100%" }}
                                            containerClassName="ciDateContainer"
                                            inputClass="ciInput"
                                            format="YYYY/MM/DD"
                                            minDate="1300/01/01"
                                            maxDate={new Date()}
                                            digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                                            required disabled={isLoading || isSaved}
                                        />
                                        {errors.birthdate ? <span id="complete-birthdate-error" className="text-danger">{t(errors.birthdate, pageMessages[errors.birthdate])}</span> : null}
                                    </div>

                                </div>

                                <div className="ciActions">
                                    <Button className="ciSaveBtn" onClick={handleSave} disabled={isLoading || isSaved}>
                                        <FiSave />
                                        {isLoading ? t("در حال ذخیره...", "Saving...") : t("ذخیره تغییرات", "Save changes")}
                                    </Button>
                                    <Button className="ciCancelBtn" onClick={handleCancel} disabled={isLoading || isSaved}>
                                        <FiX />
                                        {t("انصراف", "Cancel")}
                                    </Button>
                                </div>
                            </>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default CompleteInfo;
