import { customerMessage } from "./customerMessages";
import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDataFromApi, updateAccountData, isClientResponse, readStoredSession, toStoredUser } from "../../utils/api";
import "./accountPage.css";

import { VscAccount } from "react-icons/vsc";
import { FiEdit2 } from "react-icons/fi";
import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineIdentification,
} from "react-icons/hi";
import { FiSave, FiX } from "react-icons/fi";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";

// Persian (Jalali) date picker
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import persian_en from "react-date-object/locales/persian_en";

// Helper: convert Persian/Arabic digits → English digits
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

const pageMessages = {
    "لطفاً برای مشاهده اطلاعات، دوباره وارد حساب کاربری خود شوید.": "Please sign in again to view your profile.",
    "شما به اطلاعات این حساب کاربری دسترسی ندارید.": "You do not have access to this account.",
    "نشست شما تغییر کرده است. اطلاعات حساب را دوباره دریافت کنید.": "Your session changed. Reload your profile.",
    "نشست شما تغییر کرده است. حساب کاربری فعلی خود را باز کنید.": "Your session changed. Open your current account.",
    "نشست شما تغییر کرده است. لطفاً دوباره وارد شوید.": "Your session changed. Please sign in again.",
    "این حساب کاربری در سامانه پیدا نشد. لطفاً دوباره وارد شوید.": "This account could not be found. Please sign in again.",
    "نشست شما معتبر نیست. لطفاً دوباره وارد شوید.": "Your session is invalid. Please sign in again.",
    "تعداد درخواست‌ها زیاد است. چند لحظه دیگر دوباره تلاش کنید.": "Too many requests. Please try again shortly.",
    "دریافت اطلاعات حساب انجام نشد. اتصال خود را بررسی و دوباره تلاش کنید.": "Your profile could not be loaded. Check your connection and try again."
};

const AccountPage = () => {
    const { t, dir, isEnglish } = useLanguage();

    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', lastName: '', email: '' });
    const context = useContext(MyContext);
    const { setUser: setContextUser, setIsLoggedIn, setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar } = context;
    const [isFetching, setIsFetching] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [loadAttempt, setLoadAttempt] = useState(0);
    const requestVersion = useRef(0);
    const savePending = useRef(false);

    useEffect(() => {
        setIsShowNavbar?.(true);
        setIsShowFooter?.(true);
        setIsShowCalenderBar?.(true);
    }, [setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar]);

    // ✅ New state for the 4 extra fields
    const [extraData, setExtraData] = useState({
        englishName: "",
        englishLastName: "",
        nationalCode: "",
        birthdate: "",
    });

    useEffect(() => {
        let active = true;
        const controller = new AbortController();
        requestVersion.current += 1;
        savePending.current = false;
        setIsLoading(false);
        setUser(null);
        setIsEditing(false);
        setLoadError(null);
        setIsFetching(true);

        const clearSession = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoggedIn?.(false);
            setContextUser?.({ name: '', lastName: '', email: '', userId: '' });
        };
        const session = readStoredSession();
        if (!session) {
            clearSession();
            setLoadError({ kind: 'session', message: "لطفاً برای مشاهده اطلاعات، دوباره وارد حساب کاربری خود شوید." });
            setIsFetching(false);
        } else if (session.user.userId !== id) {
            setLoadError({ kind: 'forbidden', message: "شما به اطلاعات این حساب کاربری دسترسی ندارید.", accountId: session.user.userId });
            setIsFetching(false);
        } else {
            const sessionChanged = () => {
                const current = readStoredSession();
                if (current?.token === session.token && current.user.userId === session.user.userId) return false;
                if (current?.user.userId === id) {
                    setLoadError({ kind: 'request', message: "نشست شما تغییر کرده است. اطلاعات حساب را دوباره دریافت کنید." });
                } else if (current) {
                    setLoadError({ kind: 'forbidden', accountId: current.user.userId,
                        message: "نشست شما تغییر کرده است. حساب کاربری فعلی خود را باز کنید." });
                } else {
                    setLoadError({ kind: 'session', message: "نشست شما تغییر کرده است. لطفاً دوباره وارد شوید." });
                }
                return true;
            };
            fetchDataFromApi(`/api/client/${id}`, { throwOnError: true, signal: controller.signal }).then((profile) => {
                if (!active || sessionChanged()) return;
                if (!isClientResponse(profile, id)) throw new Error('INVALID_CLIENT_RESPONSE');
                setUser(profile);
                setFormData({ name: profile.name, lastName: profile.lastName || '', email: profile.email || '' });
                setExtraData({
                    englishName: profile.englishName || '',
                    englishLastName: profile.englishLastName || '',
                    nationalCode: toEnglishDigits(profile.nationalCode) || '',
                    birthdate: toEnglishDigits(profile.birthdate) || '',
                });
            }).catch((error) => {
                if (!active || controller.signal.aborted || sessionChanged()) return;
                const status = error.status ?? error.response?.status;
                if (status === 404 || status === 401) {
                    clearSession();
                    setLoadError({ kind: 'session', message: status === 404
                        ? "این حساب کاربری در سامانه پیدا نشد. لطفاً دوباره وارد شوید."
                        : "نشست شما معتبر نیست. لطفاً دوباره وارد شوید." });
                } else {
                    setLoadError({ kind: 'request', message: status === 429
                        ? "تعداد درخواست‌ها زیاد است. چند لحظه دیگر دوباره تلاش کنید."
                        : "دریافت اطلاعات حساب انجام نشد. اتصال خود را بررسی و دوباره تلاش کنید." });
                }
            }).finally(() => {
                if (active) setIsFetching(false);
            });
        }
        return () => {
            active = false;
            controller.abort();
            requestVersion.current += 1;
        };
    }, [id, loadAttempt, setContextUser, setIsLoggedIn]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handler for the extra 4 fields
    const handleExtraInputChange = (e) => {
        const { name, value } = e.target;
        setExtraData((prev) => ({
            ...prev,
            [name]: name === "nationalCode" ? toEnglishDigits(value) : value,
        }));
    };

    // ✅ Birthdate handler
    const handleBirthdateChange = (date) => {
        setExtraData((prev) => ({
            ...prev,
            birthdate: date ? toEnglishDigits(date.format("YYYY/MM/DD")) : "",
        }));
    };

    const handleEditToggle = () => {
        if (user && !isFetching && !loadError) setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            lastName: user?.lastName || '',
            email: user?.email || ''
        });
        // ✅ Reset extra fields too
        setExtraData({
            englishName: user?.englishName || '',
            englishLastName: user?.englishLastName || '',
            nationalCode: toEnglishDigits(user?.nationalCode) || '',
            birthdate: toEnglishDigits(user?.birthdate) || '',
        });
        setIsEditing(false);
    };

    // ✅ Validation for the 4 extra fields
    const validateExtra = () => {
        const { nationalCode, birthdate } = extraData;

        if (nationalCode && !/^\d{10}$/.test(nationalCode)) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("کد ملی باید ۱۰ رقم باشد!", "National ID must contain 10 digits.")
            });
            return false;
        }

        if (birthdate && !/^\d{4}\/\d{2}\/\d{2}$/.test(birthdate)) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("تاریخ تولد معتبر نیست!", "Enter a valid date of birth.")
            });
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (savePending.current || isFetching || loadError || !isClientResponse(user, id)) return;
        const session = readStoredSession();
        if (!session || session.user.userId !== id) {
            context.setAlertBox({ open: true, error: true, msg: t("نشست شما تغییر کرده است. دوباره وارد حساب کاربری خود شوید.", "Your session changed. Please sign in again.") });
            return;
        }
        if (!formData.name.trim() || !formData.lastName.trim()) {
            context.setAlertBox({ open: true, error: true, msg: t("لطفاً نام و نام خانوادگی خود را وارد کنید!", "Enter your first and last name.") });
            return;
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            context.setAlertBox({ open: true, error: true, msg: t("لطفاً یک ایمیل معتبر وارد کنید!", "Enter a valid email address.") });
            return;
        }
        if (!validateExtra()) return;

        const version = requestVersion.current;
        savePending.current = true;
        setIsLoading(true);
        try {
            const response = await updateAccountData(`/api/client/${id}`, {
                name: formData.name.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                englishName: extraData.englishName.trim(),
                englishLastName: extraData.englishLastName.trim(),
                nationalCode: toEnglishDigits(extraData.nationalCode),
                birthdate: toEnglishDigits(extraData.birthdate),
            });
            if (requestVersion.current !== version) return;
            const currentSession = readStoredSession();
            if (!currentSession || currentSession.user.userId !== id || currentSession.token !== session.token) {
                context.setAlertBox({ open: true, error: true, msg: t("نشست شما تغییر کرده است. برای مشاهده نتیجه دوباره وارد شوید.", "Your session changed. Sign in again to view the result.") });
                return;
            }
            if (!isClientResponse(response, id)) throw new Error('INVALID_CLIENT_RESPONSE');

            const storedUser = toStoredUser(response);
            localStorage.setItem('user', JSON.stringify(storedUser));
            setContextUser?.(storedUser);
            setUser(response);
            setFormData({ name: response.name, lastName: response.lastName || '', email: response.email || '' });
            setExtraData({
                englishName: response.englishName || '',
                englishLastName: response.englishLastName || '',
                nationalCode: toEnglishDigits(response.nationalCode) || '',
                birthdate: toEnglishDigits(response.birthdate) || '',
            });
            setIsEditing(false);
            context.setAlertBox({ open: true, error: false, msg: t("اطلاعات با موفقیت ویرایش شد.", "Your profile was updated successfully.") });
        } catch (error) {
            if (requestVersion.current !== version) return;
            context.setAlertBox({
                open: true, error: true,
                msg: customerMessage(t, error?.msg || t("ذخیره اطلاعات انجام نشد. تغییرات شما حفظ شده است؛ دوباره تلاش کنید.", "Your profile could not be saved. Your changes are preserved; please try again.")),
            });
        } finally {
            if (requestVersion.current === version) {
                savePending.current = false;
                setIsLoading(false);
            }
        }
    };

    const initials = `${user?.name?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`;
    return (
        <>
            <div className="container" dir={dir}>
                <div className="accountPage">

                    <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb">
                        <Link to="/"><b> {t("خانه", "Home")} </b></Link> /
                        <Link to={`/accountPage/${id}`}><b>{t("حساب کاربری", "Account")}</b></Link> /
                        <span><b>{user ? `${user.name} ${user.lastName || ''}`.trim() : t("اطلاعات کاربر", "Your profile")}</b></span>
                    </p>

                    <div className="accountBox">

                        <div className="accountBoxHeader">
                            <div className="accountHeaderTitle">
                                <VscAccount />
                                <h4>{t("اطلاعات کاربر", "Your profile")}</h4>
                            </div>
                            {
                                user && !isFetching && !loadError && !isEditing && (
                                    <Button className="editProfileBtn" onClick={handleEditToggle}>
                                        <FiEdit2 />
                                        {t("ویرایش اطلاعات", "Edit profile")}
                                    </Button>
                                )
                            }
                        </div>

                        {isFetching ? (
                            <div className="accountLoadState" role="status">{t("در حال دریافت اطلاعات حساب...", "Loading your profile...")}</div>
                        ) : loadError ? (
                            <div className="accountLoadState accountLoadError" role="alert">
                                <p>{t(loadError.message, pageMessages[loadError.message])}</p>
                                {loadError.kind === 'request' ? (
                                    <Button className="accountSaveBtn" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>{t("تلاش دوباره", "Try again")}</Button>
                                ) : (
                                    <Link className="accountSessionLink" to={loadError.kind === 'forbidden'
                                        ? `/accountPage/${loadError.accountId}`
                                        : `/logIn?returnTo=${encodeURIComponent(`/accountPage/${id}`)}`}>
                                        {loadError.kind === 'forbidden' ? t("حساب کاربری من", "My account") : t("ورود دوباره", "Sign in again")}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="accountProfileHeader">
                                    <div className="accountAvatar">
                                        <span>{initials}</span>
                                    </div>
                                    <div className="accountProfileMeta">
                                        <h5>{user?.name} {user?.lastName}</h5>
                                        <span className="accountJoinDate">
                                            <HiOutlineCalendar />
                                            {t("عضویت از", "Member since")} {user?.dateCreated ? (isEnglish ? toEnglishDigits(user.dateCreated) : user.dateCreated) : '-'}
                                        </span>
                                    </div>
                                </div>

                                <div className="accountFieldsGrid">

                                    <div className="accountField">
                                        <label htmlFor="account-name">
                                            <HiOutlineUser />
                                            {t("نام", "First name")}
                                        </label>
                                        {
                                            isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="account-name"
                                                    disabled={isLoading}
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="accountInput"
                                                />
                                            ) : (
                                                <p>{user?.name || '-'}</p>
                                            )
                                        }
                                    </div>

                                    <div className="accountField">
                                        <label htmlFor="account-lastName">
                                            <HiOutlineUser />
                                            {t("نام خانوادگی", "Last name")}
                                        </label>
                                        {
                                            isEditing ? (
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="account-lastName"
                                                    disabled={isLoading}
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="accountInput"
                                                />
                                            ) : (
                                                <p>{user?.lastName || '-'}</p>
                                            )
                                        }
                                    </div>

                                    <div className="accountField">
                                        <label>
                                            <HiOutlinePhone />
                                            {t("شماره تماس", "Phone number")}
                                        </label>
                                        <p className="accountFieldLocked">
                                            {user?.phone || '-'}
                                            <span className="lockedBadge">{t("غیرقابل ویرایش", "Read only")}</span>
                                        </p>
                                    </div>

                                    <div className="accountField">
                                        <label htmlFor="account-email">
                                            <HiOutlineMail />
                                            {t("آدرس ایمیل", "Email address")}
                                        </label>
                                        {
                                            isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="account-email"
                                                    disabled={isLoading}
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="accountInput"
                                                    placeholder={t("ایمیل خود را وارد کنید", "Enter your email address")}
                                                />
                                            ) : (
                                                <p>{user?.email || '-'}</p>
                                            )
                                        }
                                    </div>

                                    {/* ============================================ */}
                                    {/* ✅ NEW: The 4 extra fields                   */}
                                    {/* ============================================ */}

                                    <div className="accountField">
                                        <label htmlFor="account-englishName">
                                            <HiOutlineUser />
                                            {t("نام به انگلیسی", "First name in English")}
                                        </label>
                                        {
                                            isEditing ? (
                                                <input
                                                    type="text"
                                                    name="englishName"
                                                    id="account-englishName"
                                                    disabled={isLoading}
                                                    value={extraData.englishName}
                                                    onChange={handleExtraInputChange}
                                                    className="accountInput"
                                                />
                                            ) : (
                                                <p>{user?.englishName || '-'}</p>
                                            )
                                        }
                                    </div>

                                    <div className="accountField">
                                        <label htmlFor="account-englishLastName">
                                            <HiOutlineUser />
                                            {t("نام خانوادگی به انگلیسی", "Last name in English")}
                                        </label>
                                        {
                                            isEditing ? (
                                                <input
                                                    type="text"
                                                    name="englishLastName"
                                                    id="account-englishLastName"
                                                    disabled={isLoading}
                                                    value={extraData.englishLastName}
                                                    onChange={handleExtraInputChange}
                                                    className="accountInput"
                                                />
                                            ) : (
                                                <p>{user?.englishLastName || '-'}</p>
                                            )
                                        }
                                    </div>

                                    <div className="accountField">
                                        <label htmlFor="account-nationalCode">
                                            <HiOutlineIdentification />
                                            {t("کد ملی", "National ID")}
                                        </label>
                                        {
                                            isEditing ? (
                                                <input
                                                    type="text"
                                                    name="nationalCode"
                                                    id="account-nationalCode"
                                                    disabled={isLoading}
                                                    value={extraData.nationalCode}
                                                    onChange={handleExtraInputChange}
                                                    className="accountInput"
                                                    placeholder={t("ده رقمی", "10 digits")}
                                                    maxLength="10"
                                                />
                                            ) : (
                                                <p>{user?.nationalCode || '-'}</p>
                                            )
                                        }
                                    </div>

                                    <div className="accountField">
                                        <label htmlFor="account-birthdate">
                                            <HiOutlineCalendar />
                                            {t("تاریخ تولد", "Date of birth")}
                                        </label>
                                        {
                                            isEditing ? (
                                                <DatePicker
                                                    id="account-birthdate"
                                                    disabled={isLoading}
                                                    value={extraData.birthdate}
                                                    onChange={handleBirthdateChange}
                                                    calendar={persian}
                                                    locale={isEnglish ? persian_en : persian_fa}
                                                    calendarPosition="bottom-center"
                                                    containerStyle={{ width: "100%" }}
                                                    containerClassName="ciDateContainer"
                                                    inputClass="accountInput"
                                                    format="YYYY/MM/DD"
                                                    minDate="1300/01/01"
                                                    maxDate={new Date()}
                                                    digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                                                />
                                            ) : (
                                                <p>{user?.birthdate || '-'}</p>
                                            )
                                        }
                                    </div>

                                </div>

                                {
                                    isEditing && (
                                        <div className="accountEditActions">
                                            <Button className="accountCancelBtn" onClick={handleCancel} disabled={isLoading}>
                                                <FiX />
                                                {t("انصراف", "Cancel")}
                                            </Button>
                                            <Button className="accountSaveBtn" onClick={handleSave} disabled={isLoading}>
                                                <FiSave />
                                                {isLoading ? t("در حال ذخیره...", "Saving...") : t("ذخیره تغییرات", "Save changes")}
                                            </Button>
                                        </div>
                                    )
                                }

                            </>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default AccountPage;
