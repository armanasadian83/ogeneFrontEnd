import Button from "@mui/material/Button";
import { Link, useNavigate, useParams } from "react-router-dom";

import { FaShoppingCart } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';

import CalenderImg from "./../../assets/calenderSectionHomeImg.png";
import { MdOutlineReplyAll } from "react-icons/md";
import { fetchDataFromApi, postData } from "../../utils/api";
import CourseCard from "../../Components/Cards/courseCard";

import { MyContext } from "../../App";

import { IoMdGlobe } from "react-icons/io";
import { BsTelephoneForward } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";

import Toman from "./../../assets/toman icon.png"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from "remark-breaks";
import { CircularProgress, Rating } from "@mui/material";

/* Skeleton placeholder — shown while courseData is loading */
const CourseItemSkeleton = () => (
    <div className="container CourseItem">
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

const CourseItem = () => {

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

    const [infoTab, setInfoTab] = useState(1);
    const openTab = (id) => {
        setInfoTab(id);
    }

    const [courseData, setCourseDate] = useState();

    useEffect(() => {
        context.setProgress(30);
        fetchDataFromApi(`/api/course/${id}`).then((res) => {
            setCourseDate(res);
            context.setProgress(100);
        })
    }, [id]);

    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');

    useEffect(() => {
        const formattedPrice = courseData?.price === '' ? '' : Number(courseData?.price).toLocaleString();
        const formattedOldPrice = courseData?.oldPrice === '' ? '' : Number(courseData?.oldPrice).toLocaleString();
        setPrice(formattedPrice);
        setOldPrice(formattedOldPrice);
    }, [courseData]);

    const discount = () => {
        const oldP = Number(courseData?.oldPrice);
        const newP = Number(courseData?.price);

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

            cartFields.productTitle = courseData?.name;
            cartFields.image = courseData?.images[0];
            cartFields.price = courseData?.price;
            cartFields.quantity = 1;
            cartFields.subTotal = parseInt(courseData?.price);
            cartFields.productId = courseData?.id;
            cartFields.userId = user?.userId;
            cartFields.typeCourse = true;

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

                            setTimeout(() => {
                                setBtnDisabled(false);
                            }, 500);
                        });
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
            setTimeout(() => {
                setBtnDisabled(false);
            }, 500);

            history('/login');

        }

    }

    // ===== Loading state: show skeleton until courseData arrives =====
    if (courseData === undefined) {
        return <CourseItemSkeleton />;
    }

    return (
        <>
            <div className="container CourseItem">
                <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb ">
                    <Link to="/"><b> خانه </b></Link> /
                    <Link to="/courseShop"><b> دوره آموزشی </b></Link> /
                    <Link to=""><b> {courseData?.name ? courseData?.name : ''} </b></Link>
                </p>
                <div className="row mt-4 columnReverse">
                    <div className="col-12 pointer col-md-8">

                        <h1>{courseData?.name}</h1>
                        <h3>{courseData?.field}</h3>

                        <div className="description mt-4">
                            <p className="title">درباره این دوره</p>
                            <div>
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
                                                    paddingRight: '10px',
                                                    display: 'block'
                                                }}
                                            />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p style={{ margin: '0 0 10px 0' }} {...props} />
                                        )
                                    }}
                                >
                                    {courseData?.description || ''}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {
                            courseData?.startingDate &&
                            <div className="d-flex align-items-center p-1 fontSmall">
                                <h5 className="mb-0">تاریخ شروع دوره :</h5>&nbsp;
                                <strong>{courseData?.startingDate}</strong>
                            </div>
                        }

                        {
                            courseData?.EndingDate &&
                            <div className="d-flex align-items-center p-1 fontSmall">
                                <h5 className="mb-0">تاریخ پایان دوره :</h5>&nbsp;
                                <strong>{courseData?.EndingDate}</strong>
                            </div>
                        }

                        <div className="d-flex align-items-center p-1 fontSmall">
                            <h5 className="mb-0">وضعیت ثبت نام :</h5>
                            <div className="statusBox">
                                <span>{courseData?.status}</span>
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
                                    courseData?.images?.length !== undefined && courseData?.images?.length !== 0 && courseData?.images?.map((img, index) => {
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
                                    <h6 className="oldPrice"><b>هزینه دوره:</b>
                                        {
                                            courseData?.oldPrice &&
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
                                        courseData?.event?.length !== undefined && courseData?.event?.map((item, index) => {
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
                                <Button className={`${btnDisabled !== false && 'btnDisabled'}`} onClick={addtoCart}><FaShoppingCart /> اضافه کردن دوره به سبد خرید</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className=" CourseInfo mt-5">
                    <div className="CourseInfoBtns d-flex">
                        <button onClick={() => openTab(1)}>سر فصل مطالب دوره</button>
                        <button onClick={() => openTab(2)}>پیش نیاز</button>
                        <button onClick={() => openTab(4)}>درباره مدرس دوره</button>
                        <button onClick={() => openTab(5)}>دیدگاه ها</button>
                    </div>

                    <div className="CourseInfoTabs">
                        {
                            infoTab === 1 && (
                                <div className="w-100 description mt-4">
                                    <div className="pe-4">
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
                                                )
                                            }}
                                        >
                                            {courseData?.headline || ''}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )
                        }

                        {
                            infoTab === 2 && (
                                <div className="text-center prerequisiteTab">
                                    <h3 className="mt-4">پیش نیاز های این دوره :</h3>
                                    <div className="py-1">
                                        <div className="row py-5 text">
                                            {
                                                courseData?.prerequisite?.length !== undefined && courseData?.prerequisite?.length !== 0 ? courseData?.prerequisite?.map((item, index) => {
                                                    return (
                                                        <div className="col-12 col-md-3 text-center courseList" key={index}>
                                                            <CourseCard id={item} />
                                                        </div>
                                                    )
                                                }) :
                                                    <h4><SiTicktick className="tick" />&nbsp;<b>{courseData?.name}</b> نیاز به گذراندن دوره پیش نیاز ندارد!</h4>
                                            }
                                        </div>
                                    </div>
                                    <p className="info p-2">
                                        برای اطلاع از جزئیات ، ثبت نام و مشاوره می توانید از طریق شماره تلفن، واتساپ، اینستاگرام ، تلگرام و وبسایت آموزشگاه آزاد نانو زیست فناوری اوژن اقدام کنید.
                                        <br /><br />
                                        <IoMdGlobe />&nbsp;www.ogenetech.com <br />
                                        <BsTelephoneForward />&nbsp;تلفن: 02144961487  - 09120169816<br />
                                        <IoLogoWhatsapp />&nbsp;واتساپ: 09233093463<br />
                                        <FaTelegramPlane />&nbsp;تلگرام: t.me/Ogenetechnology<br />
                                        <FaInstagram />&nbsp;اینستاگرام: instagram.com/ogenetech<br />
                                    </p>
                                </div>
                            )
                        }

                        {
                            infoTab === 4 && (
                                <div className="mt-4">
                                    <div className="w-100 description mt-1">
                                        <div className="pe-4">
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
                                                {courseData?.aboutTeacher || 'مدرس این دوره هنوز مشخص نشده است.'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            infoTab === 5 && (
                                <div className="tabInfo w-100">
                                    <div className="reviewSection mt-3">

                                        {
                                            reviewsData?.length !== undefined && reviewsData?.length !== 0 ?
                                                <h2>دیدگاه ها :</h2> : <h5>دیدگاهی برای این دوره ثبت نشده است!</h5>
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

export default CourseItem;