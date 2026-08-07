import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import { MdOutlineVerifiedUser } from "react-icons/md";
import OtpInput from "../../Components/otpBox";
import { Button, CircularProgress } from "@mui/material";

const VerifyResetOTP = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);

        const resetEmail = localStorage.getItem("resetEmail");
        console.log("VerifyResetOTP - Email from localStorage:", resetEmail);
        
        if (!resetEmail) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "لطفا ابتدا درخواست بازیابی رمز عبور کنید!"
            });
            history('/forgot-password');
        } else {
            setEmail(resetEmail);
        }
    }, [context, history]);

    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "کد وارد شده باید 6 رقمی باشد!"
            });
            return;
        }

        setIsLoading(true);

        try {
            const obj = {
                otp: otp,
                email: email
            };

            console.log("Verifying OTP for email:", email);
            const res = await postData(`/api/client/verify-reset-otp`, obj);
            console.log("Verify OTP Response:", res);

            if (res?.success === true) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: res.message
                });
                
                // Navigate to reset password page with email in URL
                setTimeout(() => {
                    history(`/reset-password?email=${encodeURIComponent(email)}`);
                }, 1500);
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res?.message || "کد وارد شده صحیح نیست!"
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "مشکلی در ارتباط با سرور وجود دارد!"
            });
            setIsLoading(false);
        }
    };

    const resendOTP = async () => {
        try {
            const res = await postData(`/api/client/forgot-password`, { email });
            
            if (res?.success === true) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "کد جدید به ایمیل شما ارسال شد!"
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res?.msg || "مشکل در ارسال مجدد کد!"
                });
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "مشکلی در ارسال مجدد کد وجود دارد!"
            });
        }
    };

    // Route protection - if already logged in, redirect to home
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token !== null && token !== undefined && token !== '') {
            history('/');
        }
    }, [history]);

    return (
        <section className="section signInPage otpPage">
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
                        <h2 className="mb-1 text-center">تایید کد بازیابی</h2>
                        <p className="text-center text-muted">
                            کد بازیابی به ایمیل <b>{email}</b> ارسال شد.
                        </p>

                        <p className="text-center text-muted mt-4">کد ارسال شده را وارد کنید:</p>
                        
                        <OtpInput length={6} onChange={handleOtpChange} />

                        <div className="text-center mt-2">
                            <Button 
                                type="button" 
                                className="text-muted" 
                                style={{background: 'none', border: 'none', cursor: 'pointer'}}
                                onClick={resendOTP}
                            >
                                ارسال مجدد کد
                            </Button>
                        </div>

                        <div className="d-flex align-items-center mt-4 mb-3">
                            <Button type="submit" className="col verifyOtpSubmitBtn">
                                {isLoading === true ? <CircularProgress /> : "تایید"}
                            </Button>
                        </div>

                        <h6 className="mt-4 text-center font-weight-bold">
                            آموزشگاه آزاد نانوزیست فناوری اوژن
                        </h6>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default VerifyResetOTP;