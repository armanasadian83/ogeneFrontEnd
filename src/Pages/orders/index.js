import { useLanguage } from "../../i18n/LanguageContext";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import Toman from "./../../assets/toman icon.png";
import { fetchDataFromApi } from "../../utils/api";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { TbRefresh } from "react-icons/tb";
import { MdSupportAgent } from "react-icons/md";

const OrderPage = () => {
    const { t, dir, isEnglish, localize, formatNumber } = useLanguage();

    const context = useContext(MyContext);
    const { id } = useParams();

    useEffect(() => {
        context.setIsShowFooter(true);
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // isManualRefresh=true is used by the refresh button so it can show its
    // own spinner instead of swapping the whole page back to the loading state.
    const fetchOrders = (isManualRefresh = false) => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.userId === id) {
            if (isManualRefresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            fetchDataFromApi(`/api/orders?userId=${id}`)
                .then((res) => {
                    const list = Array.isArray(res)
                        ? res
                        : Array.isArray(res?.orders)
                            ? res.orders
                            : Array.isArray(res?.data)
                                ? res.data
                                : [];
                    setOrders(list);
                    setIsLoading(false);
                    setIsRefreshing(false);
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                    setIsRefreshing(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: t("خطا در به‌روزرسانی سفارش‌ها!", "Your orders could not be refreshed.")
                    });
                });
        } else {
            setIsLoading(false);
            setIsRefreshing(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("شما دسترسی به این صفحه ندارید!", "You do not have access to this page.")
            });
        }
    };

    useEffect(() => {
        fetchOrders(false);
    }, [id]);

    const handleRefreshClick = () => {
        if (isRefreshing) return;
        fetchOrders(true);
    };

    const toggleExpand = (orderId) => {
        if (expandedOrder === orderId) {
            setIsClosing(true);
            setTimeout(() => {
                setExpandedOrder(null);
                setIsClosing(false);
            }, 300);
        } else {
            setExpandedOrder(orderId);
        }
    };

    // Kept exactly as before — drives both the badge class and the stepper mapping
    const getStatusClass = (status) => {
        switch (status) {
            case 'در انتظار':
                return 'status-pending';
            case 'در حال پردازش':
                return 'status-processing';
            case 'تایید شده':
                return 'status-completed';
            case 'لغو شده':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    const copyOrderId = (orderId) => {
        navigator.clipboard.writeText(orderId).then(() => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: t("آیدی سفارش کپی شد!", "Order ID copied.")
            });
        }).catch(() => {
            context.setAlertBox({
                open: true,
                error: true,
                msg: t("خطا در کپی کردن آیدی!", "The ID could not be copied.")
            });
        });
    }

    // Maps the real order.status values to the 3-stage stepper.
    // 1 = ثبت سفارش (default / در انتظار)
    // 2 = بررسی و تایید (در حال پردازش)
    // 3 = پایان یافته (تایید شده)
    const getStepIndex = (status) => {
        switch (status) {
            case 'تایید شده':
                return 3;
            case 'در حال پردازش':
                return 2;
            case 'در انتظار':
            default:
                return 1;
        }
    };

    const stepLabels = [t("ثبت سفارش", "Order placed"), t("بررسی و تایید", "Review and approval"), t("پایان یافته", "Completed")];

    const renderStepper = (status) => {
        if (status === 'لغو شده') {
            return (
                <div className="orderCancelledNote">
                    <span className="orderCancelledDot"></span>
                    {t("این سفارش توسط پشتیبانی لغو شده است.", "This order was canceled by support.")}
                </div>
            );
        }

        const step = getStepIndex(status);
        // Reversed so index 0 (ثبت سفارش) sits on the right and index 2
        // (پایان یافته) sits on the left — matching RTL reading order.
        const nodeX = isEnglish ? [60, 380, 700] : [700, 380, 60];

        const seg1Done = step >= 2;
        const seg2Done = step >= 3;

        const nodeState = (i) => {
            if (step > i + 1) return 'done';
            if (step === i + 1) return 'current';
            return 'upcoming';
        };

        // Direction-agnostic curve builder: works whether xB is to the
        // left or right of xA, so the helix shape stays symmetric either way.
        const lowArc = (xA, xB) => {
            const off = (xB - xA) * 0.3125;
            return `M ${xA} 15 C ${xA + off} 55, ${xB - off} 55, ${xB} 15`;
        };
        const highArc = (xA, xB) => {
            const off = (xB - xA) * 0.3125;
            return `M ${xA} 45 C ${xA + off} 5, ${xB - off} 5, ${xB} 45`;
        };

        return (
            <div className="stepperWrap">
                <svg viewBox="0 0 760 60" width="100%" height="60" preserveAspectRatio="xMidYMid meet">
                    <path
                        className={`stepperLine ${seg1Done ? 'done' : 'upcoming'}`}
                        d={lowArc(nodeX[0], nodeX[1])}
                    />
                    <path
                        className={`stepperLine ${seg1Done ? 'done' : 'upcoming'}`}
                        d={highArc(nodeX[0], nodeX[1])}
                    />
                    <path
                        className={`stepperLine ${seg2Done ? 'done' : 'upcoming'}`}
                        d={lowArc(nodeX[1], nodeX[2])}
                    />
                    <path
                        className={`stepperLine ${seg2Done ? 'done' : 'upcoming'}`}
                        d={highArc(nodeX[1], nodeX[2])}
                    />

                    {nodeX.map((x, i) => (
                        <circle
                            key={i}
                            className={`stepperNode ${nodeState(i)}`}
                            cx={x}
                            cy="30"
                            r={nodeState(i) === 'current' ? 10 : 9}
                        />
                    ))}
                </svg>
                <div className="stepperLabels">
                    {stepLabels.map((label, i) => (
                        <span key={i} className={nodeState(i)}>{label}</span>
                    ))}
                </div>
            </div>
        );
    };

    const filteredOrders = orders.filter(order =>
        statusFilter === 'all' ? true : order.status === statusFilter
    );

    const totalOrdersCount = orders.length;
    const pendingCount = orders.filter(o => o.status === 'در انتظار').length;
    const completedCount = orders.filter(o => o.status === 'تایید شده').length;
    const totalSpent = orders
        .filter(o => o.status !== 'لغو شده')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const statusChips = [
        { key: 'all', label: t("همه", "All") },
        { key: 'در انتظار', label: t('در انتظار', 'Pending') },
        { key: 'در حال پردازش', label: t('در حال پردازش', 'Processing') },
        { key: 'تایید شده', label: t('تایید شده', 'Confirmed') },
        { key: 'لغو شده', label: t('لغو شده', 'Cancelled') },
    ];

    return (
        <>
            <div className="ordersPage container" dir={dir}>
                <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb">
                    <Link to="/"><b>{t("خانه", "Home")}</b></Link> /
                    <Link to={`/orders/${id}`}><b>{t("سفارشات من", "My orders")}</b></Link> /
                    <Link to=""><b>{`${context.user?.name} ${context.user?.lastName}`}</b></Link>
                </p>

                <div className="row">
                    <div className="col-12 my-3">

                        {isLoading ? (
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">{t("در حال بارگذاری...", "Loading...")}</span>
                                </div>
                            </div>
                        ) : orders?.length > 0 ? (
                            <>
                                <div className="orderPageHead">
                                    <div>
                                        <h1>{t("سفارش‌های من", "My orders")}</h1>
                                        <p>{t("شما", "You have")} <b>{totalOrdersCount}</b> {t("سفارش ثبت شده دارید.", "orders.")}</p>
                                    </div>
                                </div>

                                <div className="orderStatsRow">
                                    <div className="statCard">
                                        <div className="statCardHead">
                                            <span className="statLabel">{t("کل سفارش‌ها", "Total orders")}</span>
                                            <span className="statIcon icTeal">▤</span>
                                        </div>
                                        <div className="statValue">{totalOrdersCount}<span className="statValueSmall">{t("سفارش", "orders")}</span></div>
                                    </div>
                                    <div className="statCard">
                                        <div className="statCardHead">
                                            <span className="statLabel">{t("در انتظار پیگیری", "Awaiting follow-up")}</span>
                                            <span className="statIcon icGold">◔</span>
                                        </div>
                                        <div className="statValue">{pendingCount}<span className="statValueSmall">{t("سفارش", "orders")}</span></div>
                                    </div>
                                    <div className="statCard">
                                        <div className="statCardHead">
                                            <span className="statLabel">{t("پایان یافته", "Completed")}</span>
                                            <span className="statIcon icTeal">✓</span>
                                        </div>
                                        <div className="statValue">{completedCount}<span className="statValueSmall">{t("سفارش", "orders")}</span></div>
                                    </div>
                                    <div className="statCard">
                                        <div className="statCardHead">
                                            <span className="statLabel">{t("مجموع خرید", "Total purchases")}</span>
                                            <span className="statIcon icAmber">T</span>
                                        </div>
                                        <div className="statValue">{formatNumber(totalSpent)}<span className="statValueSmall">{t("تومان", "Toman")}</span></div>
                                    </div>
                                </div>

                                <div className="filtersRow">
                                    {statusChips.map(chip => (
                                        <button
                                            key={chip.key}
                                            className={`chipBtn ${statusFilter === chip.key ? 'active' : ''}`}
                                            onClick={() => setStatusFilter(chip.key)}
                                        >
                                            {chip.label}
                                        </button>
                                    ))}
                                    <button
                                        className={`refreshBtn ${isRefreshing ? 'spinning' : ''}`}
                                        onClick={handleRefreshClick}
                                        disabled={isRefreshing}
                                        title={t("رفرش", "Refresh")}
                                    >
                                        <TbRefresh />
                                    </button>
                                </div>

                                <div className="orderCardList">
                                    {filteredOrders.map((order) => (
                                        <div className="orderCardItem" key={order._id}>
                                            <div className="orderCardHead">
                                                <div className="orderIdBlock">
                                                    <span className="orderIdChip" onClick={() => copyOrderId(order._id)}>
                                                        #{order._id?.substr(0, 8)}...
                                                    </span>
                                                    <button className="copyBtn" onClick={() => copyOrderId(order._id)} title={t("کپی آیدی", "Copy ID")}>
                                                        <span>⧉</span>
                                                    </button>
                                                    <span className="orderDateText">{order.dateCreated}</span>
                                                </div>
                                                <span className={`statusPill ${getStatusClass(order.status)}`}>
                                                    <span className="statusDot"></span>
                                                    {t(order.status)}
                                                </span>
                                            </div>

                                            {renderStepper(order.status)}

                                            <div className="orderCardFoot">
                                                <div className="footInfo">
                                                    <div className="footItem">
                                                        <span className="footLabel">{t("تعداد آیتم", "Item count")}</span>
                                                        <span className="footValue">{order.totalItems || order.items?.length || 0} {t("آیتم", "items")}</span>
                                                    </div>
                                                    <div className="footItem">
                                                        <span className="footLabel">{t("مبلغ کل", "Order total")}</span>
                                                        <span className="footValue footValueTotal">
                                                            {formatNumber(order.totalPrice)}
                                                            <span className="toman-icon">{t("تومان", "Toman")}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    className={`viewDetailsBtn ${expandedOrder === order._id ? 'open' : ''}`}
                                                    onClick={() => toggleExpand(order._id)}
                                                >
                                                    {expandedOrder === order._id ? (
                                                        <>
                                                            <BsChevronUp />
                                                            <span>{t("بستن", "Close")}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BsChevronDown />
                                                            <span>{t("مشاهده جزئیات", "View details")}</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            {expandedOrder === order._id && (
                                                <div className={`orderDetailsWrapper ${isClosing ? 'slideUp' : 'slideDown'}`}>
                                                    <h6 className="orderDetailsTitle">{t("جزئیات سفارش", "Order details")}</h6>
                                                    <div className="orderItemsList">
                                                        {order.items?.map((item, idx) => (
                                                            <div className="orderItemRow" key={idx}>
                                                                <div className="miniBox">{idx + 1}</div>
                                                                <div className="itemThumb">
                                                                    <img className="w-100" src={item?.image} alt={localize(item, "productTitle")} />
                                                                </div>
                                                                <div className="itemInfo">
                                                                    <Link
                                                                        to={item?.typeCourse ? `/course/${item?.productId}` : `/product/${item?.productId}`}
                                                                        className="itemInfoLink"
                                                                    >
                                                                        <h6 className="itemInfoName">
                                                                            {localize(item, "productTitle")?.substr(0, 30) + '...'}
                                                                        </h6>
                                                                    </Link>
                                                                    <div className="itemInfoMeta">
                                                                        <span className={`item-type-badge ${item?.typeCourse ? 'type-course' : 'type-product'}`}>
                                                                            {item?.typeCourse ? t("دوره", "Course") : t("محصول", "Product")}
                                                                        </span>
                                                                        <span>{t("تعداد:", "Quantity:")} {item?.quantity}</span>
                                                                        <span>{t("قیمت واحد:", "Unit price:")} {formatNumber(item?.price)} {t("تومان", "Toman")}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="itemSubtotal">
                                                                    {formatNumber(item?.subTotal)} {t("تومان", "Toman")}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="orderGrandTotal">
                                                        <strong>{t("مجموع کل:", "Grand total:")}</strong>
                                                        <strong>{formatNumber(order.totalPrice)} {t("تومان", "Toman")}</strong>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {filteredOrders.length === 0 && (
                                        <div className="emptyOrders emptyOrdersFiltered">
                                            <h6>{t("سفارشی با این وضعیت یافت نشد.", "No orders match this status.")}</h6>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="emptyOrders">
                                <div>
                                    <h5>{t("شما هیچ سفارشی ثبت نکرده‌اید!", "You have not placed any orders yet.")}</h5>
                                    <Link to="/courseShop" className="btn btn-ogeneGreen">
                                        {t("مشاهده دوره ها", "Browse courses")}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                <div className="cartPageText">
                    <small className="mx-1">{t("آیا نیاز به کمک دارید؟", "Need help?")}</small>
                    <Button
                        className="getHelp"
                        onClick={() => window.location.href = "tel:0212244961487"}
                    >
                        {t("ارتباط با پشتیبانی", "Contact support")}
                        <MdSupportAgent />
                    </Button>
                </div>
            </div>
        </>
    );
};

export default OrderPage;
