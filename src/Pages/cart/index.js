import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import Toman from "./../../assets/toman icon.png";
 
import { BsFillCartCheckFill } from "react-icons/bs";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import QuantityBox from "../../Components/quantityBox";
import { MdSupportAgent } from "react-icons/md";
 
const Cart = () => {
    const { t, dir, isEnglish, localize, formatNumber } = useLanguage();
 
    const context = useContext(MyContext);
    const navigate = useNavigate();
 
    useEffect(() => {
        context.setIsShowFooter(true); 
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);
 
    //backend : add to cart
 
    const {id} = useParams();
 
    const [cartData, setCartData] = useState([]);
    const [productQuantity, setProductQuantity] = useState();
    let [cartFields, setCartFeilds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [changedQuantity, setChangedQuantity] = useState(0);
 
    const [btnDisabled, setBtnDisabled] = useState(false);
 
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user?.userId === id){
            fetchDataFromApi(`/api/cart?userId=${id}`).then((res) => {
                setCartData(res);
                console.log(res);
        });
        }
    }, []);
 
    
    const quantity = (val) => {
        setProductQuantity(val);
    }
 
    const selectedItem = (item, inputVal) => {
        setIsLoading(true);
        setBtnDisabled(true);
        const user = JSON.parse(localStorage.getItem("user"));
 
        cartFields.productTitle = item?.productTitle;
        cartFields.image = item?.image;
        cartFields.price = item?.price;
        cartFields.quantity = inputVal;
        cartFields.subTotal = parseInt(item?.price * inputVal);
        cartFields.productId = item?.productId;
        cartFields.userId = user?.userId;
        cartFields.typeCourse = item?.typeCourse;
 
        editData(`/api/cart/${item?._id}`, cartFields).then((res) => {
            setIsLoading(false);
 
            fetchDataFromApi(`/api/cart?userId=${id}`).then((res) => {
                setCartData(res);
 
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
            })
        })
    }
 
 
    const removeItem = (cartId) => {
        setIsLoading(true);
        deleteData(`/api/cart/${cartId}`).then((res) => {
            
            fetchDataFromApi(`/api/cart?userId=${id}`).then((res) => {
                setCartData(res);
                setIsLoading(false);
            })
 
            context.setAlertBox({
                open: true,
                error: false,
                msg: t("محصول از سبد خرید حذف شد!", "The item was removed from your cart.")
            });
 
        })
    }
 
    // Add this function
    const calculateTotal = () => {
        if (cartData?.length !== 0 && cartData?.length !== undefined) {
            return cartData
                .map(item => parseInt(item?.price) * item?.quantity)
                .reduce((total, value) => total + value, 0);
        }
        return 0;
    }
 
 
    /*const sendAlert = () => {
        alert('به زودی امکان ثبت سفارش فراهم میشود!');
    }*/
 
    // دریافت اطلاعات تحویل پیش از شروع پرداخت در صفحه تسویه حساب.
    const submitOrder = () => {
        const user = JSON.parse(localStorage.getItem("user"));
 
        // Validate if user is logged in
        if (!user || !user.userId) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("لطفاً ابتدا وارد حساب کاربری خود شوید!", "Please sign in first.")
            });
            return;
        }
 
        // Validate cart is not empty
        if (!cartData || cartData.length === 0) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("سبد خرید شما خالی است!", "Your cart is empty.")
            });
            return;
        }
 
        navigate('/checkout');
    }
 
    return (
        <>
        <div className="cartPage container" dir={dir}>
            <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb ">
                <Link to="/" ><b> {t("خانه", "Home")} </b></Link> /
                <Link to="/cart" ><b>{t("سبد خرید", "Cart")}</b></Link> /
                <Link to="" ><b>{`${context.user?.name} ${context.user?.lastName}`}</b></Link>
            </p>
 
            <div className="cartPageHead">
                <h1>{t("سبد خرید من", "My cart")}</h1>
                <p>{t("شما", "You have")} <b>{cartData?.length}</b> {t("محصول در سبد خرید خود دارید.", "items in your cart.")}</p>
            </div>
 
            <div className="cartLayout">
 
                <div className="cartItemsCard">
 
                    {cartData?.length ? (
                        <>
                            <div className="cartItemsHead">{t("آیتم‌های سبد خرید", "Cart items")}</div>
 
                            {cartData.map((item, index) => (
                                <div className="cartItemRow" key={item?._id || index}>
                                    <div className="miniBox">
                                        {index + 1}
                                    </div>
 
                                    <Link
                                        to={item?.typeCourse ? `/course/${item?.productId}` : `/product/${item?.productId}`}
                                        className="cartThumbLink"
                                    >
                                        <div className="cartThumb">
                                            <img className="w-100" src={item?.image} alt={localize(item, "productTitle")} />
                                        </div>
                                    </Link>
 
                                    <div className="cartInfo">
                                        <Link
                                            to={item?.typeCourse ? `/course/${item?.productId}` : `/product/${item?.productId}`}
                                            className="cartInfoLink"
                                        >
                                            <h6>{localize(item, "productTitle")?.substr(0, 30) + '...'}</h6>
                                        </Link>
                                        <div className="cartMeta">
                                            <span className={`item-type-badge ${item?.typeCourse ? 'type-course' : 'type-product'}`}>
                                                {item?.typeCourse ? t("دوره", "Course") : t("محصول", "Product")}
                                            </span>
                                            <span className="unitPrice">{t("قیمت واحد:", "Unit price:")} {formatNumber(item?.price)} {t("تومان", "Toman")}</span>
                                        </div>
                                    </div>
 
                                    <div className="qtyBlock">
                                        {
                                            item?.typeCourse !== true
                                                ? (
                                                    <div className="qtyStepperWrap">
                                                        <QuantityBox
                                                            value={item?.quantity}
                                                            selectedItem={selectedItem}
                                                            item={item}
                                                            quantity={quantity}
                                                            btnDisabled={btnDisabled}
                                                        />
                                                    </div>
                                                )
                                                : (
                                                    <div className="qtyFixed">{t("۱ آیتم (دوره)", "1 item (course)")}</div>
                                                )
                                        }
                                    </div>
 
                                    <div className="lineSubtotal">
                                        <small>{t("قیمت کل", "Total price")}</small>
                                        <span className="rowTotal">{formatNumber(item?.subTotal)} {t("تومان", "Toman")}</span>
                                    </div>
 
                                    <Button
                                        onClick={() => { removeItem(item?._id) }}
                                        className="removeBtn"
                                        title={t("حذف از سبد", "Remove from cart")}
                                        sx={{
                                            minWidth: '34px',
                                            width: '34px',
                                            height: '34px',
                                            padding: 0,
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18" />
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </Button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="emptyCart">
                            <span>{t("سبد خرید شما خالی است!", "Your cart is empty.")}</span>
                        </div>
                    )}
 
                </div>
 
                <div className="summaryCard">
                    <h6>{t("مجموع سفارش", "Order total")}</h6>
 
                    <div className="summaryRow">
                        <span>{t("تعداد سفارش", "Number of items")}</span>
                        <b>{cartData?.length}</b>
                    </div>
 
                    <div className="summaryTotalRow">
                        <span className="summaryTotalLabel">{t("مجموع", "Total")}</span>
                        <span className="summaryTotalValue">
                            {formatNumber(calculateTotal())}
                            {isEnglish ? <span>{t("تومان", "Toman")}</span> : <img src={Toman} className="summaryTomanIcon" alt={t("تومان", "Toman")} />}
                        </span>
                    </div>
 
                    <Button
                        className="orderSubmit"
                        onClick={submitOrder}
                        disabled={btnDisabled || isLoading || !cartData || cartData.length === 0}
                    >
                        {isLoading ? t("در حال ثبت...", "Submitting...") : t("ثبت سفارش و پرداخت", "Checkout and pay")}
                        <BsFillCartCheckFill />
                    </Button>
                </div>
 
            </div>
 
            {
                cartData?.length > 0 ? (
                    <>
                    <div className="cartPageText">
                        <p>{t("سبد خرید اوژن، دروازه ورود شما به دنیای تخصصی نانوزیست‌فناوری و ژنتیک مولکولی است. تمامی دوره‌ها، کارگاه‌های عملی و خدمات پژوهشی ثبت‌شده در این صفحه، با دقت بالایی توسط تیم علمی ما پالایش شده‌اند تا کاملاً با نیازهای پایان‌نامه‌ای و آزمایشگاهی شما همخوانی داشته باشند. پیش از نهایی‌سازی سفارش، یک بار دیگر سبد خود را بررسی کنید تا از تطابق دوره یا خدمت انتخابی با رشته تخصصی‌تان (ژنتیک پزشکی، میکروبیولوژی، بیوانفورماتیک و...) اطمینان حاصل فرمایید. در صورت ابهام در انتخاب بین چند دوره یا نیاز به تنظیم زمان‌بندی کارگاه، تیم مشاوره علمی اوژن آماده پاسخگویی است تا خریدی هوشمندانه و هدفمند داشته باشید.", "Ogene's cart is your gateway to specialist training in nanobiotechnology and molecular genetics. Our scientific team reviews every course, practical workshop, and research service to support the needs of laboratory and thesis work. Before completing your order, check that your selections match your field, including medical genetics, microbiology, or bioinformatics. If you need help choosing a course or arranging a workshop schedule, our scientific advisers can guide you toward a suitable option.")}</p>
 
                        <p>{t("قدم بزرگی برای توسعه مهارت‌های عملی و نظری‌تان برداشته‌اید! در اوژن، ما به کیفیت آموزش و تجهیزات آزمایشگاهی‌مان افتخار می‌کنیم و مطمئنیم که انتخاب شما، نقطه عطفی در مسیر حرفه‌ای‌تان خواهد بود. برای تکمیل ثبت‌نام و تضمین جایگاه شما در کارگاه‌های عملی (که ظرفیت محدودی دارند)، توصیه می‌کنیم هرچه سریع‌تر فرایند پرداخت را نهایی کنید. پس از خرید، تمامی جزئیات دسترسی به کلاس‌های مجازی/حضوری، سرفصل‌های به‌روز شده و پشتیبانی اختصاصی از سوی کارشناسان مجموعه برای شما ارسال خواهد شد. ما در کنار شما هستیم تا این سفر علمی را با بهترین نتیجه به پایان برسانید.", "You have taken an important step toward building your practical and theoretical skills. Ogene offers quality teaching and laboratory equipment to support your professional development. Complete your payment to secure a place in practical workshops, where capacity is limited. After purchase, our team will send the relevant online or in-person class access details, updated syllabus, and specialist support information. We will support you throughout your learning experience.")}</p>
 
                        <Button
                            className="getHelp"
                            onClick={() => window.location.href = "tel:0212244961487"}
                        >
                            {t("ارتباط با پشتیبانی", "Contact support")}
                            <MdSupportAgent />
                        </Button>
                    </div>
                    </>
                ) : (
                    <>
                    <div className="cartPageText">
                        <p>{t("سبد خرید شما در حال حاضر خالی است. اما نگران نباشید! در اوژن، دوره‌ها و کارگاه‌های تخصصی متنوعی در حوزه‌های نانوزیست‌فناوری، ژنتیک پزشکی و مولکولی، میکروبیولوژی، بیوتکنولوژی، مهندسی بافت و بیوانفورماتیک منتظر شما هستند. از آموزش‌های عملی آزمایشگاهی گرفته تا خدمات پژوهشی و مشاوره پایان‌نامه، همه چیز برای پیشرفت مسیر علمی‌تان در یکجا جمع شده است.", "Your cart is currently empty. Ogene offers specialist courses and workshops in nanobiotechnology, medical and molecular genetics, microbiology, biotechnology, tissue engineering, and bioinformatics. From practical laboratory training to research services and thesis advice, explore options that support your academic and professional development.")}</p>
 
                        <p>{t("همین حالا به", "Visit our")} <Link to={'/shop'}>{t("فروشگاه", "Shop")}</Link> {t("یا", "or")} <Link to={'/courseShop'}>{t("صفحه دوره‌ها", "Courses")}</Link> {t("ما سر بزنید و بهترین گزینه را برای ارتقای مهارت‌های خود انتخاب کنید. اگر هم نیاز به راهنمایی دارید، تیم پشتیبانی اوژن آماده است تا شما را در مسیر درست هدایت کند. منتظر دیدن شما در جمع کارآموزان موفق اوژن هستیم!", "to find an option that develops your skills. If you need help choosing, Ogene's support team can guide you. We look forward to welcoming you to our learning community.")}</p>
                    </div>
                    <Button
                        className="getHelp paddingforMobile"
                        onClick={() => window.location.href = "tel:0212244961487"}
                    >
                        {t("ارتباط با پشتیبانی", "Contact support")}
                        <MdSupportAgent />
                    </Button>
                    </>
                )
            }
 
        </div>
        </>
    );
}
 
export default Cart;
