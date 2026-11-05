import axios from "axios";

const isObject = (value) => value !== null && Object.prototype.toString.call(value) === "[object Object]";
const isFailure = (value) => isObject(value) && (Boolean(value.error) || value.success === false || value.status === false || value.isAxiosError === true);
const serverMessage = (body, fallback) => {
    const message = isObject(body) ? body.msg || body.message : "";
    return typeof message === "string" && /[\u0600-\u06ff]/.test(message) ? message : fallback;
};

function requestError(source, fallback, body, status) {
    if (source?.isApiError) return source;
    const responseBody = body ?? source?.response?.data;
    const message = serverMessage(responseBody, fallback);
    const error = new Error(message);
    error.isApiError = true;
    error.msg = message;
    error.status = status ?? source?.response?.status ?? source?.status;
    error.code = (isObject(responseBody) ? responseBody.code : undefined) || source?.code || "REQUEST_FAILED";
    if (isObject(responseBody) && typeof responseBody.field === "string") error.field = responseBody.field;
    return error;
}

export const isUsableToken = (token) => typeof token === "string" && token.trim() !== "" && !/^(undefined|null)$/i.test(token.trim());
const storedId = (user) => user?.userId || user?._id || user?.id;
const usableId = (id) => typeof id === "string" && id.trim() !== "" && !/^(undefined|null)$/i.test(id.trim());

export const toStoredUser = (client) => ({
    userId: String(storedId(client) || ""),
    ...Object.fromEntries(["name", "lastName", "email", "phone", "englishName", "englishLastName", "nationalCode", "birthdate"]
        .map((field) => [field, typeof client?.[field] === "string" ? client[field] : ""])),
});

export function readStoredSession() {
    try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!isUsableToken(token) || !isObject(user) || !usableId(storedId(user))) return null;
        return { token: token.trim(), user: toStoredUser(user) };
    } catch {
        return null;
    }
}

export function isClientResponse(value, id) {
    return isObject(value) && !isFailure(value) && usableId(storedId(value))
        && storedId(value) === id && typeof value.name === "string" && Boolean(value.name.trim())
        && typeof value.phone === "string" && Boolean(value.phone.trim());
}

export function safeReturnTo(value, fallback = "/") {
    if (typeof value !== "string") return fallback;
    const hasControlCharacter = Array.from(value).some((character) => {
        const code = character.charCodeAt(0);
        return code < 32 || code === 127;
    });
    return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !hasControlCharacter
        ? value : fallback;
}

// Existing callers keep their legacy result contract; profile pages opt into rejection.
export const fetchDataFromApi = async (url, options = {}) => {
    try {
        const config = options.signal ? { signal: options.signal } : undefined;
        const { data } = config
            ? await axios.get(process.env.REACT_APP_BASE_URL + url, config)
            : await axios.get(process.env.REACT_APP_BASE_URL + url);
        if (options.throwOnError && ((!isObject(data) && !Array.isArray(data)) || isFailure(data))) {
            throw requestError(null, "دریافت اطلاعات انجام نشد. دوباره تلاش کنید.", data);
        }
        return data;
    } catch (error) {
        if (options.throwOnError) {
            throw requestError(error, "دریافت اطلاعات انجام نشد. دوباره تلاش کنید.");
        }
        return error;
    }
}

// Login/signup always receive a usable result, including HTTP and network failures.
export const postAuthData = async (url, formData) => {
    try {
        const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        let data;
        try { data = await response.json(); } catch { data = null; }
        if (!response.ok || !isObject(data) || isFailure(data)) {
            const message = serverMessage(data, "درخواست انجام نشد. دوباره تلاش کنید.");
            return { ...(isObject(data) ? data : {}), error: true, success: false, msg: message, message,
                status: response.status, code: data?.code || "AUTH_REQUEST_FAILED" };
        }
        return data;
    } catch (error) {
        const message = "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.";
        return { error: true, success: false, msg: message, message, code: error?.code || "NETWORK_ERROR" };
    }

}

export const postData = async (url, formData) => {
    try {
        const res = await axios.post(process.env.REACT_APP_BASE_URL + url, formData)
        return res.data;
    } catch (error) {
        console.log(error);
        return error;       
    }
}

export const editData = async (url, updatedData) => {
    try{
        const {data} = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}` ,updatedData);
        return data;
    } catch (error){
        console.log(error);
        return error;
    }
}

export const deleteData = async (url) => {
    try {
        const {data} = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// special API function for updating user data in account page
export const updateAccountData = async (url, updatedData) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`, updatedData);
        if (!isObject(response.data) || isFailure(response.data)) {
            throw requestError(null, "ذخیره اطلاعات انجام نشد. دوباره تلاش کنید.", response.data);
        }
        return response.data;
    } catch (error) {
        throw requestError(error, "ذخیره اطلاعات انجام نشد. دوباره تلاش کنید.");
    }
}



// ============================================================
// به انتهای فایل src/utils/api.js اضافه کنید (هیچ تابع موجودی را تغییر نمی‌دهد)
// ============================================================

// فقط برای درخواست‌هایی که سرور باید کاربر را از JWT بشناسد (الان فقط: شروع پرداخت)
// برخلاف postData: هدر Authorization می‌فرستد و بدنه‌ی خطای سرور را برمی‌گرداند
// (مثلاً { success:false, code:'PRICE_CHANGED', message:'...' }) تا Cart بتواند پیام فارسی سرور را نشان دهد.
export const postDataWithAuth = async (url, formData) => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(process.env.REACT_APP_BASE_URL + url, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || { success: false, message: 'خطا در ارتباط با سرور!' };
    }
}
