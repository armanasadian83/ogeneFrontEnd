import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

import { MdOutlineVerifiedUser } from "react-icons/md";
import OtpInput from "../../Components/otpBox";
import { Button, CircularProgress } from "@mui/material";


const VerifyOTP = () => {

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

        const obj = {
            otp: otp,
            email: localStorage.getItem("userEmail"),
        };

        postData(`/api/client/verifyemail`, obj).then((res) => {
            if(res?.success === true){
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: res?.message
                });
                setIsLoading(false);
                localStorage.removeItem("userEmail");
                history("/logIn");
            }else{
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res?.message
                });
                setIsLoading(false);
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
        <section className="section signInPage otpPage">
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
                            {/*<div className="d-flex align-items-center mb-3 ms-4">
                                <img src={Logo} className="signInLogo" />
                                <h2 className="mx-1">ثبت نام</h2>
                            </div>*/}
                            <h2 className="mb-1 text-center">تایید ایمیل</h2>
                            <p className="text-center text-muted">کد ورود به ایمیل <b>{localStorage.getItem('userEmail')}</b> ارسال شد.</p>

                            <p className="text-center text-muted mt-4">کد ارسال شده را وارد کنید:</p>
                            
                            <OtpInput length={6} onChange={handleOtpChange} />

                            <div className="d-flex align-items-center mt-4 mb-3">
                                <Button type="submit" className="col verifyOtpSubmitBtn">
                                    {isLoading === true ? <CircularProgress /> : "تایید"}
                                </Button>
                            </div>

                            <h6 className="mt-4 text-center font-weight-bold">آموزشگاه آزاد نانوزیست فناوری اوژن</h6>


                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
 
export default VerifyOTP;