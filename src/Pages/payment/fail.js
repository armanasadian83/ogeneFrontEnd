import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const REFUND_NOTE = " در صورت کسر وجه، مبلغ تا ۷۲ ساعت آینده به حساب شما بازخواهد گشت.";
const DEFAULT_REASON = "علت: تراکنش تکمیل یا تایید نشد." + REFUND_NOTE;

// متن قابل‌فهم برای کاربر؛ کدهای فنی به کاربر نشان داده نمی‌شوند
const getReasonText = (status, reason) => {
    if (status === "canceled") {
        return "علت: پرداخت توسط شما لغو شد. مبلغی از حساب شما کسر نشده است.";
    }
    if (status === "expired" || reason === "SessionIsNull") {
        return "علت: مهلت پرداخت به پایان رسید." + REFUND_NOTE;
    }
    if (reason === "Failed") {
        return "علت: تراکنش توسط بانک صادرکننده کارت رد شد یا تکمیل نشد." + REFUND_NOTE;
    }
    if (typeof reason === "string" && (reason.startsWith("verify_") || reason === "amount_or_terminal_mismatch" || reason === "refnum_reused")) {
        return "علت: تایید نهایی تراکنش توسط بانک انجام نشد." + REFUND_NOTE;
    }
    return DEFAULT_REASON;
};

const FailedPayment = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const resNum = searchParams.get("resNum");

    // اگر resNum داریم، متن دقیق بعد از گرفتن وضعیت نمایش داده می‌شود (بدون پرش متن)
    const [reasonText, setReasonText] = useState(resNum ? null : DEFAULT_REASON);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const cartPath = user?.userId ? `/cart/${user.userId}` : "/";

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);
    }, []);

    useEffect(() => {
        if (!resNum) return;
        let cancelled = false;

        fetchDataFromApi(`/api/payment/status/${resNum}`)
            .then((raw) => {
                if (cancelled) return;
                // در صورت خطا fetchDataFromApi شیء خطای axios را برمی‌گرداند؛ بدنه پاسخ در raw.response.data است
                const res = raw?.response?.data ?? raw;

                // پرداخت در واقع موفق بوده یا هنوز در حال تایید است -> صفحه موفقیت وضعیت را نشان می‌دهد
                if (["paid", "verifying", "verify_pending", "needs_review"].includes(res?.status)) {
                    navigate(`/payment-success?resNum=${resNum}`, { replace: true });
                    return;
                }
                setReasonText(getReasonText(res?.status, res?.reason));
            })
            .catch(() => {
                if (!cancelled) setReasonText(DEFAULT_REASON);
            });

        return () => { cancelled = true; };
    }, [resNum]);

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

                    {reasonText && (
                        <div className="reasonBox">
                            <span className="reasonDot"></span>
                            <span>{reasonText}</span>
                        </div>
                    )}

                    <Link to={cartPath} className="primaryBtn">
                        بازگشت به سبد خرید
                    </Link>
                    <a href="tel:+98212244961487" className="secondaryLink">تماس با پشتیبانی</a>

                </div>
            </div>
        </>
    );
}

export default FailedPayment;

