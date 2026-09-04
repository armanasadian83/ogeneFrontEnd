import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import Logo from "./../../assets/logo.png";
import Button from '@mui/material/Button';
import { CircularProgress } from "@mui/material";
import { postData } from "../../utils/api";

const ChangePassword = () => {
    const context = useContext(MyContext);
    const history = useNavigate();

    const [phone, setPhone] = useState("");
    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);

        // Get user phone from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setPhone(user.phone);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }

        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "لطفا ابتدا وارد حساب کاربری خود شوید!"
            });
            history('/login');
        }
    }, [context, history]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phone) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تلفن خود را وارد کنید!"
            });
            return;
        }

        if (phone.length !== 11) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تلفن معتبر وارد کنید!"
            });
            return;
        }

        setLoader(true);
        setBtnDisabled(true);

        try {
            const res = await postData("/api/client/change-password-send-otp", { phone });

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
                localStorage.setItem("changePasswordPhone", phone);
                
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: res.message
                });

                setTimeout(() => {
                    history('/change-password-verify');
                }, 2000);
            }
        } catch (error) {
            console.error('Error:', error);
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
                            <h2 className="mx-1">تغییر رمز عبور</h2>
                        </div>

                        <p className="text-muted mb-4 text-center">
                            کد تایید به شماره تلفن شما ارسال خواهد شد.
                        </p>

                        <div className="form-group">
                            <label className="mb-1">شماره تلفن</label>
                            <input 
                                name="phone" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-100" 
                                placeholder="09123456789"
                                dir="ltr"
                                maxLength="11"
                                readOnly={phone ? true : false}
                                style={{ backgroundColor: phone ? '#f5f5f5' : 'white' }}
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
                                <Link to='/'>
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

export default ChangePassword;