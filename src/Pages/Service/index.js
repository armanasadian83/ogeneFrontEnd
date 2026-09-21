import { useContext, useEffect, useMemo, useState } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";

import { MyContext } from "../../App";
import { CircularProgress } from "@mui/material";

import { useSearchParams } from "react-router-dom";
import { TbFlask, TbSearch, TbCheck, TbBrandWhatsapp, TbMessageCircle, TbArrowLeft, TbArrowRight } from "react-icons/tb";

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

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(true);
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);

        window.scrollTo(0, 0);
    }, []);

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

    useEffect(() => {
        if (!personName) {
            setServiceData([]);
            return;
        }
        fetchDataFromApi(`/api/service?filterKey=${personName}`).then((res) => {
            setServiceData(res);
        });
    }, [personName]);

    const visibleServices = (serviceData ?? []).filter((item) =>
        (item?.name ?? '').toLowerCase().includes(serviceSearch.toLowerCase())
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
        if (context.isLoggedIn === true) {
            const user = JSON.parse(localStorage.getItem("user"));

            fetchDataFromApi(`/api/client/${user?.userId}`).then((res) => {
                setFormFields((prev) => ({
                    ...prev,
                    name: `${user?.name} ${user?.lastName}`,
                    userId: user?.userId,
                    phone: res.phone
                }));
            });
        }
    }, [context.isLoggedIn]);

    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);

    // Two-step wizard: 1 = field + service selection, 2 = contact form.
    const [step, setStep] = useState(1);

    const goToContactStep = () => {
        if (!personName) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "لطفاً ابتدا حوزه خدمات را انتخاب کنید!"
            });
            return;
        }

        if (serviceName.length === 0) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "حداقل یک خدمت باید انتخاب شود!"
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
    const sendRequest = (e) => {
        e.preventDefault();
        if (cooldown > 0) return;

        const payload = { ...formFields, reqName: serviceName };

        if (payload.name.trim() === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "نام را وارد کنید!"
            });
            return;
        }

        if (payload.phone.trim() === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تماس را وارد کنید!"
            });
            return;
        }

        if (payload.reqName.length === 0) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "حداقل یک خدمت باید انتخاب شود!"
            });
            return;
        }

        try {
            setLoader(true);
            setBtnDisabled(true);

            postData('/api/request/create', payload).then(() => {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "درخواست با موفقیت ثبت شد!"
                });

                setLoader(false);
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 1000);

                setServiceName([]);
                setFormFields((prev) => ({ ...prev, description: '' }));
                setStep(1);
            });

            // start cooldown
            const until = Date.now() + COOLDOWN_SECONDS * 1000;
            localStorage.setItem(cooldownKey, String(until));
            setCooldown(COOLDOWN_SECONDS);

        } catch (error) {
            console.log(error);

            setLoader(false);
            setBtnDisabled(false);

            context.setAlertBox({
                open: true,
                error: true,
                msg: "مشکلی در ثبت درخواست وجود دارد!"
            });
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    return (
        <div className="container serviceAnformaticSection">

            <div className="serviceWizard">
                <div
                    className="serviceWizard-track"
                    style={{ transform: `translateX(${step === 1 ? "0%" : "-50%"})` }}
                >

                    {/* Panel 1 — pick a field, then services */}
                    <div className="serviceWizard-panel">

                        <div className="serviceHero">
                            <span className="serviceHero-icon"><TbFlask /></span>
                            <h1 className="serviceHero-title">خدمات اوژن</h1>
                            <p className="serviceHero-subtitle">حوزه مورد نظر را انتخاب کنید و خدمات لازم را از میان گزینه‌ها مشخص کنید</p>
                        </div>

                        <div className="serviceStep">
                            <p className="serviceStep-label">۱. حوزه خدمات</p>
                            <div className="fieldChipRow">
                                {fields.map((name) => (
                                    <button
                                        key={name}
                                        type="button"
                                        className={`fieldChip${personName === name ? " is-active" : ""}`}
                                        onClick={() => setPersonName(name)}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {personName && (
                            <div className="serviceStep">
                                <div className="serviceStep-header">
                                    <p className="serviceStep-label">۲. انتخاب خدمات</p>
                                    {serviceName.length !== 0 && (
                                        <span className="selectedCount">{serviceName.length} مورد انتخاب شد</span>
                                    )}
                                </div>

                                <div className="serviceSearch">
                                    <TbSearch className="serviceSearch-icon" />
                                    <input
                                        type="text"
                                        placeholder="جستجوی خدمت..."
                                        value={serviceSearch}
                                        onChange={(e) => setServiceSearch(e.target.value)}
                                    />
                                </div>

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
                                                <span className="serviceCard-text">{item?.name}</span>
                                            </button>
                                        );
                                    })}

                                    {serviceData?.length !== 0 && visibleServices.length === 0 && (
                                        <p className="serviceCardGrid-empty">خدمتی با این عنوان پیدا نشد.</p>
                                    )}
                                </div>

                                <div className="serviceWizard-nextRow">
                                    <button type="button" className="nextButton" onClick={goToContactStep}>
                                        مرحله بعدی
                                        <TbArrowLeft />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Panel 2 — contact info & submit */}
                    <div className="serviceWizard-panel">

                        <button type="button" className="backButton" onClick={goBackToSelection}>
                            <TbArrowRight />
                            بازگشت به انتخاب خدمات
                        </button>

                        <div className="contactCard">
                            <p className="serviceStep-label">۳. اطلاعات تماس</p>

                            <form onSubmit={sendRequest}>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <label className="formLabel">نام و نام خانوادگی</label>
                                        <input
                                            className="formInput"
                                            name="name"
                                            type="text"
                                            placeholder=""
                                            value={formFields.name}
                                            onChange={inputChange}
                                        />
                                    </div>
                                    <div className="formGroup">
                                        <label className="formLabel">شماره تماس</label>
                                        <input
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
                                    <label className="formLabel">توضیحات (اختیاری)</label>
                                    <textarea
                                        className="formTextarea"
                                        name="description"
                                        rows={3}
                                        placeholder="توضیح دهید دقیقاً به چه چیزی نیاز دارید..."
                                        value={formFields.description}
                                        onChange={inputChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="submitButton"
                                    disabled={cooldown > 0 || btnDisabled}
                                >
                                    ثبت درخواست
                                    {loader === true && (
                                        <CircularProgress
                                            sx={() => ({
                                                color: '#fff',
                                                marginRight: '10px',
                                            })}
                                            enableTrackSlot
                                            size="20px"
                                        />
                                    )}
                                </button>

                            </form>

                            {cooldown > 0 && (
                                <p className="contactCard-cooldown">
                                    برای ارسال دوباره، لطفاً {formatTime(cooldown)} ثانیه صبر کنید.
                                </p>
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
                                    <span className="supportLink-title">پیام به پشتیبانی</span>
                                    <span className="supportLink-subtitle">دریافت مشاوره در واتساپ</span>
                                </span>
                                <TbArrowLeft className="supportLink-arrow" />
                            </a>

                            <a
                                href={`https://ble.ir/${BALE_USERNAME}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="supportLink supportLink--bale"
                            >
                                {/* Swap TbMessageCircle for the real Bale logo asset if one exists in the project. */}
                                <span className="supportLink-icon"><img src={Logo} /></span>
                                <span className="supportLink-text">
                                    <span className="supportLink-title">پیام به پشتیبانی</span>
                                    <span className="supportLink-subtitle">دریافت مشاوره در بله</span>
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