import { useContext, useEffect } from "react";
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import Logo from "./../../assets/logo.png";
import Checkbox from '@mui/material/Checkbox';
import { useState } from "react";
import { postAuthData } from "../../utils/api";
import { CircularProgress } from "@mui/material";

import { RiEye2Fill } from "react-icons/ri";
import { RiEyeCloseFill } from "react-icons/ri";

const SignUp = () => {
    
    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false); 
        context.setIsShowCalenderBar(false);
    }, []);

    const [acceptPolicies, setAcceptPolicies] = useState(false);

    const handleCheckPolicies = () => {
        setAcceptPolicies(!acceptPolicies);
    }

    const history = useNavigate();
    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const [formFields, setFormFields] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name] : e.target.value
        }));
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token !== null && token !== undefined && token !== ''){
            history('/');
        }else{
            context.setIsLoggedIn(false);
        }
    }, []);

    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const revealPassword = () => {
        setIsPasswordShown(!isPasswordShown);
    }

    const register = (e) => {
        e.preventDefault();

        try {
            if(formFields.name === ""){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "نام را وارد کنید!"
                });
                return false;
            }

            // Phone is now REQUIRED
            if(formFields.phone === ""){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "شماره تلفن را وارد کنید!"
                });
                return false;
            }

            if(formFields.phone.length !== 11){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "شماره تلفن معتبر وارد کنید!"
                });
                return false;
            }

            // Email is now OPTIONAL - only validate if provided
            if(formFields.email && !formFields.email.includes('@')){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "ایمیل معتبر وارد کنید!"
                });
                return false;
            }

            if(formFields.password === ""){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "رمز عبور را وارد کنید!"
                });
                return false;
            }

            if(formFields.confirmPassword !== formFields.password){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "رمز عبور ها باهم تطابق ندارند!"
                });
                return false;
            }

            if(acceptPolicies === false){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "قوانین و ضوابط را قبول کنید!"
                });
                return false;
            }

            if(formFields.password.length < 7){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "رمز عبور حداقل باید 7 حرف/عدد باشد!"
                });
                return false;
            }

            if(formFields.password.includes(" ")){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "فاصله در رمز عبور مجاز نیست!"
                });
                return false;
            }

            setLoader(true);
            setBtnDisabled(true);

            postAuthData("/api/client/signup", formFields).then((res) => {

                if(res.error !== true){
                    // CHANGED: Save phone instead of email for OTP verification
                    localStorage.setItem("userPhone", formFields.phone);
                    // Also save email if provided (for other purposes)
                    if(formFields.email) {
                        localStorage.setItem("userEmail", formFields.email);
                    }

                    // CHANGED: SMS message instead of email
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "کد تایید به شماره تلفن شما ارسال گردید!"
                    }); 

                    setTimeout(() => {
                        history('/verifyOTP')
                    }, 2000);

                } else {
                    setLoader(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });

                    if(res?.isVerify === false){
                        setTimeout(() => {
                            history('/logIn')
                        }, 2000);
                    }
                    
                    setTimeout(() => {
                        setBtnDisabled(false);
                    }, 2000);
                }

            }).catch(error => {
                console.error('Error posting data:', error);
                setLoader(false);
                setBtnDisabled(false);
            });
            
        } catch (error){
            console.log(error);
            setLoader(false);
            setBtnDisabled(false);
        }
    }

    return (
        <>
            <section className="section signInPage signUp">
                <div className="shape-bottom">
                    <svg fill="#fff" id="layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8" 
                      style={{enableBackground: "new 0 0 1921 819.8"}}>
                        <path className="st0" d="M1921,413.1v406.7H0V0.Sh0.41228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.
                        1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
                      </svg>
                </div>

                <div className="container d-flex align-items-center h-100">
                    <div className="box card p-3 shadow border-0">
                        <form className="mt-3" onSubmit={register}>
                            <div className="d-flex align-items-center mb-3 ms-4">
                                <img src={Logo} className="signInLogo" />
                                <h2 className="mx-1">ثبت نام</h2>
                            </div>
                            <div className="row">
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">نام</label>
                                    <input name="name" onChange={onChangeInput} id="standard-basic" className="w-100" />
                                </div>
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">نام خانوادگی</label>
                                    <input name="lastName" onChange={onChangeInput} id="standard-basic" className="w-100" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="mb-1">شماره تلفن</label>
                                <input name="phone" onChange={onChangeInput} id="standard-basic" className="w-100" />
                            </div>

                            <div className="form-group">
                                <label className="mb-1">ایمیل</label>
                                <input name="email" onChange={onChangeInput} id="standard-basic" className="w-100" placeholder="اختیاری" />
                            </div>

                            <div className="row">
                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">رمز عبور</label>
                                    <span className='mx-2' style={{cursor: 'pointer'}}>{isPasswordShown === false ? <RiEyeCloseFill onClick={revealPassword} /> : <RiEye2Fill onClick={revealPassword} />}</span>
                                    <input name="password" onChange={onChangeInput} id="standard-basic" type={isPasswordShown === false ? 'password' : 'text'} className="w-100"
                                        onKeyDown={(e) => {
                                            if (e.key === " ") e.preventDefault();
                                        }}
                                    />
                                </div>

                                <div className="form-group col-12 col-md-6">
                                    <label className="mb-1">تکرار رمز عبور</label>
                                    <input name="confirmPassword" onChange={onChangeInput} type={isPasswordShown === false ? 'password' : 'text'} id="standard-basic" className="w-100"  />
                                </div>
                            </div>

                            <label className="checkBoxLabel">قوانین و ضوابط را قبول دارم</label>
                            <Checkbox checked={acceptPolicies} onChange={handleCheckPolicies}  />

                            <div className="d-flex align-items-center mt-3 mb-3 actionBtnWrapper">
                                <div className="w-50">
                                    <Button type="submit" className={`col btn-lg enter ${btnDisabled !== false && 'btnDisabled'}`}>
                                    ثبت نام
                                    {
                                        loader === true && 
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
                                    <Link to='/'>
                                        <Button className="col btn-lg ml-1 cancel" variant="outlined">انصراف</Button>
                                    </Link>
                                </div>
                            </div>

                            <p className="txt">قبلا حساب کاربری ساخته اید؟<Link to="/logIn" className="border-effect me-2">ورود به حساب کاربری</Link></p>

                            <h6 className="mt-5 text-center font-weight-bold">آموزشگاه آزاد نانوزیست فناوری اوژن</h6>

                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
 
export default SignUp;