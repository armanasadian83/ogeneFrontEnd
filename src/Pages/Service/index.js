import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";

import { MyContext } from "../../App";
import { CircularProgress } from "@mui/material";

import { useSearchParams } from "react-router-dom";
import { TbFlask, TbSearch, TbCheck, TbBrandWhatsapp, TbArrowLeft, TbArrowRight } from "react-icons/tb";

import Logo from "./../../assets/baleLogo.png";

// TODO: replace with the real support numbers/usernames.
const WHATSAPP_NUMBER = "989050168316"; // digits only, country code, no leading 0 or +
const BALE_USERNAME = "Ogenetech2";

const fields = [
    'سلولی، مولکولی و ژنتیک',
    'میکروبیولوژی',
    'نانوفناوری',
    'خدمات عمومی',
    'زیست پزشکی',
    'بالینی و مدل حیوانی',
];

const COOLDOWN_SECONDS = 300; // how long the user must wait to resubmit

const Service = () => {
    const { t, localize, dir } = useLanguage();

    const context = useContext(MyContext);
    const { setIsShowFooter, setIsShowNavbar, setIsShowCalenderBar } = context;

    useEffect(() => {
        setIsShowFooter(true);
        setIsShowNavbar(true);
        setIsShowCalenderBar(true);

        window.scrollTo(0, 0);
    }, [setIsShowFooter, setIsShowNavbar, setIsShowCalenderBar]);

    const [formFields, setFormFields] = useState({
        reqName: [],
        name: '',
        phone: '',
        description: '',
        userId: ''
    });

    // Step 1 — which field the services belong to.
    const [personName, setPersonName] = useState('');

    // Step 2 — which services are selected, and a filter for the search box.
    const [serviceName, setServiceName] = useState([]);
    const [serviceSearch, setServiceSearch] = useState('');

    const toggleService = (name) => {
        setServiceName((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    // Changing the field starts the service selection over — a service
    // name only makes sense in the context of the field it belongs to.
    useEffect(() => {
        setServiceName([]);
        setServiceSearch('');
    }, [personName]);

    // cool down
    const [cooldown, setCooldown] = useState(0);

    const cooldownKey = useMemo(
        () => `formCooldown:${formFields.userId || "anon"}`,
        [formFields.userId]
    );

    useEffect(() => {
        const storedUntil = localStorage.getItem(cooldownKey);
        if (!storedUntil) return;
        const msRemaining = Number(storedUntil) - Date.now();
        if (msRemaining > 0) {
            setCooldown(Math.ceil(msRemaining / 1000));
        } else {
            localStorage.removeItem(cooldownKey);
        }
    }, [cooldownKey]);

    // Tick the countdown once per second while active
    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => {
            setCooldown((s) => {
                const next = s - 1;
                if (next <= 0) localStorage.removeItem(cooldownKey);
                return Math.max(0, next);
            });
        }, 1000);
        return () => clearInterval(id);
    }, [cooldown, cooldownKey]);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    // backend

    const [searchParams] = useSearchParams();
    const fieldName = searchParams.get("fieldName");
    useEffect(() => {
        if (fieldName !== null) {
            setPersonName(fieldName);
        }
        window.scrollTo(0, 600);
    }, [fieldName]);

    const [serviceData, setServiceData] = useState([]);
    const [servicesError, setServicesError] = useState('');
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [serviceLoadAttempt, setServiceLoadAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setServiceData([]);
        setServicesError('');
        if (!personName) {
            setIsLoadingServices(false);
            return;
        }
        setIsLoadingServices(true);
        fetchDataFromApi(`/api/service?filterKey=${encodeURIComponent(personName)}`, { throwOnError: true, signal: controller.signal })
            .then((res) => {
                if (controller.signal.aborted) return;
                if (!Array.isArray(res)) throw new Error('Invalid services response');
                setServiceData(res.filter((item) => item && typeof item.name === 'string' && item.name.trim()));
            })
            .catch(() => {
                if (!controller.signal.aborted) setServicesError('دریافت خدمات انجام نشد. لطفاً دوباره تلاش کنید.');
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoadingServices(false);
            });
        return () => controller.abort();
    }, [personName, serviceLoadAttempt]);

    const visibleServices = serviceData.filter((item) =>
        localize(item, "name").toLowerCase().includes(serviceSearch.toLowerCase())
        || item.name.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    const inputChange = (e) => {
        setFormFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Pre-fill name/phone for a logged-in user, but the fields stay
    // editable in case they're submitting on someone else's behalf.
    useEffect(() => {
        setFormFields((prev) => ({ ...prev, userId: '' }));
        if (context.isLoggedIn !== true) return;
        let user;
        try { user = JSON.parse(localStorage.getItem("user") || 'null'); } catch { return; }
        if (typeof user?.userId !== 'string' || !user.userId.trim()) return;
        const controller = new AbortController();
        fetchDataFromApi(`/api/client/${encodeURIComponent(user.userId)}`, { throwOnError: true, signal: controller.signal })
            .then((res) => {
                if (controller.signal.aborted || !res || res.error || res.success === false || res.isAxiosError
                    || (res.id || res._id) !== user.userId || typeof res.name !== 'string' || typeof res.phone !== 'string') return;
                setFormFields((prev) => ({
                    ...prev,
                    name: prev.name || `${res.name} ${res.lastName || ''}`.trim(),
                    userId: user.userId,
                    phone: prev.phone || res.phone
                }));
            })
            .catch(() => { /* Contact fields stay editable when profile prefill is unavailable. */ });
        return () => controller.abort();
    }, [context.isLoggedIn]);

    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const requestPending = useRef(false);

    // Two-step wizard: 1 = field + service selection, 2 = contact form.
    const [step, setStep] = useState(1);

    const goToContactStep = () => {
        if (!personName) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("لطفاً ابتدا حوزه خدمات را انتخاب کنید!")
            });
            return;
        }

        if (serviceName.length === 0) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("حداقل یک خدمت باید انتخاب شود!")
            });
            return;
        }

        setStep(2);
    };

    const goBackToSelection = () => {
        setStep(1);
    };

    // Anyone can submit a request — logged in or not. A logged-in
    // user's request is just tagged with their userId.
    const sendRequest = async (e) => {
        e.preventDefault();
        if (cooldown > 0 || requestPending.current) return;

        const payload = {
            ...formFields,
            name: String(formFields.name || '').trim(),
            phone: String(formFields.phone || '').trim(),
            description: String(formFields.description || ''),
            reqName: serviceName,
        };

        if (payload.name.trim() === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("نام را وارد کنید!")
            });
            return;
        }

        if (payload.phone.trim() === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("شماره تماس را وارد کنید!")
            });
            return;
        }

        if (payload.reqName.length === 0) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("حداقل یک خدمت باید انتخاب شود!")
            });
            return;
        }

        if (payload.description.length > 2000) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("توضیحات باید حداکثر ۲۰۰۰ کاراکتر باشد.")
            });
            return;
        }

        requestPending.current = true;
        try {
            setLoader(true);
            setBtnDisabled(true);

            const response = await postData('/api/request/create', payload);
            const savedId = response?.id || response?._id;
            if (!response || response.error || response.success === false || response.status === false || response.isAxiosError
                || typeof savedId !== 'string' || !savedId.trim()
                || !Array.isArray(response.reqName) || typeof response.name !== 'string' || typeof response.phone !== 'string') {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: t("ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.")
                });
                return;
            }

            context.setAlertBox({
                open: true,
                error: false,
                msg: t("درخواست با موفقیت ثبت شد!")
            });

            // Only a confirmed saved request starts the cooldown.
            const until = Date.now() + COOLDOWN_SECONDS * 1000;
            try { localStorage.setItem(cooldownKey, String(until)); } catch { /* The in-memory cooldown still applies. */ }
            setCooldown(COOLDOWN_SECONDS);
            setServiceName([]);
            setFormFields((prev) => ({ ...prev, description: '' }));
            setStep(1);

        } catch {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("مشکلی در ثبت درخواست وجود دارد!")
            });
        } finally {
            requestPending.current = false;
            setLoader(false);
            setBtnDisabled(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    return (
        <div className="container serviceAnformaticSection" dir={dir}>

            <div className="serviceWizard">
                <div
                    className="serviceWizard-track"
                    style={{ transform: `translateX(${step === 1 ? "0%" : "-50%"})` }}
                >

                    {/* Panel 1 — pick a field, then services */}
                    <div className="serviceWizard-panel">

                        <div className="serviceHero">
                            <span className="serviceHero-icon"><TbFlask /></span>
                            <h1 className="serviceHero-title">{t("خدمات اوژن")}</h1>
                            <p className="serviceHero-subtitle">{t("حوزه مورد نظر را انتخاب کنید و خدمات لازم را از میان گزینه‌ها مشخص کنید")}</p>
                        </div>

                        <div className="serviceStep">
                            <p className="serviceStep-label">{t("۱. حوزه خدمات")}</p>
                            <div className="fieldChipRow">
                                {fields.map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        className={`fieldChip${personName === name ? " is-active" : ""}`}
                                        onClick={() => setPersonName(name)}
                                    >
                                        {t(name)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {personName && (
                            <div className="serviceStep">
                                <div className="serviceStep-header">
                                    <p className="serviceStep-label">{t("۲. انتخاب خدمات")}</p>
                                    {serviceName.length !== 0 && (
                                        <span className="selectedCount">{serviceName.length}{t(" مورد انتخاب شد")}</span>
                                    )}
                                </div>

                                <div className="serviceSearch">
                                    <TbSearch className="serviceSearch-icon" />
                                    <input
                                        type="text"
                                        placeholder={t("جستجوی خدمت...")}
                                        value={serviceSearch}
                                        onChange={(e) => setServiceSearch(e.target.value)}
                                    />
                                </div>

                                {isLoadingServices ? <p className="serviceCardGrid-empty" role="status">{t("در حال دریافت خدمات...")}</p> : null}
                                {servicesError ? <div className="serviceCardGrid-empty" role="alert">
                                    <p>{t(servicesError)}</p>
                                    <button type="button" className="backButton" onClick={() => setServiceLoadAttempt((value) => value + 1)}>{t("تلاش دوباره")}</button>
                                </div> : null}
                                <div className="serviceCardGrid">
                                    {visibleServices.map((item, index) => {
                                        const selected = serviceName.includes(item?.name);
                                        return (
                                            <button
                                                type="button"
                                                key={index}
                                                className={`serviceCard${selected ? " is-selected" : ""}`}
                                                onClick={() => toggleService(item?.name)}
                                                aria-pressed={selected}
                                            >
                                                <span className="serviceCard-check">
                                                    {selected && <TbCheck />}
                                                </span>
                                                <span className="serviceCard-text">{localize(item, "name")}</span>
                                            </button>
                                        );
                                    })}

                                    {serviceData?.length !== 0 && visibleServices.length === 0 && (
                                        <p className="serviceCardGrid-empty">{t("خدمتی با این عنوان پیدا نشد.")}</p>
                                    )}
                                </div>

                                <div className="serviceWizard-nextRow">
                                    <button type="button" className="nextButton" onClick={goToContactStep}>{t("مرحله بعدی")}<TbArrowLeft />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Panel 2 — contact info & submit */}
                    <div className="serviceWizard-panel">

                        <button type="button" className="backButton" onClick={goBackToSelection}>
                            <TbArrowRight />{t("بازگشت به انتخاب خدمات")}</button>

                        <div className="contactCard">
                            <p className="serviceStep-label">{t("۳. اطلاعات تماس")}</p>

                            <form onSubmit={sendRequest}>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <label className="formLabel" htmlFor="service-request-name">{t("نام و نام خانوادگی")}</label>
                                        <input
                                            id="service-request-name"
                                            className="formInput"
                                            name="name"
                                            type="text"
                                            placeholder=""
                                            value={formFields.name}
                                            onChange={inputChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <label className="formLabel" htmlFor="service-request-phone">{t("شماره تماس")}</label>
                                        <input
                                            id="service-request-phone"
                                            className="formInput"
                                            name="phone"
                                            type="text"
                                            placeholder=""
                                            value={formFields.phone}
                                            onChange={inputChange}
                                        />
                                    </div>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel" htmlFor="service-request-description">{t("توضیحات (اختیاری)")}</label>
                                    <textarea
                                        id="service-request-description"
                                        className="formTextarea"
                                        name="description"
                                        rows={3}
                                        maxLength={2000}
                                        placeholder={t("توضیح دهید دقیقاً به چه چیزی نیاز دارید...")}
                                        value={formFields.description}
                                        onChange={inputChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="submitButton"
                                    disabled={cooldown > 0 || btnDisabled}
                                >{t("ثبت درخواست")}{loader === true && (
                                        <CircularProgress
                                            sx={() => ({
                                                color: '#fff',
                                                marginRight: '10px',
                                            })}
                                            size="20px"
                                        />
                                    )}
                                </button>

                            </form>

                            {cooldown > 0 && (
                                <p className="contactCard-cooldown">{t("برای ارسال دوباره، لطفاً {time} صبر کنید.", "Please wait {time} before submitting again.", { time: formatTime(cooldown) })}</p>
                            )}
                        </div>

                        {/* Direct support links — an alternative to the form above. */}
                        <div className="supportLinks">
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="supportLink supportLink--whatsapp"
                            >
                                <span className="supportLink-icon"><TbBrandWhatsapp /></span>
                                <span className="supportLink-text">
                                    <span className="supportLink-title">{t("پیام به پشتیبانی")}</span>
                                    <span className="supportLink-subtitle">{t("دریافت مشاوره در واتساپ")}</span>
                                </span>
                                <TbArrowLeft className="supportLink-arrow" />
                            </a>

                            <a
                                href={`https://ble.ir/${BALE_USERNAME}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="supportLink supportLink--bale"
                            >
                                <span className="supportLink-icon"><img src={Logo} alt={t("بله")} /></span>
                                <span className="supportLink-text">
                                    <span className="supportLink-title">{t("پیام به پشتیبانی")}</span>
                                    <span className="supportLink-subtitle">{t("دریافت مشاوره در بله")}</span>
                                </span>
                                <TbArrowLeft className="supportLink-arrow" />
                            </a>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}

export default Service;
