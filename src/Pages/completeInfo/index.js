import { useContext, useEffect, useState } from "react";
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
import { fetchDataFromApi, updateAccountData } from "../../utils/api";

// Persian (Jalali) date picker
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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

const CompleteInfo = () => {
    const context = useContext(MyContext);
    const history = useNavigate();

    // ✅ Read :id from the URL
    const { id: userIdFromUrl } = useParams();

    // ✅ Read returnTo from the URL (e.g. ?returnTo=%2Fcourse%2Fabc)
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get("returnTo");

    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

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
        const token = localStorage.getItem("token");
        if (!token) {
            history("/login");
            return;
        }

        if (!userIdFromUrl) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شناسه کاربر در آدرس پیدا نشد!",
            });
            setIsFetching(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetchDataFromApi(`/api/client/${userIdFromUrl}`);
                if (res && !res.isAxiosError && !res.error) {
                    setUser(res);
                    setFormData({
                        englishName: res.englishName || "",
                        englishLastName: res.englishLastName || "",
                        nationalCode: toEnglishDigits(res.nationalCode) || "",
                        birthdate: toEnglishDigits(res.birthdate) || "",
                    });
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "اطلاعات کاربر پیدا نشد!",
                    });
                }
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchUser();
    }, [userIdFromUrl, history]);

    // ============================================
    // Handlers
    // ============================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "nationalCode" ? toEnglishDigits(value) : value,
        }));
    };

    const handleBirthdateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            birthdate: date ? toEnglishDigits(date.format("YYYY/MM/DD")) : "",
        }));
    };

    // ============================================
    // Validation
    // ============================================
    const validate = () => {
        const { nationalCode, birthdate } = formData;

        if (nationalCode && !/^\d{10}$/.test(nationalCode)) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "کد ملی باید ۱۰ رقم باشد!",
            });
            return false;
        }

        if (birthdate && !/^\d{4}\/\d{2}\/\d{2}$/.test(birthdate)) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "تاریخ تولد معتبر نیست!",
            });
            return false;
        }

        return true;
    };

    // ============================================
    // Save — uses updateAccountData (PUT with axios)
    // ============================================
    const handleSave = async () => {
        if (!validate()) return;

        // ✅ Priority: URL param → user object → localStorage
        const userId =
            userIdFromUrl ||
            user?._id ||
            user?.id ||
            user?.userId ||
            localStorage.getItem("userId");

        if (!userId) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شناسه کاربر پیدا نشد! لطفاً دوباره وارد شوید.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await updateAccountData(
                `/api/client/${userId}`,
                {
                    name: user.name,
                    lastName: user.lastName,
                    phone: user.phone,
                    email: user.email,
                    englishName: formData.englishName,
                    englishLastName: formData.englishLastName,
                    nationalCode: toEnglishDigits(formData.nationalCode),
                    birthdate: toEnglishDigits(formData.birthdate),
                }
            );

            if (res?.error === true || res?.isAxiosError) {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res?.msg || "مشکلی در ذخیره اطلاعات وجود دارد!",
                });
                return;
            }

            const updatedUser = { ...user, ...formData, userId };
            setUser(updatedUser);

            // Only update localStorage if this is the logged-in user
            const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (
                cachedUser?.userId === userId ||
                cachedUser?._id === userId ||
                cachedUser?.id === userId
            ) {
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }

            context.setAlertBox({
                open: true,
                error: false,
                msg: "اطلاعات با موفقیت ذخیره شد!",
            });

            // ✅ Respect returnTo if present, else go to account page
            setTimeout(() => {
                if (returnTo) {
                    history(decodeURIComponent(returnTo));
                } else {
                    history(`/accountPage/${userId}`);
                }
            }, 1500);
        } catch (err) {
            console.error("Save failed:", err);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "مشکلی در ارتباط با سرور وجود دارد!",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Respect returnTo on cancel too
    const handleCancel = () => {
        if (returnTo) {
            history(decodeURIComponent(returnTo));
        } else {
            history(`/accountPage/${userIdFromUrl}`);
        }
    };

    // ============================================
    // Render
    // ============================================
    return (
        <div className="container">
            <div className="ciPage">

                <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb">
                    <Link to="/"><b> خانه </b></Link> /
                    <Link to={`/accountPage/${userIdFromUrl}`}><b>حساب کاربری</b></Link> /
                    <Link to=""><b>تکمیل اطلاعات</b></Link>
                </p>

                <div className="ciCard">

                    <div className="ciCardHeader">
                        <div className="ciCardTitle">
                            <HiOutlineUser />
                            <h4>تکمیل اطلاعات کاربری</h4>
                        </div>
                    </div>

                    <div className="ciCardBody">

                        <p className="ciDescription">
                            لطفاً اطلاعات زیر را تکمیل کنید. این اطلاعات برای صدور گواهینامه و
                            ارتباطات رسمی استفاده می‌شود.
                        </p>

                        {isFetching ? (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <p>در حال بارگذاری اطلاعات...</p>
                            </div>
                        ) : (
                            <>
                                <div className="ciGrid">

                                    <div className="ciField">
                                        <label className="ciLabel">
                                            <HiOutlineUser />
                                            نام به انگلیسی
                                        </label>
                                        <input
                                            type="text"
                                            name="englishName"
                                            value={formData.englishName}
                                            onChange={handleInputChange}
                                            className="ciInput"
                                            dir="ltr"
                                        />
                                    </div>

                                    <div className="ciField">
                                        <label className="ciLabel">
                                            <HiOutlineUser />
                                            نام خانوادگی به انگلیسی
                                        </label>
                                        <input
                                            type="text"
                                            name="englishLastName"
                                            value={formData.englishLastName}
                                            onChange={handleInputChange}
                                            className="ciInput"
                                            dir="ltr"
                                        />
                                    </div>

                                    <div className="ciField">
                                        <label className="ciLabel">
                                            <HiOutlineIdentification />
                                            کد ملی
                                        </label>
                                        <input
                                            type="text"
                                            name="nationalCode"
                                            value={formData.nationalCode}
                                            onChange={handleInputChange}
                                            className="ciInput"
                                            placeholder="ده رقمی"
                                            dir="ltr"
                                            maxLength="10"
                                        />
                                    </div>

                                    <div className="ciField">
                                        <label className="ciLabel">
                                            <HiOutlineCalendar />
                                            تاریخ تولد
                                        </label>
                                        <DatePicker
                                            value={formData.birthdate}
                                            onChange={handleBirthdateChange}
                                            calendar={persian}
                                            locale={persian_fa}
                                            calendarPosition="bottom-center"
                                            containerStyle={{ width: "100%" }}
                                            containerClassName="ciDateContainer"
                                            inputClass="ciInput"
                                            format="YYYY/MM/DD"
                                            minDate="1300/01/01"
                                            maxDate={new Date()}
                                            digits={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                                        />
                                    </div>

                                </div>

                                <div className="ciActions">
                                    <Button className="ciSaveBtn" onClick={handleSave} disabled={isLoading}>
                                        <FiSave />
                                        {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                                    </Button>
                                    <Button className="ciCancelBtn" onClick={handleCancel}>
                                        <FiX />
                                        انصراف
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
