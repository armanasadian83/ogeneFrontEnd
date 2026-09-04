import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "../../App";
import Logo from "./../../assets/logo.png";
import Button from '@mui/material/Button';
import { CircularProgress } from "@mui/material";
import { RiEye2Fill, RiEyeCloseFill } from "react-icons/ri";
import { postData } from "../../utils/api";

const ChangePasswordNew = () => {
    const context = useContext(MyContext);
    const history = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [phone, setPhone] = useState("");

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);

        // Get phone from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const phoneFromUrl = searchParams.get('phone');
        
        // Also try to get from localStorage as fallback
        const phoneFromStorage = localStorage.getItem("changePasswordPhone");
        
        console.log("ChangePasswordNew - Phone from URL:", phoneFromUrl);
        console.log("ChangePasswordNew - Phone from localStorage:", phoneFromStorage);
        
        const resetPhone = phoneFromUrl || phoneFromStorage;
        
        if (!resetPhone) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "لطفا ابتدا مراحل تغییر رمز عبور را طی کنید!"
            });
            setTimeout(() => {
                history('/change-password');
            }, 2000);
        } else {
            setPhone(resetPhone);
            // Save to localStorage as backup
            localStorage.setItem("changePasswordPhone", resetPhone);
        }

        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            history('/login');
        }
    }, [location, context, history]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const revealPassword = () => {
        setIsPasswordShown(!isPasswordShown);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { newPassword, confirmPassword } = formData;

        // Validation
        if (newPassword === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "رمز عبور جدید را وارد کنید!"
            });
            return;
        }

        if (newPassword.length < 7) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "رمز عبور حداقل باید 7 حرف/عدد باشد!"
            });
            return;
        }

        if (newPassword.includes(" ")) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "فاصله در رمز عبور مجاز نیست!"
            });
            return;
        }

        if (confirmPassword === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "تکرار رمز عبور را وارد کنید!"
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "رمز عبور ها باهم تطابق ندارند!"
            });
            return;
        }

        setLoader(true);
        setBtnDisabled(true);

        try {
            console.log("Changing password for phone:", phone);
            
            const res = await postData("/api/client/change-password-final", {
                phone: phone,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });

            console.log("Change password response:", res);

            if (res?.error === true) {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.msg
                });
                setLoader(false);
                setBtnDisabled(false);
            } else if (res?.success === true) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: res.message
                });

                // Clear reset data
                localStorage.removeItem("changePasswordPhone");

                setTimeout(() => {
                    history('/profile');
                }, 2000);
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "مشکلی در تغییر رمز عبور وجود دارد!"
                });
                setLoader(false);
                setBtnDisabled(false);
            }
        } catch (error) {
            console.error("Error:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "مشکلی در تغییر رمز عبور وجود دارد!"
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
                            <h2 className="mx-1">رمز عبور جدید</h2>
                        </div>

                        <p className="text-muted mb-4 text-center">رمز عبور جدید خود را وارد کنید.</p>

                        <div className="form-group">
                            <label className="mb-1">رمز عبور جدید</label>
                            <span className='mx-2' style={{cursor: 'pointer'}}>
                                {isPasswordShown === false ? 
                                    <RiEyeCloseFill onClick={revealPassword} /> : 
                                    <RiEye2Fill onClick={revealPassword} />
                                }
                            </span>
                            <input 
                                name="newPassword" 
                                value={formData.newPassword}
                                onChange={handleChange}
                                type={isPasswordShown === false ? 'password' : 'text'} 
                                className="w-100"
                                onKeyDown={(e) => {
                                    if (e.key === " ") e.preventDefault();
                                }}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label className="mb-1">تکرار رمز عبور جدید</label>
                            <input 
                                name="confirmPassword" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                type={isPasswordShown === false ? 'password' : 'text'} 
                                className="w-100"
                            />
                        </div>

                        <div className="d-flex align-items-center mt-3 mb-3 actionBtnWrapper">
                            <div className="w-50">
                                <Button 
                                    type="submit" 
                                    className={`col btn-lg enter ${btnDisabled !== false && 'btnDisabled'}`}
                                >
                                    تغییر رمز
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
                                <Link to='/profile'>
                                    <Button className="col btn-lg ml-1 cancel" variant="outlined">
                                        بازگشت
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <h6 className="mt-5 text-center font-weight-bold">
                            آموزشگاه آزاد نانوزیست فناوری اوژن
                        </h6>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ChangePasswordNew;