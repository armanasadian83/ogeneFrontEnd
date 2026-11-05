import { useLanguage } from "../../i18n/LanguageContext";
import { customerMessage } from "../account/customerMessages";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiLock, FiUser } from "react-icons/fi";
import { MyContext } from "../../App";
import { postDataWithAuth } from "../../utils/api";
import { redirectToGateway } from "../../utils/redirectToGateway";
import SamanBankLogo from "../../assets/saman-bank-logo.png";
import "./checkout.css";

const fields = [
    { name: "firstName", label: "نام", labelEn: "First name", autoComplete: "given-name", maxLength: 80 },
    { name: "lastName", label: "نام خانوادگی", labelEn: "Last name", autoComplete: "family-name", maxLength: 80 },
    { name: "firstNameLatin", label: "نام به لاتین", labelEn: "First name (Latin)", autoComplete: "off", latin: true, maxLength: 100 },
    { name: "lastNameLatin", label: "نام خانوادگی به لاتین", labelEn: "Last name (Latin)", autoComplete: "off", latin: true, maxLength: 100 },
    { name: "nationalId", label: "کد ملی", labelEn: "National ID", numeric: true, maxLength: 10 },
    { name: "phone", label: "شماره تماس", labelEn: "Phone number", autoComplete: "tel-national", numeric: true, maxLength: 11 },
    { name: "address", label: "آدرس کامل", labelEn: "Full address", autoComplete: "street-address", multiline: true, maxLength: 2000 },
    { name: "postalCode", label: "کد پستی", labelEn: "Postal code", autoComplete: "postal-code", numeric: true, maxLength: 10 },
    { name: "city", label: "شهر", labelEn: "City", autoComplete: "address-level2", maxLength: 100 },
    { name: "notes", label: "توضیحات سفارش (اختیاری)", labelEn: "Order notes (optional)", multiline: true, optional: true, maxLength: 2000,
        placeholder: "در صورت نیاز، توضیح یا درخواست خاصی بنویسید..." },
];
const emptyDetails = Object.fromEntries(fields.map(({ name }) => [name, ""]));
const toEnglishDigits = (value) => String(value).replace(/[۰-۹٠-٩]/g, (digit) =>
    String("۰۱۲۳۴۵۶۷۸۹".includes(digit) ? "۰۱۲۳۴۵۶۷۸۹".indexOf(digit) : "٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
const formatPrice = (value, isEnglish = false) => Number(value).toLocaleString(isEnglish ? "en-US" : "fa-IR");
const fieldErrorMessages = {
    "نام را با حروف لاتین وارد کنید.": "Use Latin letters for this name.",
    "کد ملی باید ۱۰ رقم باشد.": "National ID must contain 10 digits.",
    "شماره تماس را با ۰۹ و در ۱۱ رقم وارد کنید.": "Enter an 11-digit phone number starting with 09.",
    "کد پستی باید ۱۰ رقم باشد.": "Postal code must contain 10 digits.",
    "این فیلد را به صورت متن وارد کنید.": "Enter text in this field.",
    "تکمیل این فیلد الزامی است.": "This field is required.",
    "متن واردشده معتبر نیست.": "The entered text is invalid.",
    "نام را فقط با حروف وارد کنید.": "Use letters only for this name.",
    "شماره تماس معتبر با ۰۹ وارد کنید.": "Enter a valid phone number starting with 09.",
};

function fieldErrorEnglish(field, message) {
    if (message === `${field.label} را وارد کنید.`) return `Enter ${field.labelEn.toLowerCase()}.`;
    const limit = message.match(/^حداکثر (\d+) کاراکتر مجاز است\.$/);
    return limit ? `Use no more than ${limit[1]} characters.` : fieldErrorMessages[message] || "Please check this field.";
}

function matchesCart(checkout, cart, total) {
    if (!Array.isArray(checkout.items) || !Array.isArray(checkout.cartItemIds)) return false;
    const ids = (items) => items.map(String).sort();
    const items = (rows) => rows.map((item) => JSON.stringify({
        productId: item.productId, productTitle: item.productTitle,
        quantity: Number(item.quantity), price: Number(item.price),
        subTotal: Number(item.price) * Number(item.quantity),
        typeCourse: item.typeCourse, image: item.image || "",
    })).sort();
    return checkout.totalToman === total
        && JSON.stringify(ids(checkout.cartItemIds)) === JSON.stringify(ids(cart.map((item) => item._id)))
        && JSON.stringify(items(checkout.items)) === JSON.stringify(items(cart));
}

function validate(details) {
    const errors = {};
    fields.forEach((field) => {
        const value = details[field.name].trim();
        if (!field.optional && !value) errors[field.name] = `${field.label} را وارد کنید.`;
        else if (field.latin && !/^[A-Za-z]+(?:[ '\u2019-][A-Za-z]+)*$/.test(value)) {
            errors[field.name] = "نام را با حروف لاتین وارد کنید.";
        }
    });
    if (details.nationalId && !/^\d{10}$/.test(details.nationalId)) errors.nationalId = "کد ملی باید ۱۰ رقم باشد.";
    if (details.phone && !/^09\d{9}$/.test(details.phone)) errors.phone = "شماره تماس را با ۰۹ و در ۱۱ رقم وارد کنید.";
    if (details.postalCode && !/^\d{10}$/.test(details.postalCode)) errors.postalCode = "کد پستی باید ۱۰ رقم باشد.";
    return errors;
}

async function fetchCheckout(signal) {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/checkout`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, signal,
        });
        return data;
    } catch (error) {
        if (axios.isCancel(error)) throw error;
        return { ...error.response?.data, success: false, unauthorized: error.response?.status === 401,
            message: error.response?.data?.message || "دریافت اطلاعات سفارش انجام نشد. دوباره تلاش کنید." };
    }
}

const pageMessages = {
    "دریافت اطلاعات سفارش انجام نشد.": "Your order could not be loaded.",
    "ذخیره اطلاعات سفارش انجام نشد. دوباره تلاش کنید.": "Your order details could not be saved. Please try again.",
    "سبد خرید تغییر کرده است. مبلغ و اقلام به‌روز شده را بررسی و دوباره تأیید کنید.": "Your cart has changed. Review the updated items and total, then confirm again.",
    "خطا در اتصال به درگاه پرداخت! دوباره تلاش کنید.": "Could not connect to the payment gateway. Please try again.",
    "ثبت اطلاعات سفارش کامل نشد. دوباره تلاش کنید.": "Your order details could not be completed. Please try again.",
    "خطا در ارتباط با سرور! دوباره تلاش کنید.": "Could not connect to the server. Please try again."
};

export default function Checkout() {
    const { t, dir, language, isEnglish, localize } = useLanguage();
    const { setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar, setIsBaleIconShown, setIsLoggedIn, setUser } = useContext(MyContext);
    const navigate = useNavigate();
    const [details, setDetails] = useState(emptyDetails);
    const [cart, setCart] = useState([]);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [needsCartRefresh, setNeedsCartRefresh] = useState(false);
    const submitLock = useRef(false);
    const formRef = useRef(null);
    let user;
    try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch { user = null; }
    const cartPath = user?.userId ? `/cart/${user.userId}` : "/";
    const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const hasPhysicalProducts = cart.some((item) => item.typeCourse === false);

    useEffect(() => {
        setIsShowNavbar(true);
        setIsShowFooter(true);
        setIsShowCalenderBar(false);
        setIsBaleIconShown(false);
        return () => {
            setIsShowNavbar(true);
            setIsShowFooter(true);
            setIsShowCalenderBar(true);
            setIsBaleIconShown(true);
        };
    }, [setIsShowNavbar, setIsShowFooter, setIsShowCalenderBar, setIsBaleIconShown]);

    useEffect(() => {
        const requireLogin = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn?.(false);
            setUser?.({ name: "", lastName: "", email: "", userId: "" });
            navigate("/logIn?returnTo=%2Fcheckout", { replace: true });
        };
        if (!localStorage.getItem("token")) {
            requireLogin();
            return;
        }
        const controller = new AbortController();
        setIsFetching(true);
        setMessage("");
        fetchCheckout(controller.signal).then((data) => {
            if (controller.signal.aborted) return;
            if (data.unauthorized) {
                requireLogin();
                return;
            }
            if (!data.success || !Array.isArray(data.cart)) {
                setMessage(data.message || "دریافت اطلاعات سفارش انجام نشد.");
                return;
            }
            setCart(data.cart);
            setNeedsCartRefresh(false);
            setDetails(Object.fromEntries(fields.map(({ name, numeric }) => {
                const value = data.checkout?.[name] ?? data.profile?.[name] ?? "";
                return [name, numeric ? toEnglishDigits(value) : String(value)];
            })));
        }).catch((error) => {
            if (!controller.signal.aborted) setMessage("دریافت اطلاعات سفارش انجام نشد. دوباره تلاش کنید.");
        }).finally(() => {
            if (!controller.signal.aborted) setIsFetching(false);
        });
        return () => controller.abort();
    }, [loadAttempt, navigate, setIsLoggedIn, setUser]);

    const refreshCart = async () => {
        const fresh = await fetchCheckout();
        if (fresh.success && Array.isArray(fresh.cart)) {
            setCart(fresh.cart);
            setNeedsCartRefresh(false);
        } else {
            setNeedsCartRefresh(true);
        }
    };

    const handleChange = (event, numeric) => {
        const { name, value } = event.target;
        setDetails((previous) => ({ ...previous, [name]: numeric ? toEnglishDigits(value) : value }));
        setErrors((previous) => ({ ...previous, [name]: undefined }));
    };

    const submit = async (event) => {
        event.preventDefault();
        if (submitLock.current || isFetching || needsCartRefresh || !cart.length) return;
        const fieldErrors = validate(details);
        setErrors(fieldErrors);
        setMessage("");
        if (Object.keys(fieldErrors).length) {
            formRef.current?.elements.namedItem(Object.keys(fieldErrors)[0])?.focus();
            return;
        }
        submitLock.current = true;
        setIsSubmitting(true);
        let leaving = false;
        try {
            const saved = await postDataWithAuth("/api/checkout", details);
            if (!saved?.success || !saved.checkout?.id) {
                setErrors(saved?.errors || {});
                setMessage(saved?.message || "ذخیره اطلاعات سفارش انجام نشد. دوباره تلاش کنید.");
                return;
            }

            // A cart edited in another tab must be reviewed before any payment starts.
            if (!matchesCart(saved.checkout, cart, total)) {
                if (Array.isArray(saved.checkout.items) && Array.isArray(saved.checkout.cartItemIds)) {
                    setCart(saved.checkout.items.map((item, index) => ({ ...item, _id: saved.checkout.cartItemIds[index] })));
                } else {
                    setNeedsCartRefresh(true);
                }
                setMessage("سبد خرید تغییر کرده است. مبلغ و اقلام به‌روز شده را بررسی و دوباره تأیید کنید.");
                return;
            }

            // Keep SEP initiation and the Token POST identical to the original cart flow.
            const payment = await postDataWithAuth("/api/payment/start", {});
            if (!payment?.success || !payment.token || !payment.paymentUrl || !payment.resNum) {
                if (["PRICE_CHANGED", "ITEM_UNAVAILABLE"].includes(payment?.code)) {
                    await refreshCart();
                }
                setMessage(payment?.message || "خطا در اتصال به درگاه پرداخت! دوباره تلاش کنید.");
                return;
            }
            const linked = await postDataWithAuth(`/api/checkout/${saved.checkout.id}/payment`, { resNum: payment.resNum });
            if (!linked?.success) {
                await refreshCart();
                setMessage(linked?.message || "ثبت اطلاعات سفارش کامل نشد. دوباره تلاش کنید.");
                return;
            }
            redirectToGateway(payment.paymentUrl, payment.token);
            leaving = true;
        } catch {
            setMessage("خطا در ارتباط با سرور! دوباره تلاش کنید.");
        } finally {
            if (!leaving) {
                submitLock.current = false;
                setIsSubmitting(false);
            }
        }
    };

    return (
        <main className="checkoutPage" dir={dir}>
            <div className="container checkoutContainer">
                <nav className="checkoutBreadcrumb" aria-label={t("مسیر صفحه", "Breadcrumb")}>
                    <Link to="/">{t("خانه", "Home")}</Link><span aria-hidden="true">/</span>
                    <Link to={cartPath}>{t("سبد خرید", "Cart")}</Link><span aria-hidden="true">/</span>
                    <span aria-current="page">{t("تکمیل سفارش", "Checkout")}</span>
                </nav>
                <header className="checkoutPageHeader">
                    <h1>{t("تکمیل سفارش", "Checkout")}</h1>
                    <p>{t("اطلاعات خود را تکمیل کنید و پیش از پرداخت، جزئیات سفارش را بررسی کنید.", "Enter your details and review your order before payment.")}</p>
                </header>
                <div className="checkoutLayout">
                    <section className="checkoutDetails" aria-labelledby="checkout-title">
                        <div className="checkoutSectionHeader">
                            <h2 id="checkout-title"><FiUser aria-hidden="true" /> {t("اطلاعات تحویل و صورتحساب", "Delivery and billing details")}</h2>
                            <p>{t("تکمیل فیلدهای ستاره‌دار الزامی است.", "Fields marked with an asterisk are required.")}</p>
                        </div>
                        {isFetching ? <p className="checkoutStatus" role="status">{t("در حال دریافت اطلاعات سفارش...", "Loading your order...")}</p> : (
                            <form id="checkout-form" ref={formRef} onSubmit={submit} noValidate>
                                <fieldset disabled={isSubmitting} className="checkoutFields">
                                    {fields.map((field) => {
                                        const controlProps = {
                                            id: `checkout-${field.name}`, name: field.name, value: details[field.name],
                                            onChange: (event) => handleChange(event, field.numeric),
                                            required: !field.optional, maxLength: field.maxLength,
                                            autoComplete: field.autoComplete || "off", placeholder: field.placeholder ? t(field.placeholder, "Write any special instructions or requests...") : undefined,
                                            "aria-invalid": !!errors[field.name],
                                            "aria-describedby": errors[field.name] ? `checkout-${field.name}-error` : undefined,
                                        };
                                        return (
                                            <div className={`checkoutField${field.multiline ? " checkoutFieldWide" : ""}`} key={field.name}>
                                                <label htmlFor={controlProps.id}>{t(field.label, field.labelEn)}{!field.optional ? <span className="checkoutRequired" aria-hidden="true">*</span> : null}</label>
                                                {field.multiline ? <textarea {...controlProps} rows={field.optional ? 2 : 3} /> : (
                                                    <input {...controlProps} type="text" inputMode={field.numeric ? "numeric" : "text"}
                                                        dir={field.latin ? "ltr" : dir} lang={field.latin ? "en" : language} />
                                                )}
                                                {errors[field.name] ? <span id={`checkout-${field.name}-error`} className="checkoutFieldError">{t(errors[field.name], fieldErrorEnglish(field, errors[field.name]))}</span> : null}
                                            </div>
                                        );
                                    })}
                                </fieldset>
                            </form>
                        )}
                        {message ? <div className="checkoutMessage" role="alert">{customerMessage(t, message, pageMessages[message])}
                            {needsCartRefresh ? <button type="button" disabled={isSubmitting} onClick={async () => {
                                setIsSubmitting(true);
                                try { await refreshCart(); } finally { setIsSubmitting(false); }
                            }}>{t("به‌روزرسانی سبد خرید", "Refresh cart")}</button> : !cart.length ? <button type="button" onClick={() => setLoadAttempt((value) => value + 1)}>{t("تلاش دوباره", "Try again")}</button> : null}
                        </div> : null}
                    </section>

                    <aside className="checkoutSidebar" aria-label={t("خلاصه سفارش", "Order summary")}>
                        <div className="checkoutSummary">
                            <h2>{t("خلاصه سفارش", "Order summary")}</h2>
                            <div className="checkoutItems">
                                {cart.map((item) => (
                                    <div className="checkoutItem" key={item._id}>
                                        <div><h3>{localize(item, "productTitle")}</h3><p>{item.typeCourse ? t("۱ آیتم (دوره)", "1 item (course)") : t("تعداد: {count}", "Quantity: {count}", { count: formatPrice(item.quantity, isEnglish) })}</p></div>
                                        <span className="checkoutItemPrice">{formatPrice(Number(item.price) * Number(item.quantity), isEnglish)} {t("تومان", "Toman")}</span>
                                    </div>
                                ))}
                                {!isFetching && !cart.length ? <p className="checkoutEmpty">{t("سبد خرید شما خالی است.", "Your cart is empty.")}</p> : null}
                            </div>
                            <div className="checkoutTotals">
                                <div><span>{t("جمع جزء", "Subtotal")}</span><span>{formatPrice(total, isEnglish)} {t("تومان", "Toman")}</span></div>
                                {hasPhysicalProducts ? <div><span>{t("هزینه ارسال", "Shipping")}</span><span>{t("پس کرایه", "Pay on delivery")}</span></div> : null}
                                <div className="checkoutPayable"><strong>{t("مبلغ قابل پرداخت", "Total payable")}</strong><strong>{formatPrice(total, isEnglish)} {t("تومان", "Toman")}</strong></div>
                            </div>
                            <div className="checkoutPayment">
                                <p id="checkout-payment-label">{t("روش پرداخت", "Payment method")}</p>
                                <label className="checkoutGateway">
                                    <input type="radio" name="paymentMethod" value="sep" checked readOnly aria-labelledby="checkout-payment-label checkout-sep-label" />
                                    <span className="checkoutBankLogo"><img src={SamanBankLogo} alt={t("بانک سامان", "Saman Bank")} width="154" height="50" /></span>
                                    <span id="checkout-sep-label">{t("درگاه پرداخت امن بانک سامان", "Secure Saman Bank payment gateway")}</span>
                                </label>
                                <button type="submit" form="checkout-form" className="checkoutSubmit" disabled={isFetching || isSubmitting || needsCartRefresh || !cart.length}>
                                    <span>{isSubmitting ? t("در حال اتصال به درگاه...", "Connecting to the payment gateway...") : t("پرداخت و تکمیل سفارش", "Pay and complete order")}</span><FiLock aria-hidden="true" />
                                </button>
                                <p className="checkoutSecurity"><FiLock aria-hidden="true" /><span>{t("اطلاعات شما در درگاه رسمی بانک و به‌صورت رمزنگاری‌شده پردازش می‌شود.", "Your information is encrypted and processed by the bank's official payment gateway.")}</span></p>
                            </div>
                        </div>
                        <Link to={cartPath} className="checkoutBack"><FiArrowLeft aria-hidden="true" /> {t("بازگشت و ویرایش سبد خرید", "Back to edit cart")}</Link>
                    </aside>
                </div>
            </div>
        </main>
    );
}
