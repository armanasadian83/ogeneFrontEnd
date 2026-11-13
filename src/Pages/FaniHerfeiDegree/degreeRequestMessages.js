const fieldMessages = {
    REQUIRED: ["تکمیل این قسمت الزامی است.", "This field is required."],
    TOO_LONG: ["متن واردشده بیش از حد مجاز است.", "The entered text is too long."],
    INVALID_NAME: ["نام را فقط با حروف وارد کنید.", "Enter a name using letters."],
    INVALID_LATIN_NAME: ["نام را با حروف انگلیسی وارد کنید.", "Enter the name using English letters."],
    INVALID_NATIONAL_CODE: ["کد ملی باید ۱۰ رقم باشد.", "The national ID must contain 10 digits."],
    INVALID_PHONE: ["شماره همراه باید ۱۱ رقم و با ۰۹ شروع شود.", "Enter an 11-digit mobile number starting with 09."],
    INVALID_DATE: ["یک تاریخ شمسی معتبر به صورت سال/ماه/روز وارد کنید؛ مانند ۱۳۷۵/۰۱/۱۵.", "Enter a valid Persian calendar date as YYYY/MM/DD, for example 1375/01/15."],
    INVALID_EMAIL: ["یک آدرس ایمیل معتبر وارد کنید.", "Enter a valid email address."],
};

export function fieldErrorMessage(code, t) {
    return t(...(fieldMessages[code] || ["اطلاعات این قسمت معتبر نیست.", "This value is invalid."]));
}

export function submissionMessage(code, t) {
    if (code === "VALIDATION_ERROR") return t("لطفاً قسمت‌های مشخص‌شده را بررسی کنید.", "Please check the highlighted fields.");
    if (code === "RATE_LIMITED") return t("تعداد تلاش‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.", "Too many attempts. Please try again shortly.");
    return t("ثبت درخواست تأیید نشد. لطفاً اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.", "Your submission could not be confirmed. Please check your connection and try again.");
}
