import { customerMessage } from "../account/customerMessages";
import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import { MdOutlineVerifiedUser } from "react-icons/md";
import OtpInput from "../../Components/otpBox";
import { Button, CircularProgress } from "@mui/material";

const ChangePasswordVerifyOTP = () => {
    const { t, dir } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [phone, setPhone] = useState("");

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);

        const changePhone = localStorage.getItem("changePasswordPhone");
        console.log("ChangePasswordVerify - Phone from localStorage:", changePhone);
        
        if (!changePhone) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("لطفا ابتدا درخواست تغییر رمز عبور کنید!", "Please request a password change first.")
            });
            history('/change-password');
        } else {
            setPhone(changePhone);
        }

        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            history('/login');
        }
    }, [context, history, t]);

    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("کد وارد شده باید 6 رقمی باشد!", "The code must contain 6 digits.")
            });
            return;
        }

        setIsLoading(true);

        try {
            const obj = {
                otp: otp,
                phone: phone
            };

            const res = await postData(`/api/client/change-password-verify-otp`, obj);

            if (res?.success === true) {
                // Make sure phone is preserved
                localStorage.setItem("changePasswordPhone", phone);
                
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: customerMessage(t, res.message)
                });
                
                // Navigate to set new password page with phone in URL
                setTimeout(() => {
                    history(`/change-password-new?phone=${encodeURIComponent(phone)}`);
                }, 1500);
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: customerMessage(t, res?.message || t("کد وارد شده صحیح نیست!", "The code is incorrect."))
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("مشکلی در ارتباط با سرور وجود دارد!", "Could not connect to the server. Please try again.")
            });
            setIsLoading(false);
        }
    };

    const resendOTP = async () => {
        try {
            const res = await postData(`/api/client/change-password-send-otp`, { phone });
            
            if (res?.success === true) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: t("کد جدید به شماره تلفن شما ارسال شد!", "A new code was sent to your phone number.")
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: customerMessage(t, res?.msg || t("مشکل در ارسال مجدد کد!", "The code could not be resent."))
                });
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("مشکلی در ارسال مجدد کد وجود دارد!", "The code could not be resent. Please try again.")
            });
        }
    };

    return (
        <section dir={dir} className="section signInPage otpPage">
            <div className="shape-bottom">
                <svg fill="#fff" id="layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8">
                    <path className="st0" d="M1921,413.1v406.7H0V0.Sh0.41228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
                </svg>
            </div>

            <div className="container d-flex align-items-center h-100">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center mt-2">
                        <MdOutlineVerifiedUser style={{fontSize: '60px', color: '#31c19fff'}} />
                    </div>
                    <form className="mt-0" onSubmit={verifyOTP}>
                        <h2 className="mb-1 text-center">{t("تایید کد", "Verify code")}</h2>
                        <p className="text-center text-muted">
                            {t("کد تایید به شماره تلفن", "A verification code was sent to")} <b>{phone}</b> {t("ارسال شد.", ".")}
                        </p>

                        <p className="text-center text-muted mt-4">{t("کد ارسال شده را وارد کنید:", "Enter the verification code:")}</p>
                        
                        <OtpInput length={6} onChange={handleOtpChange} />

                        <div className="text-center mt-2">
                            <Button 
                                type="button" 
                                className="text-muted" 
                                style={{background: 'none', border: 'none', cursor: 'pointer'}}
                                onClick={resendOTP}
                            >
                                {t("ارسال مجدد کد", "Resend code")}
                            </Button>
                        </div>

                        <div className="d-flex align-items-center mt-4 mb-3">
                            <Button type="submit" className="col verifyOtpSubmitBtn">
                                {isLoading === true ? <CircularProgress /> : t("تایید", "Verify")}
                            </Button>
                        </div>

                        <h6 className="mt-4 text-center font-weight-bold">
                            {t("آموزشگاه آزاد نانوزیست فناوری اوژن", "Ogene Nanobiotechnology Training Institute")}
                        </h6>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ChangePasswordVerifyOTP;
