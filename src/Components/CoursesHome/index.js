import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { IoArrowBackOutline } from "react-icons/io5";

/* Skeleton placeholder — mirrors the real courseCard structure exactly */
const CourseSkeletonCard = () => (
    <div className='courseCard skeletonCard'>
        <div className='courseImgWrapper skeletonShimmer'></div>
        <div className='courseCardBody'>
            <div className='skeletonLine skeletonLineTitle skeletonShimmer'></div>
            <div className='skeletonLine skeletonLineTitle2 skeletonShimmer'></div>
            <div className='skeletonLine skeletonLineBtn skeletonShimmer'></div>
        </div>
    </div>
);

const CoursesSection = () => {

    // backend
    const [courseData, setCourseData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDataFromApi('/api/course').then((res) => {
            setCourseData(res);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, []);

    // to show random numbers:
    const [startIndex, setStartIndex] = useState(0);
    const ITEMS_TO_SHOW = 10;

    useEffect(() => {
        if (courseData?.length > ITEMS_TO_SHOW) {
            const maxStart = courseData.length - ITEMS_TO_SHOW;
            const randomStart = Math.floor(Math.random() * (maxStart + 1));
            setStartIndex(randomStart);
        }
    }, [courseData]);

    const endIndex = Math.min(startIndex + ITEMS_TO_SHOW, courseData?.length || 0);
    const displayData = Array.isArray(courseData) ? courseData.slice(startIndex, endIndex) : [];

    const swiperBreakpoints = {
        200: { slidesPerView: 1, spaceBetween: 16 },
        650: { slidesPerView: 2, spaceBetween: 20 },
        1000: { slidesPerView: 3, spaceBetween: 24 },
        1400: { slidesPerView: 4, spaceBetween: 28 }
    };

    return (
        <>
            <div className='CoursesSection'>
                <div className='text-center title'>
                    <span className='titleTag'>دوره‌های آموزشی</span>
                    <h2>تقویم آموزشی شهریورماه <span>1405</span></h2>
                </div>

                <div className='CoursesWrapper'>
                    {
                        isLoading ? (
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={28}
                                navigation={false}
                                loop={false}
                                breakpoints={swiperBreakpoints}
                            >
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <SwiperSlide key={i}>
                                        <CourseSkeletonCard />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={28}
                                navigation={false}
                                loop={true}
                                speed={800}
                                modules={[Navigation, Autoplay]}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                breakpoints={swiperBreakpoints}
                            >
                                {
                                    displayData?.length !== undefined && displayData?.length !== 0 && displayData?.map((item, index) => {
                                        return (
                                            <SwiperSlide key={index}>
                                                <div className='courseCard'>
                                                    <div className='courseImgWrapper'>
                                                        <img src={item?.images[0]} />
                                                        <span className='courseBadge'>دوره آموزشی</span>
                                                    </div>
                                                    <div className='courseCardBody'>
                                                        <p className='courseTitle'>{item?.name?.substring(0, 62)}</p>
                                                        <Link to={`/course/${item?.id}`} className='courseCardLink'>
                                                            <Button className='courseCardBtn'>
                                                                مشاهده جزئیات دوره
                                                                <IoArrowBackOutline className='courseCardBtnIcon' />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default CoursesSection;