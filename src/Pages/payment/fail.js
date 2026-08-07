
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const FailedPayment = () => {

    const context = useContext(MyContext);
    
    useEffect(() => {
        context.setIsShowFooter(false); 
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);
    }, []);

    return (
        <>
            <div className="paymentResultPage paymentFailedPage">

                <svg className="helixDecor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 10 C90 40, 20 70, 70 100 C120 130, 50 160, 100 190" stroke="#0f766e" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M100 10 C50 40, 120 70, 70 100 C20 130, 90 160, 40 190" stroke="#17a894" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
                <svg className="helixDecor helixDecor2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 10 C90 40, 20 70, 70 100 C120 130, 50 160, 100 190" stroke="#0f766e" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M100 10 C50 40, 120 70, 70 100 C20 130, 90 160, 40 190" stroke="#17a894" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>

                <div className="paymentCard">

                    {/* mini progress tracker — same component style as the order stepper,
                        here showing "پرداخت" failed and "تایید سفارش" as upcoming */}
                    <div className="miniTracker">
                        <div className="miniStep">
                            <span className="miniDot"></span>
                            <span className="miniLabel">سبد خرید</span>
                        </div>
                        <span className="miniLine failedLine"></span>
                        <div className="miniStep">
                            <span className="miniDot failed"></span>
                            <span className="miniLabel failedLabel">پرداخت</span>
                        </div>
                        <span className="miniLine upcomingLine"></span>
                        <div className="miniStep">
                            <span className="miniDot upcoming"></span>
                            <span className="miniLabel muted">تایید سفارش</span>
                        </div>
                    </div>

                    <div className="iconWrap">
                        <div className="iconRing"></div>
                        <div className="iconCircle">
                            <svg className="xSvg" width="30" height="30" viewBox="0 0 24 24">
                                <line x1="6" y1="6" x2="18" y2="18" />
                                <line x1="18" y1="6" x2="6" y2="18" />
                            </svg>
                        </div>
                    </div>

                    <h1>پرداخت ناموفق بود</h1>
                    <p className="paymentSub">متأسفانه تراکنش شما تکمیل نشد. سبد خرید شما همچنان محفوظ است و می‌توانید مجدداً تلاش کنید.</p>

                    {/* placeholder reason — will be replaced with the real gateway error message once wired up */}
                    <div className="reasonBox">
                        <span className="reasonDot"></span>
                        <span>علت: تراکنش توسط بانک صادرکننده کارت رد شد. در صورت کسر وجه، مبلغ تا ۷۲ ساعت آینده به حساب شما بازخواهد گشت.</span>
                    </div>

                    <Link to="/payment-failed" className="primaryBtn">
                        بازگشت به سبد خرید
                    </Link>
                    <a href="tel:+98212244961487" className="secondaryLink">تماس با پشتیبانی</a>

                </div>
            </div>
        </>
    );
}
 
export default FailedPayment;