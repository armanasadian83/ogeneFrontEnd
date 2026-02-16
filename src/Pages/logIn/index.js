import { useContext, useEffect } from "react";
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import Logo from "./../../assets/logo.png"
import { useState } from "react";
import { postAuthData } from "../../utils/api";
import { CircularProgress } from "@mui/material";

import { RiEye2Fill } from "react-icons/ri";
import { RiEyeCloseFill } from "react-icons/ri";


const SignIn = () => {
    
    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(false); 
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);
    }, []);

    //backend

    const history = useNavigate();
    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const [formFields, setFormFields] = useState({
        email: "",
        password: ""
    });

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name] : e.target.value
        }));
    }

    const logIn = (e) => {

        e.preventDefault();
    
        if(formFields.email === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "ایمیل را وارد کنید!"
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
        postAuthData("/api/client/signin", formFields).then((res) => {
                        
            try {
                if(res.error !== true){
    
                localStorage.setItem("token", res.token);
    
                const user={
                    name: res.user?.name,
                    lastName: res.user?.lastName,
                    email: res.user?.email,
                    userId: res.user?.id
                }
    
                localStorage.setItem("user", JSON.stringify(user));
    
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "با موفقیت وارد شدید!"
                });
        
                setTimeout(() => {
                    window.location.href = "/"
                }, 1000);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 2000);
                
                setLoader(false);
                }
                else{
                    setLoader(false);
                    setBtnDisabled(false);

                    if(res.verified === false){
                        // otp
                        localStorage.setItem("userEmail", formFields.email);

                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "کد تایید به ایمیل شما ارسال گردید!"
                        }); 

                        setTimeout(() => {
                            history('/verifyOTP')
                        }, 2000);
                    }

                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                }
            } catch (error) {
                console.log(error);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 2000);
            }
        
        }).catch(error => {
            console.error('Error posting data:', error);

            setTimeout(() => {
                setBtnDisabled(false);
            }, 2000);
        });
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

    return (
        <>
            <section className="section signInPage">
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
                                <img src={Logo} className="signInLogo" />
                                <h2 className="mx-1">ورود به حساب کاربری</h2>
                            </div>
                            <div className="form-group">
                                <label className="mb-1">ایمیل</label>
                                <input name="email" onChange={onChangeInput} id="standard-basic" className="w-100" />
                            </div>
                            <div className="form-group">
                                <label className="mb-1">رمز عبور</label>
                                <span className='mx-2' style={{cursor: 'pointer'}}>{isPasswordShown === false ? <RiEyeCloseFill onClick={revealPassword} /> : <RiEye2Fill onClick={revealPassword} />}</span>
                                <input name="password" onChange={onChangeInput} type={isPasswordShown === false ? 'password' : 'text'} id="standard-basic" className="w-100 inputFont"
                                    onKeyDown={(e) => {
                                        if (e.key === " ") e.preventDefault();
                                    }}
                                />
                            </div>


                            <a className="border-effect cursor txt">رمز عبور خود را فراموش کرده اید؟</a>

                            <div className="d-flex align-items-center mt-3 mb-3 actionBtnWrapper">
                                <div className="w-50">
                                    <Button type="submit" className={`col btn-lg enter ${btnDisabled !== false && 'btnDisabled'}`}>
                                        ورود
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

                            <p className="txt">حساب کاربری ندارید؟<Link to="/signup" className="border-effect me-2">ثبت نام</Link></p>

                            <h6 className="mt-5 text-center font-weight-bold">آموزشگاه آزاد نانوزیست فناوری اوژن</h6>


                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
 
export default SignIn;