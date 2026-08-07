
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const SuccessPayment = () => {

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(false); 
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);
    }, []);


    return (
        <>
            <div className="paymentResultPage paymentSuccessPage">

                <svg className="helixDecor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 10 C90 40, 20 70, 70 100 C120 130, 50 160, 100 190" stroke="#0f766e" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M100 10 C50 40, 120 70, 70 100 C20 130, 90 160, 40 190" stroke="#17a894" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
                <svg className="helixDecor helixDecor2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 10 C90 40, 20 70, 70 100 C120 130, 50 160, 100 190" stroke="#0f766e" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M100 10 C50 40, 120 70, 70 100 C20 130, 90 160, 40 190" stroke="#17a894" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>

                <div className="paymentCard">

                    {/* mini progress tracker — same visual language as the order stepper */}
                    <div className="miniTracker">
                        <div className="miniStep">
                            <span className="miniDot"></span>
                            <span className="miniLabel">سبد خرید</span>
                        </div>
                        <span className="miniLine"></span>
                        <div className="miniStep">
                            <span className="miniDot"></span>
                            <span className="miniLabel">پرداخت</span>
                        </div>
                        <span className="miniLine"></span>
                        <div className="miniStep">
                            <span className="miniDot"></span>
                            <span className="miniLabel">تایید سفارش</span>
                        </div>
                    </div>

                    <div className="iconWrap">
                        <div className="iconRing"></div>
                        <div className="iconCircle">
                            <svg className="checkSvg" width="34" height="34" viewBox="0 0 24 24">
                                <path d="M4 12.5 L9.5 18 L20 6" />
                            </svg>
                        </div>
                    </div>

                    <h1>پرداخت شما با موفقیت انجام شد</h1>
                    <p className="paymentSub">سفارش شما ثبت شد و به‌زودی توسط تیم پشتیبانی پیگیری خواهد شد.</p>

                    {/* placeholder data — will be replaced with real order details once the payment gateway is wired up */}
                    <div className="infoBox">
                        <div className="infoRow">
                            <span>شناسه سفارش</span>
                            <b className="font-english">...a6d177b#</b>
                        </div>
                        <div className="infoRow">
                            <span>مبلغ پرداخت‌شده</span>
                            <b className="amount">۱۵,۰۰۰,۰۰۰ تومان</b>
                        </div>
                        <div className="infoRow">
                            <span>زمان تراکنش</span>
                            <b>۱۴:۱۱ - ۱۴۰۵/۰۵/۱۰</b>
                        </div>
                    </div>

                    {/* placeholder userId — will come from the logged-in user once wired up */}
                    <Link to="/payment-success" className="primaryBtn">
                        مشاهده سفارش
                    </Link>
                    <Link to="/" className="secondaryLink">بازگشت به صفحه اصلی</Link>

                </div>
            </div>
        </>
    );
}
 
export default SuccessPayment;
