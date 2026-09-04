import Button from "@mui/material/Button";
import { Link, useParams, useNavigate } from "react-router-dom";

import { FaShoppingCart } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';

import CalenderImg from "./../../assets/calenderSectionHomeImg.png";
import { MdOutlineReplyAll } from "react-icons/md";
import ProductCard from "../../Components/Cards/productCard";

import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";

import Toman from "./../../assets/toman icon.png"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CircularProgress, Rating } from "@mui/material";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* Skeleton placeholder — shown while productData is loading */
const ProductItemSkeleton = () => (
    <div className="container CourseItem productItem">
        <div className="skeletonLine skeletonBreadcrumb shopShimmer"></div>

        <div className="row mt-4 columnReverse">
            <div className="col-12 pointer col-md-8">
                <div className="skeletonLine skeletonTitle shopShimmer"></div>
                <div className="skeletonLine skeletonSubtitle shopShimmer"></div>

                <div className="skeletonLine skeletonDescTitle shopShimmer mt-4"></div>
                <div className="skeletonLine skeletonDescLine shopShimmer"></div>
                <div className="skeletonLine skeletonDescLine shopShimmer"></div>
                <div className="skeletonLine skeletonDescLine skeletonDescLineShort shopShimmer"></div>
            </div>

            <div className="col-12 pointer col-md-4">
                <div className="card skeletonPurchaseCard">
                    <div className="skeletonImageBlock shopShimmer"></div>
                    <div className="skeletonLine skeletonPriceLine shopShimmer mt-4"></div>
                    <div className="skeletonLine skeletonBtnLine shopShimmer mt-3"></div>
                </div>
            </div>
        </div>

        <div className="CourseInfo mt-5">
            <div className="skeletonLine skeletonTabsBar shopShimmer"></div>
            <div className="skeletonTabPanel shopShimmer mt-4"></div>
        </div>
    </div>
);

const ProductItem = () => {

    const context = useContext(MyContext);
    const { id } = useParams();

    useEffect(() => {
        context.setIsShowFooter(true);
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const [infoTab, setInfoTab] = useState(2);
    const openTab = (id) => {
        setInfoTab(id);
    }

    // backend
    const [productData, setProductData] = useState();
    const [relatedProductData, setRelatedProductData] = useState([]);

    useEffect(() => {
        context.setProgress(30);
        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            setProductData(res);
            context.setProgress(100);

            fetchDataFromApi(`/api/product?filterKey=${res?.field}`)
                .then((res) => {
                    const filteredData = res?.filter(item => item.id !== id);
                    setRelatedProductData(filteredData)
                })
        })
    }, [id]);

    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');

    useEffect(() => {
        const formattedPrice = productData?.price === '' ? '' : Number(productData?.price).toLocaleString();
        const formattedOldPrice = productData?.oldPrice === '' ? '' : Number(productData?.oldPrice).toLocaleString();
        setPrice(formattedPrice);
        setOldPrice(formattedOldPrice);
    }, [productData]);

    const discount = () => {
        const oldP = Number(productData?.oldPrice);
        const newP = Number(productData?.price);

        if (!oldP || !newP) return;

        const result = ((oldP - newP) / oldP) * 100;

        return Math.floor(result);
    }

    const [btnDisabled, setBtnDisabled] = useState(false);

    let [cartFields, setCartFeilds] = useState({});
    const [tabError, setTabError] = useState(false);
    const history = useNavigate();

    const addtoCart = () => {
        setBtnDisabled(true);

        if (context.isLoggedIn === true) {
            const user = JSON.parse(localStorage.getItem("user"));

            cartFields.productTitle = productData?.name;
            cartFields.image = productData?.images[0];
            cartFields.price = productData?.price;
            cartFields.quantity = 1;
            cartFields.subTotal = parseInt(productData?.price);
            cartFields.productId = productData?.id;
            cartFields.userId = user?.userId;
            cartFields.typeCourse = false;

            context.addtoCart(cartFields);

            setTimeout(() => {
                setBtnDisabled(false);
            }, 2000);
        }
        else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'وارد حساب کاربری خود شوید!'
            });

            setTimeout(() => {
                setBtnDisabled(false);
            }, 2000);
        }

    }

    const [reviews, setReviews] = useState({
        productId: '',
        customerName: '',
        customerId: '',
        review: '',
        customerRating: 0
    });
    const [loader, setLoader] = useState(false);
    const [reviewsData, setReviewsData] = useState([]);

    useEffect(() => {
        fetchDataFromApi(`/api/productReview?productId=${id}`).then((res) => {
            setReviewsData(res);
        })
    }, [id]);

    const onchanegInput = (e) => {
        setReviews(() => ({
            ...reviews,
            [e.target.name]: e.target.value
        }));
    }

    const changeRating = (e, newValue) => {
        setReviews(prev => ({
            ...prev,
            customerRating: newValue
        }));
    };

    const addReview = (e) => {
        e.preventDefault();
        setLoader(true);

        if (context.isLoggedIn === true) {
            const user = JSON.parse(localStorage.getItem('user'));

            if (reviews.review !== '' && reviews.customerRating !== 0) {

                setBtnDisabled(true);

                reviews.customerId = user?.userId;
                reviews.customerName = `${user?.name} ${user?.lastName}`;
                reviews.productId = id;
                postData('/api/productReview/add', reviews).then((res) => {

                    if (res.status !== false) {
                        setLoader(false);
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: 'دیدگاه شما  منتشر شد!'
                        });

                        reviews.review = '';
                        reviews.customerRating = 0;

                        fetchDataFromApi(`/api/productReview?productId=${id}`).then((res) => {
                            setReviewsData(res);
                        });

                        setTimeout(() => {
                            setBtnDisabled(false);
                        }, 500);
                    }
                    else {

                        setLoader(false);
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: res.msg
                        });

                        reviews.review = '';
                        reviews.customerRating = 0;

                        setTimeout(() => {
                            setBtnDisabled(false);
                        }, 500);

                    }
                });

            } else {
                setLoader(false);
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'دیدگاه و امتیاز خود را مشخص کنید!'
                });
            }

        } else {

            setLoader(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'وارد حساب کاربری خود شوید!'
            });
            history('/login');

        }

    }

    // ===== Loading state: show skeleton until productData arrives =====
    if (productData === undefined) {
        return <ProductItemSkeleton />;
    }

    return (
        <>
            <div className="container CourseItem productItem">
                <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb ">
                    <Link to="/"><b> خانه </b></Link> /
                    <Link to="/shop"><b> محصولات </b></Link> /
                    <Link to=""><b> {productData?.name ? productData?.name : ''}</b></Link>
                </p>
                <div className="row mt-4 columnReverse">
                    <div className="col-12 pointer col-md-8">

                        <h1>{productData?.name}</h1>
                        <h3>{productData?.field}</h3>

                        <div className="description mt-4" style={{ whiteSpace: 'normal !important' }}>
                            <p className="title">درباره این محصول</p>
                            <p>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        img: ({ node, ...props }) => (
                                            <img
                                                {...props}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    paddingLeft: '10px',
                                                    paddingRight: '10px'
                                                }}
                                            />
                                        ),
                                        p: ({ node, ...props }) => <span {...props} />
                                    }}
                                >
                                    {productData?.description || ''}
                                </ReactMarkdown>
                            </p>
                        </div>

                        <div className="d-flex align-items-center p-1">
                            <h5 className="mb-0">موجودی انبار :</h5>
                            <div className="countInStockBox">
                                {
                                    productData?.countInStock === 0 ? 'ناموجود' : <span>{productData?.countInStock}</span>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="col-12 pointer col-md-4">
                        <div className="card">
                            <Swiper
                                slidesPerView={1}
                                autoplay={{ delay: 3000 }}
                                modules={[Autoplay]}
                                loop={true}
                                className="courseItemImagesSwiper"
                            >
                                {
                                    productData?.images?.length !== undefined && productData?.images?.length !== 0 && productData?.images?.map((img, index) => {
                                        return (
                                            <SwiperSlide key={index}>
                                                <div className="courseImage">
                                                    <img src={img} className="mt-3" />
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })
                                }

                            </Swiper>

                            <div className="details mt-4">
                                <div className="price">
                                    <h6 className="oldPrice"><b>قیمت محصول : </b>
                                        {
                                            productData?.oldPrice &&
                                            <>
                                                <span className="">{oldPrice}</span>
                                                <span className="mx-0">
                                                    <span className="badge badge-danger discountBadge">
                                                        {discount()}%
                                                    </span>
                                                </span>

                                            </>
                                        }
                                    </h6>
                                    <h6 className="newPrice">
                                        <span>{price}</span>
                                        <span className="mx-2">
                                            <img src={Toman} />
                                        </span>
                                    </h6>
                                </div>

                                <div className="row mt-3 ps-4">
                                    {
                                        productData?.event?.length !== undefined && productData?.event?.map((item, index) => {
                                            return (
                                                <div className="col-12 col-lg-6 mt-1" key={index}>
                                                    <div className="specialEventAlert">{item}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className="AddToCartBtn text-center">
                                <Button className={`${btnDisabled !== false && 'btnDisabled'}`} onClick={addtoCart}><FaShoppingCart /> اضافه کردن محصول به سبد خرید</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className=" CourseInfo mt-5">
                    <div className="CourseInfoBtns d-flex">
                        {
                            productData?.authorName !== '' && <button onClick={() => openTab(2)}>نویسنده</button>
                        }
                        <button onClick={() => openTab(3)}>سایر کتاب های مرتبط</button>
                        <button onClick={() => openTab(4)}>دیدگاه ها</button>
                    </div>

                    <div className="CourseInfoTabs">

                        {
                            infoTab === 2 && (
                                <div className="w-100 description mt-1">
                                    <div className="pe-4">
                                        <br />

                                        <div className="d-flex align-items-center" style={{ textAlign: 'right' }}>
                                            <h3>نام نویسنده :</h3>
                                            <h3 className="me-2">{productData?.authorName}</h3>
                                        </div>

                                        <br />

                                        <div style={{ textAlign: 'right' }}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    img: ({ node, ...props }) => (
                                                        <img
                                                            {...props}
                                                            style={{
                                                                width: '100%',
                                                                height: 'auto',
                                                                paddingLeft: '10px',
                                                                paddingRight: '10px'
                                                            }}
                                                        />
                                                    ),
                                                    p: ({ node, ...props }) => <span {...props} />
                                                }}
                                            >
                                                {productData?.authorDescription || ''}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            infoTab === 3 && (
                                <div className="productSection pt-5">
                                    <div className="text-center">
                                        <h3 className="mb-4">سایر محصولات در این حوزه : </h3>
                                    </div>
                                    <div className="row px-2">
                                        {
                                            relatedProductData?.length !== undefined && relatedProductData?.length !== 0 && relatedProductData?.map((item, index) => {
                                                return (
                                                    <div className="col-12 col-md-6 col-lg-4" key={index}>
                                                        <ProductCard item={item} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                            )
                        }

                        {
                            infoTab === 4 && (
                                <div className="tabInfo w-100">
                                    <div className="reviewSection mt-3">

                                        {
                                            reviewsData?.length !== undefined && reviewsData?.length !== 0 ?
                                                <h2>دیدگاه ها :</h2> : <h5>دیدگاهی برای این محصول ثبت نشده است!</h5>
                                        }

                                        {
                                            reviewsData?.length !== undefined && reviewsData?.length !== 0 && reviewsData?.map((item, index) => {
                                                return (
                                                    <div className="card reviewCard w-100" key={index}>
                                                        <div className="mx-2 my-2">
                                                            <div className="d-flex align-items-center">
                                                                <h4 className="reviewName">{item?.customerName}</h4>
                                                                <div className="me-auto px-3">
                                                                    <Rating value={item?.customerRating} style={{ direction: 'ltr' }} precision={0.5} readOnly />
                                                                </div>
                                                            </div>
                                                            <p>تاریخ : {item?.dateCreated}</p>
                                                            <p style={{ whiteSpace: 'pre-line' }}>{item?.review}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                        <form className="w-100" onSubmit={addReview}>
                                            <textarea name="review" value={reviews.review} onChange={onchanegInput} className="w-100" rows="10" placeholder="دیدگاه خود را با ما به اشتراک بگذارید"></textarea>

                                            <div className="d-flex align-items-center py-3">
                                                <h4 className="text-muted mb-2">امتیاز شما : &nbsp;&nbsp;</h4>
                                                <Rating style={{ direction: 'ltr' }} precision={0.5} onChange={changeRating} value={reviews.customerRating} />
                                            </div>

                                            <div className="text-center">
                                                <Button className={`${btnDisabled !== false && 'btnDisabled'}`} type="submit" variant="contained" startIcon={<SendIcon />}>&nbsp;&nbsp;
                                                    ثبت و ارسال دیدگاه
                                                    {
                                                        loader === true &&
                                                        <CircularProgress
                                                            sx={() => ({
                                                                color: '#fff',
                                                                marginRight: '15px',
                                                            })}
                                                            enableTrackSlot size="25px"
                                                        />
                                                    }
                                                </Button>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            )
                        }


                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductItem;