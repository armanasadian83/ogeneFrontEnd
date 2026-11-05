import { customerMessage } from "../account/customerMessages";
import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

import { MdOutlineVerifiedUser } from "react-icons/md";
import OtpInput from "../../Components/otpBox";
import { Button, CircularProgress } from "@mui/material";


const VerifyOTP = () => {
    const { t, dir } = useLanguage();

    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");   

    const context = useContext(MyContext);
    const history = useNavigate();

    const handleOtpChange = (value) => {
        setOtp(value);
    }

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false); 
        context.setIsShowCalenderBar(false);
    }, []);

    const verify = (e) => {
        e.preventDefault();
        console.log('verify');

        // CHANGED: Use phone instead of email
        const obj = {
            otp: otp,
            phone: localStorage.getItem("userPhone"),  // Changed from email to phone
        };

        // CHANGED: Use verify-phone endpoint instead of verifyemail
        postData(`/api/client/verify-phone`, obj).then((res) => {
            setIsLoading(false);
            if(res?.success === true){
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: customerMessage(t, res?.message)
                });
                localStorage.removeItem("userPhone");  // Changed from userEmail
                // Also remove email if exists
                localStorage.removeItem("userEmail");
                history("/logIn");
            }else{
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: customerMessage(t, res?.message)
                });
            }
        });
    }


    // route protection
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token !== null && token !== undefined && token !== ''){
            history('/');
        }else{
            context.setIsLoggedIn(false);
        }
    }, []);

    return (
        <>
        <section dir={dir} className="section signInPage otpPage">
                <div className="shape-bottom">
                    <svg fill="#fff" id="layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8" 
                      style={{enableBackground: "new 0 0 1921 819.8"}}>
                        <path className="st0" d="M1921,413.1v406.7H0V0.Sh0.41228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.
                        1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
                      </svg>
                </div>

                <div className="container d-flex align-items-center h-100">
                    <div className="box card p-3 shadow border-0">
                        <div className="text-center mt-2">
                            <MdOutlineVerifiedUser style={{fontSize: '60px', color: '#31c19fff'}} />
                        </div>
                        <form className="mt-0" onSubmit={verify}>
                            {/* CHANGED: Title and message to use phone instead of email */}
                            <h2 className="mb-1 text-center">{t("تایید شماره تلفن", "Verify your phone number")}</h2>
                            <p className="text-center text-muted">{t("کد تایید به شماره تلفن", "A verification code was sent to")} <b>{localStorage.getItem('userPhone')}</b> {t("ارسال شد.", ".")}</p>

                            <p className="text-center text-muted mt-4">{t("کد ارسال شده را وارد کنید:", "Enter the verification code:")}</p>
                            
                            <OtpInput length={6} onChange={handleOtpChange} />

                            <div className="d-flex align-items-center mt-4 mb-3">
                                <Button type="submit" className="col verifyOtpSubmitBtn">
                                    {isLoading === true ? <CircularProgress /> : t("تایید", "Verify")}
                                </Button>
                            </div>

                            <h6 className="mt-4 text-center font-weight-bold">{t("آموزشگاه آزاد نانوزیست فناوری اوژن", "Ogene Nanobiotechnology Training Institute")}</h6>

                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
 
export default VerifyOTP;