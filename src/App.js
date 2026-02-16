import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import Home from "./Pages/Home";
import Navbar from "./Navbar";

import "./App.css";
import "./Responsive.css";

import Footer from "./Components/Footer"; 
import CourseItem from "./Pages/CourseDetails";
import Service from "./Pages/Service";
import AboutUs from "./Pages/aboutUs";
import { createContext, useEffect, useState } from "react";
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
import CourseShop from "./Pages/Listing/courseShop";
import Shop from "./Pages/Listing/shop";
import ProductItem from "./Pages/ProductDetails";

import LoadingBar from "react-top-loading-bar";
import { Alert, Snackbar } from "@mui/material";
import Cart from "./Pages/cart";
import { fetchDataFromApi, postData } from "./utils/api";
import VerifyOTP from "./Pages/verifyOTP";
import AccountPage from "./Pages/account/accountPage";

export const MyContext = createContext();

const App = () => {

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

        const token = localStorage.getItem("token");
        if(token !== null && token !== undefined && token !== ''){
            setIsLoggedIn(true);

            const userData = JSON.parse(localStorage.getItem("user"));

            setUser(userData);

        }else{
            setIsLoggedIn(false);
        }

    }, [isLoggedIn]);

    // vid 43 : add to cart
    const [addingInCart, setAddingInCart] = useState(false);
    const [cartData, setCartData] = useState();

    const addtoCart = (data) => {
        setAddingInCart(true);
        postData(`/api/cart/add`, data).then((res) => {
            if(res !== null && res !== undefined && res !== ''){
                if(res.status !== false){
                    setAlertBox({
                        open: true,
                        error: false,
                        msg: 'محصول به سبد خرید اضافه شد!'
                    });

                    setTimeout(() => {
                        setAddingInCart(false);
                    }, 1000);

                }else{
                    setAlertBox({
                        open: true,
                        error: true,
                        msg: 'این محصول در سبد خرید شما است!'
                    });
                    setAddingInCart(false);
                }
            } 
        })
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
            setCartData(res);
        })
    }, [cartData]);





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
        cartData
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
                        {alertBox.msg}
                    </Alert>
                </Snackbar>
            {isShowCalenderBar === true && <CalenderBar />}
            {isShowNavbar === true && <Navbar />}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/service" element={<Service />} />
                    <Route path="/aboutUs" element={<AboutUs />} />
                    <Route path="/course/:id" element={<CourseItem />} />
                    <Route path="/product/:id" element={<ProductItem />} />
                    <Route path="/logIn" element={<SignIn />} />
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/degree" element={<FaniHerfeiDegree />} />
                    <Route path="/courseShop" element={<CourseShop />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/cart/:id" element={<Cart />} />
                    <Route path="/verifyOTP" element={<VerifyOTP />} />
                    <Route path="/accountPage/:id" element={<AccountPage />} />

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