import { useContext, useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiCheckCircle, FiInfo } from "react-icons/fi";
import { MyContext } from "../../App";
import { useLanguage } from "../../i18n/LanguageContext";
import { fetchDataFromApi, isClientResponse, readStoredSession } from "../../utils/api";
import { normalizeProjectDigits, submitProjectRequest, validateProjectRequest } from "./projectRequest";

const emptyFields = { firstName: "", lastName: "", phone: "", description: "" };
const contactFields = [
    {
        name: "firstName",
        label: ["نام", "First name"],
        placeholder: ["نام خود را وارد کنید", "Enter your first name"],
        autoComplete: "given-name",
        maxLength: 100,
    },
    {
        name: "lastName",
        label: ["نام خانوادگی", "Last name"],
        placeholder: ["نام خانوادگی خود را وارد کنید", "Enter your last name"],
        autoComplete: "family-name",
        maxLength: 100,
    },
    {
        name: "phone",
        label: ["شماره همراه", "Mobile number"],
        placeholder: ["مثال: ۰۹۱۲۳۴۵۶۷۸۹", "Example: 09123456789"],
        autoComplete: "tel-national",
        maxLength: 11,
    },
];
const fieldMessages = {
    REQUIRED: ["تکمیل این قسمت الزامی است.", "This field is required."],
    INVALID_NAME: ["نام را فقط با حروف وارد کنید.", "Enter a name using letters."],
    INVALID_PHONE: [
        "شماره همراه باید ۱۱ رقم و با ۰۹ شروع شود.",
        "Enter an 11-digit mobile number starting with 09.",
    ],
    TOO_LONG: ["متن واردشده بیش از حد مجاز است.", "The entered text is too long."],
};

export default function ProjectRequestForm() {
    const { t, dir, formatNumber } = useLanguage();
    const { isLoggedIn } = useContext(MyContext);
    const [fields, setFields] = useState(emptyFields);
    const [errors, setErrors] = useState({});
    const [feedback, setFeedback] = useState("");
    const [pending, setPending] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef(null);
    const messageRef = useRef(null);
    const editedFields = useRef(new Set());
    const defaults = useRef(emptyFields);
    const submitLock = useRef(false);
    const focusField = useRef(null);

    useEffect(() => {
        if (isLoggedIn !== true) return;
        const session = readStoredSession();
        if (!session) return;
        const controller = new AbortController();
        const prefill = (profile) => {
            const values = {
                firstName: typeof profile.name === "string" ? profile.name : "",
                lastName: typeof profile.lastName === "string" ? profile.lastName : "",
                phone: typeof profile.phone === "string" ? normalizeProjectDigits(profile.phone) : "",
            };
            defaults.current = { ...emptyFields, ...values };
            setFields((previous) => {
                const next = { ...previous };
                for (const [name, value] of Object.entries(values)) {
                    if (!editedFields.current.has(name) && value) next[name] = value;
                }
                return next;
            });
        };
        prefill(session.user);
        fetchDataFromApi(`/api/client/${encodeURIComponent(session.user.userId)}`, {
            throwOnError: true,
            signal: controller.signal,
        })
            .then((profile) => {
                if (!controller.signal.aborted && isClientResponse(profile, session.user.userId))
                    prefill(profile);
            })
            .catch(() => {
                /* Stored contact details remain editable if profile refresh is unavailable. */
            });
        return () => controller.abort();
    }, [isLoggedIn]);

    useEffect(() => {
        if (focusField.current) {
            formRef.current?.elements.namedItem(focusField.current)?.focus();
            focusField.current = null;
        } else if (feedback || submitted) messageRef.current?.focus();
    }, [errors, feedback, submitted]);

    const changeField = (name, value) => {
        editedFields.current.add(name);
        setFields((previous) => ({
            ...previous,
            [name]: name === "phone" ? normalizeProjectDigits(value) : value,
        }));
        setErrors((previous) => ({ ...previous, [name]: undefined }));
        setFeedback("");
    };
    const showErrors = (nextErrors) => {
        focusField.current = Object.keys(emptyFields).find((name) => nextErrors[name]);
        setErrors(nextErrors);
        setFeedback("VALIDATION_ERROR");
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitLock.current || submitted) return;
        const validated = validateProjectRequest(fields);
        if (Object.keys(validated.errors).length) {
            showErrors(validated.errors);
            return;
        }
        submitLock.current = true;
        setPending(true);
        setFeedback("");
        setErrors({});
        try {
            await submitProjectRequest(validated.details);
            setSubmitted(true);
        } catch (error) {
            if (error.code === "VALIDATION_ERROR" && error.fields && Object.keys(error.fields).length)
                showErrors(error.fields);
            else
                setFeedback(
                    error.status === 429 || error.code === "RATE_LIMITED" ? "RATE_LIMITED" : "REQUEST_FAILED",
                );
        } finally {
            submitLock.current = false;
            setPending(false);
        }
    };
    const startAnother = () => {
        editedFields.current = new Set();
        setFields(isLoggedIn ? defaults.current : emptyFields);
        setErrors({});
        setFeedback("");
        focusField.current = "firstName";
        setSubmitted(false);
    };
    const fieldMessage = (code) =>
        t(...(fieldMessages[code] || ["اطلاعات این قسمت معتبر نیست.", "This value is invalid."]));
    let feedbackText = t(
        "ثبت درخواست تأیید نشد. اطلاعات شما حفظ شده است؛ لطفاً دوباره تلاش کنید.",
        "Your request could not be confirmed. Your details are still here. Please try again.",
    );
    if (feedback === "VALIDATION_ERROR")
        feedbackText = t("لطفاً قسمت‌های مشخص‌شده را بررسی کنید.", "Please check the highlighted fields.");
    if (feedback === "RATE_LIMITED")
        feedbackText = t(
            "تعداد تلاش‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.",
            "Too many attempts. Please try again shortly.",
        );

    if (submitted)
        return (
            <div className="projForm projSuccess" role="status" ref={messageRef} tabIndex={-1}>
                <FiCheckCircle aria-hidden="true" />
                <h3>{t("درخواست پروژه شما ثبت شد", "Your project request has been submitted")}</h3>
                <p>
                    {t(
                        "اطلاعات شما با موفقیت ذخیره شد و برای بررسی در اختیار تیم اوژن قرار گرفت.",
                        "Your details were saved successfully and are available to the Ogene team for review.",
                    )}
                </p>
                <button type="button" className="projPrimaryButton" onClick={startAnother}>
                    {t("ثبت درخواست دیگر", "Submit another request")}
                </button>
            </div>
        );

    return (
        <form
            className="projForm"
            ref={formRef}
            aria-label={t("فرم درخواست پروژه", "Project request form")}
            onSubmit={handleSubmit}
            aria-busy={pending}
            noValidate
        >
            {feedback && (
                <p className="projFormFeedback" role="alert" ref={messageRef} tabIndex={-1}>
                    {feedbackText}
                </p>
            )}
            <div className="projFormGrid">
                {contactFields.map((field) => {
                    const id = `project-${field.name}`;
                    const error = errors[field.name];
                    return (
                        <div
                            className={`projFormField${field.name === "phone" ? " projFormField--wide" : ""}`}
                            key={field.name}
                        >
                            <label htmlFor={id}>
                                {t(...field.label)}
                                <span aria-hidden="true">*</span>
                            </label>
                            <input
                                id={id}
                                name={field.name}
                                type={field.name === "phone" ? "tel" : "text"}
                                value={fields[field.name]}
                                onChange={(event) => changeField(field.name, event.target.value)}
                                maxLength={field.maxLength}
                                autoComplete={field.autoComplete}
                                required
                                disabled={pending}
                                placeholder={t(...field.placeholder)}
                                dir={field.name === "phone" ? "ltr" : dir}
                                inputMode={field.name === "phone" ? "tel" : undefined}
                                aria-invalid={Boolean(error)}
                                aria-describedby={error ? `${id}-error` : undefined}
                            />
                            {error && (
                                <p className="projFieldError" id={`${id}-error`}>
                                    {fieldMessage(error)}
                                </p>
                            )}
                        </div>
                    );
                })}
                <p className="projPrefillNote">
                    <FiInfo aria-hidden="true" />
                    {isLoggedIn
                        ? t(
                              "اطلاعات تماس حساب شما قابل ویرایش است.",
                              "You can edit the contact details from your account.",
                          )
                        : t(
                              "اطلاعات تماس کاربران واردشده به‌صورت خودکار تکمیل می‌شود.",
                              "Contact details are filled automatically when you are signed in.",
                          )}
                </p>
                <div className="projFormField projFormField--wide">
                    <label htmlFor="project-description">
                        {t("توضیح کوتاه پروژه", "Short project description")}
                        <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                        id="project-description"
                        name="description"
                        value={fields.description}
                        rows={4}
                        onChange={(event) => changeField("description", event.target.value)}
                        required
                        maxLength={2000}
                        disabled={pending}
                        placeholder={t(
                            "شرح کوتاهی از موضوع، هدف و نیازهای پروژه خود بنویسید…",
                            "Briefly describe your project’s topic, goals and needs…",
                        )}
                        aria-invalid={Boolean(errors.description)}
                        aria-describedby={errors.description ? "project-description-error" : undefined}
                    />
                    <div className="projDescriptionMeta">
                        {errors.description && (
                            <p className="projFieldError" id="project-description-error">
                                {fieldMessage(errors.description)}
                            </p>
                        )}
                        <span>
                            {formatNumber(fields.description.length)} / {formatNumber(2000)}
                        </span>
                    </div>
                </div>
            </div>
            <button type="submit" className="projPrimaryButton projSubmit" disabled={pending}>
                {pending
                    ? t("در حال ثبت درخواست…", "Submitting…")
                    : t("ثبت درخواست پروژه", "Submit a project request")}
                <FiArrowLeft aria-hidden="true" />
            </button>
        </form>
    );
}
