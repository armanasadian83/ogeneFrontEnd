import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import Toman from "./../../assets/toman icon.png";

import { BsFillCartCheckFill } from "react-icons/bs";
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";
import QuantityBox from "../../Components/quantityBox";
import { MdSupportAgent } from "react-icons/md";

const Cart = () => {

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
                msg: 'محصول از سبد خرید حذف شد!'
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

    // adding order submit function:

    const submitOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Validate if user is logged in
    if (!user || !user.userId) {
        context.setAlertBox({
            open: true,
            error: true,
            msg: 'لطفاً ابتدا وارد حساب کاربری خود شوید!'
        });
        return;
    }

    // Validate cart is not empty
    if (!cartData || cartData.length === 0) {
        context.setAlertBox({
            open: true,
            error: true,
            msg: 'سبد خرید شما خالی است!'
        });
        return;
    }

    // Calculate total
    const total = calculateTotal();

    // Prepare order data
    const orderData = {
        clientName: `${user?.name || ''} ${user?.lastName || ''}`.trim(),
        clientId: user.userId,
        clientPhoneNumber: user?.phone,
        totalPrice: total,
        items: cartData.map(item => ({
            productId: item.productId,
            productTitle: item.productTitle,
            quantity: item.quantity,
            price: item.price,
            subTotal: item.subTotal,
            typeCourse: item.typeCourse,
            image: item.image || ''
        }))
    };

    try {
        setIsLoading(true);
        setBtnDisabled(true);

        // Send order to backend using postData
        const response = await postData('/api/orders', orderData);
        
        if (response.success) {
            // Clear cart after successful order
            const deletePromises = cartData.map(item => 
                deleteData(`/api/cart/${item._id}`)
            );
            
            await Promise.all(deletePromises);
            
            // Refresh cart data
            setCartData([]);
            
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'سفارش شما با موفقیت ثبت شد!'
            });

            navigate(`/orders/${user.userId}`);
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: response.message || 'خطا در ثبت سفارش!'
            });
        }
    } catch (error) {
        console.error('Order submission error:', error);
        context.setAlertBox({
            open: true,
            error: true,
            msg: 'خطا در ارتباط با سرور!'
        });
    } finally {
        setIsLoading(false);
        setBtnDisabled(false);
    }
}

    return (
        <>
        <div className="cartPage container">
            <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb ">
                <Link to="/" ><b> خانه </b></Link> /
                <Link to="/cart" ><b>سبد خرید</b></Link> /
                <Link to="" ><b>{`${context.user?.name} ${context.user?.lastName}`}</b></Link>
            </p>

            <div className="cartPageHead">
                <h1>سبد خرید من</h1>
                <p>شما <b>{cartData?.length}</b> محصول در سبد خرید خود دارید.</p>
            </div>

            <div className="cartLayout">

                <div className="cartItemsCard">

                    {cartData?.length ? (
                        <>
                            <div className="cartItemsHead">آیتم‌های سبد خرید</div>

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
                                            <img className="w-100" src={item?.image} alt={item?.productTitle} />
                                        </div>
                                    </Link>

                                    <div className="cartInfo">
                                        <Link
                                            to={item?.typeCourse ? `/course/${item?.productId}` : `/product/${item?.productId}`}
                                            className="cartInfoLink"
                                        >
                                            <h6>{item?.productTitle?.substr(0, 30) + '...'}</h6>
                                        </Link>
                                        <div className="cartMeta">
                                            <span className={`item-type-badge ${item?.typeCourse ? 'type-course' : 'type-product'}`}>
                                                {item?.typeCourse ? 'دوره' : 'محصول'}
                                            </span>
                                            <span className="unitPrice">قیمت واحد: {item?.price?.toLocaleString()} تومان</span>
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
                                                    <div className="qtyFixed">۱ آیتم (دوره)</div>
                                                )
                                        }
                                    </div>

                                    <div className="lineSubtotal">
                                        <small>قیمت کل</small>
                                        <span className="rowTotal">{item?.subTotal?.toLocaleString()} تومان</span>
                                    </div>

                                    <Button
                                        onClick={() => { removeItem(item?._id) }}
                                        className="removeBtn"
                                        title="حذف از سبد"
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
                            <span>سبد خرید شما خالی است!</span>
                        </div>
                    )}

                </div>

                <div className="summaryCard">
                    <h6>مجموع سفارش</h6>

                    <div className="summaryRow">
                        <span>تعداد سفارش</span>
                        <b>{cartData?.length}</b>
                    </div>

                    <div className="summaryTotalRow">
                        <span className="summaryTotalLabel">مجموع</span>
                        <span className="summaryTotalValue">
                            {calculateTotal().toLocaleString()}
                            <img src={Toman} className="summaryTomanIcon" alt="تومان" />
                        </span>
                    </div>

                    <Button
                        className="orderSubmit"
                        onClick={submitOrder}
                        disabled={btnDisabled || isLoading || !cartData || cartData.length === 0}
                    >
                        {isLoading ? 'در حال ثبت...' : 'ثبت سفارش و پرداخت'}
                        <BsFillCartCheckFill />
                    </Button>
                </div>

            </div>

            {
                cartData?.length > 0 ? (
                    <>
                    <div className="cartPageText">
                        <p>سبد خرید اوژن، دروازه ورود شما به دنیای تخصصی نانوزیست‌فناوری و ژنتیک مولکولی است. تمامی دوره‌ها، کارگاه‌های عملی و خدمات پژوهشی ثبت‌شده در این صفحه، با دقت بالایی توسط تیم علمی ما پالایش شده‌اند تا کاملاً با نیازهای پایان‌نامه‌ای و آزمایشگاهی شما همخوانی داشته باشند. پیش از نهایی‌سازی سفارش، یک بار دیگر سبد خود را بررسی کنید تا از تطابق دوره یا خدمت انتخابی با رشته تخصصی‌تان (ژنتیک پزشکی، میکروبیولوژی، بیوانفورماتیک و...) اطمینان حاصل فرمایید. در صورت ابهام در انتخاب بین چند دوره یا نیاز به تنظیم زمان‌بندی کارگاه، تیم مشاوره علمی اوژن آماده پاسخگویی است تا خریدی هوشمندانه و هدفمند داشته باشید.</p>

                        <p>قدم بزرگی برای توسعه مهارت‌های عملی و نظری‌تان برداشته‌اید! در اوژن، ما به کیفیت آموزش و تجهیزات آزمایشگاهی‌مان افتخار می‌کنیم و مطمئنیم که انتخاب شما، نقطه عطفی در مسیر حرفه‌ای‌تان خواهد بود. برای تکمیل ثبت‌نام و تضمین جایگاه شما در کارگاه‌های عملی (که ظرفیت محدودی دارند)، توصیه می‌کنیم هرچه سریع‌تر فرایند پرداخت را نهایی کنید. پس از خرید، تمامی جزئیات دسترسی به کلاس‌های مجازی/حضوری، سرفصل‌های به‌روز شده و پشتیبانی اختصاصی از سوی کارشناسان مجموعه برای شما ارسال خواهد شد. ما در کنار شما هستیم تا این سفر علمی را با بهترین نتیجه به پایان برسانید.</p>

                        <Button
                            className="getHelp"
                            onClick={() => window.location.href = "tel:0212244961487"}
                        >
                            ارتباط با پشتیبانی
                            <MdSupportAgent />
                        </Button>
                    </div>
                    </>
                ) : (
                    <>
                    <div className="cartPageText">
                        <p>سبد خرید شما در حال حاضر خالی است. اما نگران نباشید! در اوژن، دوره‌ها و کارگاه‌های تخصصی متنوعی در حوزه‌های نانوزیست‌فناوری، ژنتیک پزشکی و مولکولی، میکروبیولوژی، بیوتکنولوژی، مهندسی بافت و بیوانفورماتیک منتظر شما هستند. از آموزش‌های عملی آزمایشگاهی گرفته تا خدمات پژوهشی و مشاوره پایان‌نامه، همه چیز برای پیشرفت مسیر علمی‌تان در یکجا جمع شده است.</p>

                        <p>همین حالا به <Link to={'/shop'}>فروشگاه</Link> یا <Link to={'/courseShop'}>صفحه دوره‌ها</Link> ما سر بزنید و بهترین گزینه را برای ارتقای مهارت‌های خود انتخاب کنید. اگر هم نیاز به راهنمایی دارید، تیم پشتیبانی اوژن آماده است تا شما را در مسیر درست هدایت کند. منتظر دیدن شما در جمع کارآموزان موفق اوژن هستیم!</p>
                    </div>
                    <Button
                        className="getHelp paddingforMobile"
                        onClick={() => window.location.href = "tel:0212244961487"}
                    >
                        ارتباط با پشتیبانی
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
