import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import Toman from "./../../assets/toman icon.png";
import { fetchDataFromApi } from "../../utils/api";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const OrderPage = () => {

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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (user?.userId === id) {
            fetchDataFromApi(`/api/orders?userId=${id}`)
                .then((res) => {
                    setOrders(res);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'شما دسترسی به این صفحه ندارید!'
            });
        }
    }, [id]);

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
                msg: 'آیدی سفارش کپی شد!'
            });
        }).catch(() => {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در کپی کردن آیدی!'
            });
        });
    }

    return (
        <>
            <div className="ordersPage container">
                <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb">
                    <Link to="/"><b>خانه</b></Link> /
                    <Link to={`/orders/${id}`}><b>سفارشات من</b></Link> /
                    <Link to=""><b>{`${context.user?.name} ${context.user?.lastName}`}</b></Link>
                </p>

                <div className="row">
                    <div className="col-12 my-3">
                        <h5>شما <b>{orders?.length || 0}</b> سفارش ثبت شده دارید.</h5>

                        {isLoading ? (
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">در حال بارگذاری...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive mt-4">
                                {orders?.length > 0 ? (
                                    <table className="table table-bordered v-align">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th className="order-col-index">ردیف</th>
                                                <th className="order-col-id">شناسه سفارش</th>
                                                <th className="order-col-items">تعداد آیتم</th>
                                                <th className="order-col-total">مبلغ کل</th>
                                                <th className="order-col-status">وضعیت</th>
                                                <th className="order-col-date">تاریخ ثبت</th>
                                                <th className="order-col-actions">جزئیات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders?.map((order, index) => (
                                                <>
                                                    <tr key={order._id} className="order-row">
                                                        <td className="indexCol">
                                                            <div className="miniBox">
                                                                {index + 1}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="orderId" onClick={() => copyOrderId(order._id)}>
                                                                <small>{order._id?.substr(0, 8)}...</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="orderItemsCount">
                                                                <b>{order.totalItems || order.items?.length || 0}</b>
                                                                <span>آیتم</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="priceBox order-total">
                                                                {order.totalPrice?.toLocaleString()}
                                                                <img src={Toman} className="toman-icon" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="orderStatus">
                                                                <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="orderDate">
                                                                <small>{order.dateCreated}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="orderActions">
                                                                <Button 
                                                                    className="viewDetailsBtn w-100"
                                                                    onClick={() => toggleExpand(order._id)}
                                                                >
                                                                    {expandedOrder === order._id ? (
                                                                        <>
                                                                            <BsChevronUp />
                                                                            <span>بستن</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <BsChevronDown />
                                                                            <span>مشاهده</span>
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {expandedOrder === order._id && (
                                                        <tr className="order-details-row">
                                                            <td colSpan="7">
                                                                <div className="order-details-wrapper" style={{
                                                                    animation: isClosing ? 'slideUp 0.3s ease-in-out' : 'slideDown 0.3s ease-in-out',
                                                                    padding: '16px',
                                                                    backgroundColor: '#f8f9fa',
                                                                    borderRadius: '8px',
                                                                    transformOrigin: 'top'
                                                                }}>
                                                                    <h6 style={{ marginBottom: '12px' }}>جزئیات سفارش</h6>
                                                                    <div className="table-responsive">
                                                                        <table className="table table-sm table-bordered order-items-subTable">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="item-col-index">#</th>
                                                                                    <th className="item-col-product">محصول/دوره</th>
                                                                                    <th className="item-col-price">قیمت</th>
                                                                                    <th className="item-col-qty">تعداد</th>
                                                                                    <th className="item-col-subtotal">قیمت کل</th>
                                                                                    <th className="item-col-type">نوع</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {order.items?.map((item, idx) => (
                                                                                    <tr key={idx}>
                                                                                        <td>
                                                                                            <div className="miniBox">{idx + 1}</div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="d-flex align-items-center productBox">
                                                                                                <div className="imgWrapper">
                                                                                                    <div className="img">
                                                                                                        <img className="w-100" src={item?.image} alt={item?.productTitle} />
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="info pl-3">
                                                                                                    <Link 
                                                                                                        to={item?.typeCourse ? `/course/${item?.productId}` : `/product/${item?.productId}`}
                                                                                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                                                                                    >
                                                                                                        <h6 style={{ margin: 0, fontSize: '14px', cursor: 'pointer' }}>
                                                                                                            {item?.productTitle?.substr(0, 30) + '...'}
                                                                                                        </h6>
                                                                                                    </Link>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="priceBox">
                                                                                                {item?.price?.toLocaleString()} تومان
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="itemQty">
                                                                                                {item?.quantity}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <div className="priceBox">
                                                                                                {item?.subTotal?.toLocaleString()} تومان
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <span className={`item-type-badge ${item?.typeCourse ? 'type-course' : 'type-product'}`}>
                                                                                                {item?.typeCourse ? 'دوره' : 'محصول'}
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                            <tfoot>
                                                                                <tr className="order-grand-total">
                                                                                    <td colSpan="4">
                                                                                        <strong>مجموع کل:</strong>
                                                                                    </td>
                                                                                    <td>
                                                                                        <strong>{order.totalPrice?.toLocaleString()} تومان</strong>
                                                                                    </td>
                                                                                    <td></td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="emptyOrders">
                                        <div>
                                            <h5>شما هیچ سفارشی ثبت نکرده‌اید!</h5>
                                            <Link to="/courseShop" className="btn btn-ogeneGreen">
                                                مشاهده دوره ها
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderPage;