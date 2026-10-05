import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const MAX_POLLS = 20; // 20 بار × ۳ ثانیه = حداکثر ۶۰ ثانیه انتظار برای تایید نهایی

// ۱۴:۱۱ - ۱۴۰۵/۰۵/۱۰
const formatTxnTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    const time = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Tehran" }).format(d);
    const date = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Tehran" }).format(d);
    return `${time} - ${date}`;
};

// همان دو تصویر مارپیچ صفحه‌ی شما (بدون تغییر)
const HelixDecor = () => (
    <>
        <svg className="helixDecor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 10 C90 40, 20 70, 70 100 C120 130, 50 160, 100 190" stroke="#0f766e" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M100 10 C50 40, 120 70, 70 100 C20 130, 90 160, 40 190" stroke="#17a894" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <svg className="helixDecor helixDecor2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 10 C90 40, 20 70, 70 100 C120 130, 50 160, 100 190" stroke="#0f766e" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M100 10 C50 40, 120 70, 70 100 C20 130, 90 160, 40 190" stroke="#17a894" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
    </>
);

const SuccessPayment = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const resNum = searchParams.get("resNum");

    const [payment, setPayment] = useState(null);   // وقتی پرداخت تایید شد پر می‌شود
    const [timedOut, setTimedOut] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const ordersPath = user?.userId ? `/orders/${user.userId}` : "/";

    useEffect(() => {
        context.setIsShowFooter(false);
        context.setIsShowNavbar(false);
        context.setIsShowCalenderBar(false);
    }, []);

    // وضعیت واقعی را از سرور می‌پرسیم (به پارامتر URL اعتماد نمی‌کنیم)
    useEffect(() => {
        if (!resNum) {
            navigate("/", { replace: true });
            return;
        }

        let tries = 0;
        let timer;
        let cancelled = false;

        const check = async () => {
            try {
                const raw = await fetchDataFromApi(`/api/payment/status/${resNum}`);
                if (cancelled) return;
                // fetchDataFromApi در صورت خطا، شیء خطای axios را «برمی‌گرداند» (throw نمی‌کند)؛
                // بدنه‌ی پاسخ سرور در raw.response.data است
                const res = raw?.response?.data ?? raw;

                if (res?.code === "NOT_FOUND") {
                    navigate("/payment-failed", { replace: true });
                    return;
                }
                if (["failed", "canceled", "expired"].includes(res?.status)) {
                    navigate(`/payment-failed?resNum=${resNum}`, { replace: true });
                    return;
                }
                if (res?.status === "paid") {
                    setPayment(res);
                    if (res.orderId) return; // سفارش ساخته شده؛ دیگر نیازی به پرسیدن نیست
                }
            } catch (e) {
                if (e?.response?.data?.code === "NOT_FOUND") {
                    navigate("/payment-failed", { replace: true });
                    return;
                }
                // خطای موقت شبکه؛ دوباره تلاش می‌کنیم
            }

            tries += 1;
            if (tries < MAX_POLLS) {
                timer = setTimeout(check, 3000);
            } else {
                setTimedOut(true);
            }
        };

        check();
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [resNum]);

    // ---------- هنوز تایید نهایی نشده (یا طول کشیده) ----------
    if (!payment) {
        return (
            <>
                <div className="paymentResultPage paymentSuccessPage">
                    <HelixDecor />

                    <div className="paymentCard">
                        <h1>{timedOut ? "تایید پرداخت طول کشید" : "در حال تایید پرداخت شما"}</h1>
                        <p className="paymentSub">
                            {timedOut
                                ? "هنوز نتیجه نهایی پرداخت به ما نرسیده است. اگر مبلغی از حساب شما کسر شده، نگران نباشید؛ یا سفارش شما ثبت می‌شود یا مبلغ به‌صورت خودکار به حساب شما برمی‌گردد. برای پیگیری با پشتیبانی تماس بگیرید."
                                : "لطفاً این صفحه را نبندید. ثبت سفارش چند لحظه بیشتر طول نمی‌کشد."}
                        </p>

                        {timedOut && (
                            <>
                                <Link to={ordersPath} className="primaryBtn">
                                    مشاهده سفارش
                                </Link>
                                <a href="tel:+98212244961487" className="secondaryLink">تماس با پشتیبانی</a>
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // ---------- پرداخت موفق (طراحی خودتان، با داده واقعی) ----------
    return (
        <>
            <div className="paymentResultPage paymentSuccessPage">

                <HelixDecor />

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

                    <div className="infoBox">
                        <div className="infoRow">
                            <span>شناسه سفارش</span>
                            <b className="font-english">{payment.orderId ? `...${payment.orderId.slice(0, 8)}#` : "—"}</b>
                        </div>
                        <div className="infoRow">
                            <span>مبلغ پرداخت‌شده</span>
                            <b className="amount">{Number(payment.amount).toLocaleString()} تومان</b>
                        </div>
                        <div className="infoRow">
                            <span>زمان تراکنش</span>
                            <b>{formatTxnTime(payment.paidAt)}</b>
                        </div>
                    </div>

                    <Link to={ordersPath} className="primaryBtn">
                        مشاهده سفارش
                    </Link>
                    <Link to="/" className="secondaryLink">بازگشت به صفحه اصلی</Link>

                </div>
            </div>
        </>
    );
}

export default SuccessPayment;
