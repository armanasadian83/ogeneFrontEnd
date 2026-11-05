import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import Home from "./Pages/Home";
import Navbar from "./Navbar";

import "./App.css";
import "./Responsive.css";
import { useLanguage } from "./i18n/LanguageContext";

import Footer from "./Components/Footer"; 
import CourseItem from "./Pages/CourseDetails";
import Service from "./Pages/Service";
import AboutUs from "./Pages/aboutUs";
import { createContext, useEffect, useRef, useState } from "react";
import CalenderBar from "./Components/CalenderHome/calenderBar";
import SignIn from "./Pages/logIn";
import SignUp from "./Pages/signUp";
import FieldOne from "./Pages/fieldsPages/fieldOne";
import FieldTwo from "./Pages/fieldsPages/fieldTwo";
import FieldThree from "./Pages/fieldsPages/fieldThree";
import FieldFour from "./Pages/fieldsPages/fieldFour";
import FieldFive from "./Pages/fieldsPages/fieldFive";
import FieldSix from "./Pages/fieldsPages/fieldSix";
import FaniHerfeiDegree from "./Pages/FaniHerfeiDegree";
import DegreeRequest from "./Pages/FaniHerfeiDegree/DegreeRequest";
import CourseShop from "./Pages/Listing/courseShop";
import Shop from "./Pages/Listing/shop";
import ProductItem from "./Pages/ProductDetails";

import LoadingBar from "react-top-loading-bar";
import { Alert, Snackbar } from "@mui/material";
import Cart from "./Pages/cart";
import Checkout from "./Pages/checkout";
import { fetchDataFromApi, postData, readStoredSession } from "./utils/api";
import VerifyOTP from "./Pages/verifyOTP";
import AccountPage from "./Pages/account/accountPage";
import Blog from "./Pages/Blog";
import BaleAlert from "./Components/baleAlert";
import OrderPage from "./Pages/orders";
import ForgotPassword from "./Pages/forgotPassword/ForgotPassword";
import VerifyResetOTP from "./Pages/forgotPassword/VerifyResetOTP";
import ResetPassword from "./Pages/forgotPassword/ResetPassword";
import ChangePassword from "./Pages/changePassword/ChangePassword";
import ChangePasswordVerifyOTP from "./Pages/changePassword/ChangePasswordVerifyOTP";
import ChangePasswordNew from "./Pages/changePassword/ChangePasswordNew";
import FailedPayment from "./Pages/payment/fail";
import SuccessPayment from "./Pages/payment/success";
import CompleteInfo from "./Pages/completeInfo";

export const MyContext = createContext();

const App = () => {
    const { t } = useLanguage();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isShowNavbar, setIsShowNavbar] = useState(true);
    const [isShowFooter, setIsShowFooter] = useState(true);
    const [isShowCalenderBar, setIsShowCalenderBar] = useState(true);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [itemView, setItemView] = useState(3);

    const handleClickOpenSearchModal = () => {
      setSearchModalOpen(true);
    };

    const handleCloseOpenSearchModal = () => {
      setSearchModalOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth < 1200){
                setItemView(4);
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //backend

    const [progress, setProgress] = useState(0);

    const [alertBox, setAlertBox] = useState({
        msg: '',
        error: false,
        open: false
    });

    const handleCloseAlertBox = (event,reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertBox({
            open: false,
        })
    }

    const [user, setUser] = useState({
        name: '',
        lastName: '',
        email: '',
        userId: ''
    })

    useEffect(() => {
        const session = readStoredSession();
        if (session) {
            setIsLoggedIn(true);
            setUser(session.user);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setUser({ name: "", lastName: "", email: "", userId: "" });
        }
    }, [isLoggedIn]);

    // vid 43 : add to cart
    const [addingInCart, setAddingInCart] = useState(false);
    const [cartData, setCartData] = useState([]);
    const cartSubmitLock = useRef(false);

    const addtoCart = async (data) => {
        if (cartSubmitLock.current) return;
        cartSubmitLock.current = true;
        setAddingInCart(true);
        try {
            const res = await postData(`/api/cart/add`, data);
            const validCartItem = res && typeof res === "object" && !Array.isArray(res)
                && !res.isAxiosError && !res.error && res.success !== false && res.status !== false
                && typeof (res._id || res.id) === "string"
                && res.productId === data.productId && res.userId === data.userId;
            if (!validCartItem) {
                setAlertBox({ open: true, error: true,
                    msg: res?.status === false ? (res.msg || 'این محصول در سبد خرید شما است!') : 'افزودن محصول به سبد خرید انجام نشد. دوباره تلاش کنید.' });
                return;
            } 
            setCartData((previous) => [...(Array.isArray(previous) ? previous : []), res]);
            setAlertBox({ open: true, error: false, msg: 'محصول به سبد خرید اضافه شد!' });
        } catch {
            setAlertBox({ open: true, error: true, msg: 'افزودن محصول به سبد خرید انجام نشد. دوباره تلاش کنید.' });
        } finally {
            cartSubmitLock.current = false;
            setAddingInCart(false);
        }
    }



    useEffect(() => {
        if (!isLoggedIn || !user.userId) {
            setCartData([]);
            return;
        }
        const controller = new AbortController();
        fetchDataFromApi(`/api/cart?userId=${user.userId}`, { signal: controller.signal, throwOnError: true })
            .then((res) => { if (!controller.signal.aborted) setCartData(Array.isArray(res) ? res : []); })
            .catch(() => { if (!controller.signal.aborted) setCartData([]); });
        return () => controller.abort();
    }, [isLoggedIn, user.userId]);

    // 16 June update:
    const [courseFilterValue, setCourseFilterValue] = useState(0);

    // 20 June update:
    const [isBaleIconShown, setIsBaleIconShown] = useState(true);





    const values = {
        isLoggedIn,
        setIsLoggedIn,
        setIsShowNavbar,
        setIsShowFooter,
        setIsShowCalenderBar,
        itemView,
        setItemView,
        searchModalOpen,
        setSearchModalOpen,
        handleClickOpenSearchModal,
        handleCloseOpenSearchModal,
        setProgress,
        alertBox,
        setAlertBox,
        user,
        setUser,
        addtoCart,
        setAddingInCart,
        addingInCart,
        cartData,
        courseFilterValue,
        setCourseFilterValue,
        isBaleIconShown,
        setIsBaleIconShown
    }

    return (
        <BrowserRouter>
        <MyContext.Provider value={values}>
            <LoadingBar color="#1866ee" progress={progress} onLoaderFinished={() => setProgress(0)} className='topLoadingBar'/>
                <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleCloseAlertBox} className="snackBar">
                    <Alert
                        onClose={handleCloseAlertBox}
                        severity={alertBox.error === false ? "success" : "error"}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {t(alertBox.msg)}
                    </Alert>
                </Snackbar>
            {isShowCalenderBar === true && <CalenderBar />}
            {isShowNavbar === true && <Navbar />}


            {isBaleIconShown && <BaleAlert />}

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/service" element={<Service />} />
                    <Route path="/aboutUs" element={<AboutUs />} />
                    <Route path="/course/:id" element={<CourseItem />} />
                    <Route path="/product/:id" element={<ProductItem />} />
                    <Route path="/logIn" element={<SignIn />} />
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/degree" element={<FaniHerfeiDegree />} />
                    <Route path="/degree/request" element={<DegreeRequest />} />
                    <Route path="/courseShop" element={<CourseShop />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/cart/:id" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/verifyOTP" element={<VerifyOTP />} />
                    <Route path="/accountPage/:id" element={<AccountPage />} />
                    <Route path="/orders/:id" element={<OrderPage />} />

                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/change-password-verify" element={<ChangePasswordVerifyOTP />} />
                    <Route path="/change-password-new" element={<ChangePasswordNew />} />

                    <Route path="/payment-success" element={<SuccessPayment />} />
                    <Route path="/payment-failed" element={<FailedPayment />} />

                    <Route path="/complete-info/:id" element={<CompleteInfo />} />

                    <Route path="/field/I" element={<FieldOne />} />
                    <Route path="/field/II" element={<FieldTwo />} />
                    <Route path="/field/III" element={<FieldThree />} />
                    <Route path="/field/IV" element={<FieldFour />} />
                    <Route path="/field/V" element={<FieldFive />} />
                    <Route path="/field/VI" element={<FieldSix />} />
                </Routes>
            {isShowFooter === true && <Footer />}
        </MyContext.Provider>
        </BrowserRouter>
    );
}
 
export default App;
