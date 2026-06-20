import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Autoplay, Pagination} from 'swiper/modules';

import BannerImg1 from "./../../assets/banner img1.png";
import BannerImg2 from "./../../assets/homeSlider2.jpg";

import BannerImg3 from "./../../assets/banner imgs/1.jpg"
import BannerImg4 from "./../../assets/banner imgs/2.jpg"

import ServiceSection from '../../Components/ServiceSectionHome';
import CoursesInformative from '../../Components/CoursesInformativeHome';
//import CalenderSection from '../../Components/CalenderHome/calenderBox';

import Button from '@mui/material/Button';
import CoursesSection from '../../Components/CoursesHome';
import ProductsSection from '../../Components/ProductsHome';

import shopBannerImage from "./../../assets/shopBannerImg.png";
import { FaShoppingCart } from "react-icons/fa";

import { MyContext } from "../../App";
import { useContext, useEffect } from 'react';
import TabsHome from '../../Components/tabSectionHome';
import { Link } from 'react-router-dom';
import BaleAlert from '../../Components/baleAlert';

const Home = () => {

    const context = useContext(MyContext);
    
    useEffect(() => {
        context.setIsShowFooter(true);
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

    return (
        <>
            <div className="bannerSectionPc">
                <Swiper 
                    slidesPerView={1}
                    spaceBetween={50}
                    navigation={false}
                    loop={false}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    modules={[Navigation, Autoplay, Pagination]}
                    pagination= {{ clickable: true }}>
                        <SwiperSlide>
                            <div className='item'>
                                <div className="bannerInfo my-5">
                                    <h2>آموزشگاه آزاد نانوزیست فناوری اوژن</h2>
                                    <div>
                                        <p>ارائه گواهی مهارت آموزی از سازمان فنی و حرفه ای کشور</p>
                                        <p>هدایت پایان نامه های دکتری و کارشناسی ارشد</p>
                                        <p>در رشته های ژنتیک پزشکی و مولکولی</p>
                                        <p>مهندسی بافت، نانوفناوری و رشته های مرتبط</p>
                                    </div>
                                </div>
                                <img className="bannerImg" src={BannerImg1} />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className='item'>
                                <div className="bannerInfo my-5">
                                    <h2>آموزشگاه آزاد نانوزیست فناوری اوژن</h2>
                                    <div>
                                        <p>ارائه گواهی مهارت آموزی از سازمان فنی و حرفه ای کشور</p>
                                        <p>هدایت پایان نامه های دکتری و کارشناسی ارشد</p>
                                        <p>در رشته های ژنتیک پزشکی و مولکولی</p>
                                        <p>مهندسی بافت، نانوفناوری و رشته های مرتبط</p>
                                    </div>
                                </div>
                                <img className="bannerImg" src={BannerImg1} />
                            </div>
                        </SwiperSlide>

                        {/*<SwiperSlide>
                            <div className='item'>
                                <div className="bannerInfo bannerInfo2 my-5">
                                    <h2>همایش بین المللی بیوتکنولوژی</h2>
                                    <div>
                                        <p>زیست فناوری پزشکی</p>
                                        <p>زیست فناوری صنعت و محیط زیست</p>
                                        <p>زیست فناوری جانوری، آبزیان و حیات وحش</p>
                                        <p>زیست فناوری گیاهی</p>
                                        <p>بیوانفورماتیک و هوش مصنوعی</p>
                                        <p>مباحث نظری</p>
                                    </div>
                                </div>
                                <img className="bannerImg bannerImg2" src={BannerImg2} />
                            </div>
                        </SwiperSlide>*/}

                        {/* these below banners are removed on 16 Feb 2026 */}

                        {/*<SwiperSlide>
                            <div className='item'>
                                
                                <div className="bannerInfo my-5">
                                    <h2>سومین رویداد صدرا</h2>
                                    <div>
                                        <p>علوم انسانی و علوم شناختی ،علوم پایه و فناوری های همگرا</p>
                                        <p>برق، کامپیوتر و هوش مصنوعی، عمران، هنر، معماری و شهرسازی</p>
                                        <p>نفت، انرژی، معدن و محیط زیست</p>
                                    </div>
                                </div>
                                <img className="bannerImg three" src={BannerImg3} />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className='item'>
                                
                                <div className="bannerInfo my-5">
                                    <h2>پنجمین کنگره پیشرفت های مهندسی بافت و پزشکی بازساختی ایران</h2>
                                    <div>
                                        <p>سلول های بنیادی، پوست زیبایی و ترمیم زخم</p>
                                        <p>سیستم اسکلتی-عضلانی، بازسازی بافت های نرم</p>
                                        <p>زنان و نازایی، بیولوژی تولید مثل</p>
                                    </div>
                                </div>
                                <img className="bannerImg four" src={BannerImg4} />
                            </div>
                        </SwiperSlide>*/}
                </Swiper>
            </div>

            <div className='bannerSectionMobile w-100'>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={0}
                    navigation={false}
                    loop={false}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    modules={[Navigation, Autoplay, Pagination]}
                    pagination= {{ clickable: true }}
                >
                    <SwiperSlide>
                        <div className='text-center'>
                            <div className='bannerImgWrapper'>
                                <img src={BannerImg1} />
                            </div>
                            <h2 className='mt-3'>آموزشگاه آزاد نانوزیست فناوری اوژن</h2> 
                            <div className='pWrapper'>
                                <p>ارائه گواهی مهارت آموزی از سازمان فنی و حرفه ای کشور</p>
                                <p>هدایت پایان نامه های دکتری و کارشناسی ارشد</p>
                                <p>در رشته های ژنتیک پزشکی و مولکولی</p>
                                <p>مهندسی بافت، نانوفناوری و رشته های مرتبط</p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='text-center'>
                            <div className='bannerImgWrapper'>
                                <img src={BannerImg1} />
                            </div>
                            <h2 className='mt-3'>آموزشگاه آزاد نانوزیست فناوری اوژن</h2> 
                            <div className='pWrapper'>
                                <p>ارائه گواهی مهارت آموزی از سازمان فنی و حرفه ای کشور</p>
                                <p>هدایت پایان نامه های دکتری و کارشناسی ارشد</p>
                                <p>در رشته های ژنتیک پزشکی و مولکولی</p>
                                <p>مهندسی بافت، نانوفناوری و رشته های مرتبط</p>
                            </div>
                        </div>
                    </SwiperSlide>
                    {/*<SwiperSlide>
                        <div className='text-center'>
                            <div className='bannerImgWrapper MobileBannerImg2'>
                                <img src={BannerImg2} />
                            </div>
                            <h2 className='mt-3'>همایش بین المللی بیوتکنولوژی</h2>
                            <div className='pWrapper text-center'>
                                <p>زیست فناوری پزشکی</p>
                                <p>زیست فناوری صنعت و محیط زیست</p>
                                <p>زیست فناوری جانوری، آبزیان و حیات وحش</p>
                                <p>زیست فناوری گیاهی</p>
                                <p>بیوانفورماتیک و هوش مصنوعی</p>
                                <p>مباحث نظری</p>
                            </div>
                        </div>
                    </SwiperSlide>*/}

                    {/* these below banners are removed on 16 Feb 2026 */}
                    {/*<SwiperSlide>
                        <div className='text-center'>
                            <div className='bannerImgWrapper'>
                                <img src={BannerImg3} className='mobileBannerImage three' />
                            </div>
                            <h2 className='mt-3'>سومین رویداد صدرا</h2>
                            <div className='pWrapper text-center'>
                                <p>علوم انسانی و علوم شناختی ،علوم پایه و فناوری های همگرا</p>
                                <p>برق، کامپیوتر و هوش مصنوعی، عمران، هنر، معماری و شهرسازی</p>
                                <p>نفت، انرژی، معدن و محیط زیست</p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='text-center'>
                            <div className='bannerImgWrapper'>
                                <img src={BannerImg4} className='mobileBannerImage four' />
                            </div>
                            <h2 className='mt-3 px-3'>پنجمین کنگره پیشرفت های مهندسی بافت و پزشکی بازساختی ایران</h2>
                            <div className='pWrapper text-center'>
                                <p>سلول های بنیادی، پوست زیبایی و ترمیم زخم</p>
                                <p>سیستم اسکلتی-عضلانی، بازسازی بافت های نرم</p>
                                <p>زنان و نازایی، بیولوژی تولید مثل</p>
                            </div>
                        </div>
                    </SwiperSlide>*/}
                </Swiper>
            </div>

            {/* tabs section*/}
            <TabsHome />

            {/* Home Service Section -> Components -> ServiceSectionHome */}
            <ServiceSection />

            {/* shop banner Sep/5/2025 */}
            <div className='shopBanner'>
                <div className='row'>
                    <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
                        <div className='infoContent'>
                            <h1 className='mb-3'>فروشگاه اوژن <FaShoppingCart /></h1>
                            <p className='mt-2'>انواع کتاب، محصولات تخصصی و کاربردی از فروشگاه اوژن</p>
                            <Link to='/shop'><Button>خرید از فروشگاه</Button></Link>
                        </div>
                    </div>
                    <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
                        <div className='imgWrapper'>
                            <img src={shopBannerImage} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses (Informative Section) -> Components -> CourseInformativeHome */}
            {/*<CoursesInformative />*/}

            {/* Calender Section -> Components -> CalenderHome 
            <CalenderSection />*/}

            {/* Courses */}
            <CoursesSection />

            {/* Products 
            <ProductsSection /> */}

        </>
    ); 
}
 
export default Home;
