import { customerMessage } from "../account/customerMessages";
import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MyContext } from "../../App";
import Logo from "./../../assets/logo.png"
import { useState } from "react";
import { isUsableToken, postAuthData, readStoredSession, safeReturnTo, toStoredUser } from "../../utils/api";
import { CircularProgress } from "@mui/material";

import { RiEye2Fill } from "react-icons/ri";
import { RiEyeCloseFill } from "react-icons/ri";


const SignIn = () => {
    const { t, dir } = useLanguage();
    
    const context = useContext(MyContext);
    const { setIsShowFooter, setIsShowNavbar, setIsShowCalenderBar } = context;

    // ✅ Read returnTo from the URL once
    const [searchParams] = useSearchParams();
    const goAfterLogin = safeReturnTo(searchParams.get("returnTo"));

    useEffect(() => {
        setIsShowFooter(false);
        setIsShowNavbar(false);
        setIsShowCalenderBar(false);
    }, [setIsShowFooter, setIsShowNavbar, setIsShowCalenderBar]);

    //backend

    const history = useNavigate();
    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const submitLock = useRef(false);
    const timers = useRef([]);
    const mounted = useRef(true);
    const { setIsLoggedIn, setUser } = context;

    useEffect(() => {
        mounted.current = true;
        const pendingTimers = timers.current;
        return () => {
            mounted.current = false;
            pendingTimers.forEach(clearTimeout);
        };
    }, []);

    const [formFields, setFormFields] = useState({
        email: "",  // Can be email OR phone
        password: ""
    });

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name] : e.target.value
        }));
    }

    const logIn = async (e) => {

        e.preventDefault();
        if (submitLock.current) return;
    
        if(formFields.email.trim() === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("شماره موبایل را وارد کنید!", "Enter your mobile number.")
            });
            return false;
        }

        if(formFields.password === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("رمز عبور را وارد کنید!", "Enter your password.")
            });
            return false;
        }

        if(formFields.password.includes(" ")){
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("فاصله در رمز عبور مجاز نیست!", "Passwords cannot contain spaces.")
            });
            return false;
        }

        submitLock.current = true;
        setLoader(true);
        setBtnDisabled(true);
        let leaving = false;
        try {
            const res = await postAuthData("/api/client/signin", { ...formFields, email: formFields.email.trim() });
            if (!mounted.current) return;
            const id = res?.user?.id || res?.user?._id;
            if (res?.error !== true && res?.success !== false && isUsableToken(res?.token)
                && typeof id === "string" && id.trim() && !/^(undefined|null)$/i.test(id.trim())) {
                const user = toStoredUser({ ...res.user, userId: id });
                localStorage.setItem("token", res.token.trim());
                localStorage.setItem("user", JSON.stringify(user));
                setUser?.(user);
                setIsLoggedIn(true);
                context.setAlertBox({ open: true, error: false, msg: t("با موفقیت وارد شدید!", "You signed in successfully.") });
                leaving = true;
                timers.current.push(setTimeout(() => history(goAfterLogin, { replace: true }), 1000));
            } else if (res?.verified === false) {
                localStorage.setItem("userPhone", res.phone || formFields.email.trim());
                context.setAlertBox({ open: true, error: false, msg: customerMessage(t, res.msg || t("کد تایید به شماره موبایل شما ارسال گردید!", "A verification code was sent to your mobile number.")) });
                leaving = true;
                timers.current.push(setTimeout(() => history("/verifyOTP"), 2000));
            } else {
                context.setAlertBox({ open: true, error: true, msg: customerMessage(t, res?.msg || res?.message || t("ورود انجام نشد. دوباره تلاش کنید.", "Sign-in failed. Please try again.")) });
            }
        } catch {
            if (mounted.current) context.setAlertBox({ open: true, error: true, msg: t("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.", "Could not connect to the server. Please try again.") });
        } finally {
            if (mounted.current) {
                setLoader(false);
                if (!leaving) {
                    submitLock.current = false;
                    setBtnDisabled(false);
                }
            }
        }
    }

    useEffect(() => {
        if (readStoredSession()) {
            history(goAfterLogin, { replace: true });
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
        }
    }, [goAfterLogin, history, setIsLoggedIn]);

    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const revealPassword = () => {
        setIsPasswordShown(!isPasswordShown);
    }

    return (
        <>
            <section dir={dir} className="section signInPage">
                <div className="shape-bottom">
                    <svg fill="#fff" id="layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8" 
                      style={{enableBackground: "new 0 0 1921 819.8"}}>
                        <path className="st0" d="M1921,413.1v406.7H0V0.Sh0.41228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.
                        1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
                      </svg>
                </div>

                <div className="container d-flex align-items-center h-100">
                    <div className="box card p-3 shadow border-0">
                        <form className="mt-3" onSubmit={logIn}>
                            <div className="d-flex align-items-center mb-3 ms-4">
                                <img src={Logo} className="signInLogo" alt="Logo" />
                                <h2 className="mx-1">{t("ورود به حساب کاربری", "Sign in to your account")}</h2>
                            </div>
                            <div className="form-group">
                                <label className="mb-1" htmlFor="login-phone">{t("شماره موبایل", "Mobile number")}</label>
                                <input name="email" onChange={onChangeInput} id="login-phone" className="w-100" disabled={btnDisabled} />
                            </div>
                            <div className="form-group">
                                <label className="mb-1" htmlFor="login-password">{t("رمز عبور", "Password")}</label>
                                <span className='mx-2' style={{cursor: 'pointer'}}>{isPasswordShown === false ? <RiEyeCloseFill onClick={revealPassword} /> : <RiEye2Fill onClick={revealPassword} />}</span>
                                <input name="password" onChange={onChangeInput} type={isPasswordShown === false ? 'password' : 'text'} id="login-password" className="w-100 inputFont" disabled={btnDisabled}
                                    onKeyDown={(e) => {
                                        if (e.key === " ") e.preventDefault();
                                    }}
                                />
                            </div>


                            <div className="border-effect">
                                <Link to="/forgot-password" className="border-effect cursor txt">
                                    {t("رمز عبور خود را فراموش کرده‌اید؟", "Forgot your password?")}
                                </Link>
                            </div>

                            <div className="d-flex align-items-center mt-3 mb-3 actionBtnWrapper">
                                <div className="w-50">
                                    <Button type="submit" disabled={btnDisabled} className={`col btn-lg enter ${btnDisabled !== false && 'btnDisabled'}`}>
                                        {t("ورود", "Sign in")}
                                        {
                                            loader === true && 
                                            <CircularProgress
                                                sx={() => ({
                                                    color: '#000',
                                                    marginRight: '15px',
                                                })}
                                                size="25px"
                                            />
                                        }
                                    </Button>
                                </div>
                                <div className="w-50">
                                    <Link to='/'>
                                        <Button className="col btn-lg ml-1 cancel" variant="outlined">{t("انصراف", "Cancel")}</Button>
                                    </Link>
                                </div>
                            </div>

                            <p className="txt">{t("حساب کاربری ندارید؟", "Don't have an account?")}<Link to="/signup" className="border-effect me-2">{t("ثبت نام", "Sign up")}</Link></p>

                            <h6 className="mt-5 text-center font-weight-bold">{t("آموزشگاه آزاد نانوزیست فناوری اوژن", "Ogene Nanobiotechnology Training Institute")}</h6>


                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
 
export default SignIn;
