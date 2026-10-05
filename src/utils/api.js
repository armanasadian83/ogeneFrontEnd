import axios from "axios";
//require('dotenv/config');
//console.log(process.env.REACT_APP_BASE_URL);

export const fetchDataFromApi = async(url) => {
    try{
        const {data} = await axios.get(process.env.REACT_APP_BASE_URL +url) 
        return data;
    }catch(error){
        console.log(error);
        return error;
    }
}

// vid 41 : specail api for login/signup 
export const postAuthData = async (url, formData) => {

    try {
        const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            const errorData = await response.json();
        }

    } catch (error) {
        console.log(error);
        return error; 
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
        const {res} = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}` ,updatedData);
        return res;
    } catch (error){
        console.log(error);
        return error;
    }
}

export const deleteData = async (url) => {
    try {
        const {res} = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`);
        return res;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// special API function for updating user data in account page
export const updateAccountData = async (url, updatedData) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`, updatedData);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data || error;
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
