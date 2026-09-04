import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import Logo from "./../../assets/logo.png";
import Button from '@mui/material/Button';
import { CircularProgress } from "@mui/material";
import { postData } from "../../utils/api";

const ForgotPassword = () => {
    const context = useContext(MyContext);
    const history = useNavigate();
    
    const [phone, setPhone] = useState("");  // Only phone number
    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);
    }, []);

    // Route protection - if already logged in, redirect to home
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token !== null && token !== undefined && token !== '') {
            history('/');
        }
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input - only phone number
        if (!phone) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تلفن خود را وارد کنید!"
            });
            return;
        }

        // Validate phone number format
        if (phone.length !== 11) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تلفن معتبر وارد کنید! (مثال: 09123456789)"
            });
            return;
        }

        if (!phone.startsWith('09')) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تلفن باید با 09 شروع شود!"
            });
            return;
        }

        setLoader(true);
        setBtnDisabled(true);

        try {
            console.log("Sending forgot password request for phone:", phone);
            
            const res = await postData("/api/client/forgot-password", { email: phone });
            console.log("Forgot password response:", res);

            if (res?.error === true) {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.msg
                });
                setLoader(false);
                setBtnDisabled(false);
            } else if (res?.success === true) {
                // Save phone for OTP verification
                localStorage.setItem("resetIdentifier", phone);
                console.log("Reset phone saved to localStorage:", phone);
                
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: res.message
                });

                setTimeout(() => {
                    history('/verify-reset-otp');
                }, 2000);
            } else {
                // Handle unexpected response
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "مشکلی در ارسال کد بازیابی وجود دارد!"
                });
                setLoader(false);
                setBtnDisabled(false);
            }
        } catch (error) {
            console.error('Error in forgot password:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "مشکلی در ارتباط با سرور وجود دارد!"
            });
            setLoader(false);
            setBtnDisabled(false);
        }
    };

    return (
        <section className="section signInPage">
            <div className="shape-bottom">
                <svg fill="#fff" id="layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8">
                    <path className="st0" d="M1921,413.1v406.7H0V0.Sh0.41228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
                </svg>
            </div>

            <div className="container d-flex align-items-center h-100">
                <div className="box card p-3 shadow border-0">
                    <form className="mt-3" onSubmit={handleSubmit}>
                        <div className="d-flex align-items-center mb-3 ms-4">
                            <img src={Logo} className="signInLogo" alt="Logo" />
                            <h2 className="mx-1">بازیابی رمز عبور</h2>
                        </div>

                        <p className="text-muted mb-4 text-center">شماره تلفن خود را وارد کنید تا کد بازیابی برای شما ارسال شود.</p>

                        <div className="form-group">
                            <label className="mb-1">شماره تلفن</label>
                            <input 
                                name="phone" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                id="standard-basic" 
                                className="w-100" 
                                placeholder="09123456789"
                                dir="ltr"
                                maxLength="11"
                            />
                        </div>

                        <div className="d-flex align-items-center mt-3 mb-3 actionBtnWrapper">
                            <div className="w-50">
                                <Button 
                                    type="submit" 
                                    className={`col btn-lg enter ${btnDisabled !== false && 'btnDisabled'}`}
                                >
                                    ارسال کد
                                    {loader === true && 
                                        <CircularProgress
                                            sx={() => ({
                                                color: '#000',
                                                marginRight: '15px',
                                            })}
                                            enableTrackSlot size="25px" 
                                        />
                                    }
                                </Button>
                            </div>
                            <div className="w-50">
                                <Link to='/login'>
                                    <Button className="col btn-lg ml-1 cancel" variant="outlined">
                                        بازگشت
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <p className="txt">
                            حساب کاربری دارید؟ 
                            <Link to="/logIn" className="border-effect me-2">ورود به حساب</Link>
                        </p>

                        <h6 className="mt-5 text-center font-weight-bold">
                            آموزشگاه آزاد نانوزیست فناوری اوژن
                        </h6>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;