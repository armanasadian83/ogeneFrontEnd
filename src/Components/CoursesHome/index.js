import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Autoplay, Pagination} from 'swiper/modules';

import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';

const CoursesSection = () => {

    // backend

    const [courseData, setCourseData] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/course').then((res) => {
            setCourseData(res);
        })
    }, []);


    // to show random numbers:
    const [startIndex, setStartIndex] = useState(0);
    const ITEMS_TO_SHOW = 10;
    
    // Generate random start index when component mounts
    useEffect(() => {
        if (courseData?.length > ITEMS_TO_SHOW) {
            const maxStart = courseData.length - ITEMS_TO_SHOW;
            const randomStart = Math.floor(Math.random() * (maxStart + 1));
            setStartIndex(randomStart);
        }
    }, [courseData]);
    
    // Calculate end index
    const endIndex = Math.min(startIndex + ITEMS_TO_SHOW, courseData?.length || 0);
    const displayData = Array.isArray(courseData) ? courseData.slice(startIndex, endIndex) : [];

    return (
        <>
        <div className='CoursesSection'>
                <div className='text-center title'>
                    <h2>دوره های آموزشی</h2>
                    <p>تقویم آموزشی مردادماه 1405</p>
                </div>

                <div className='CoursesWrapper'>
                    <Swiper 
                    slidesPerView={4}
                    spaceBetween={200}
                    navigation={false}
                    loop={true}
                    modules={[Navigation, Autoplay]}
                    autoplay={{
                        delay: 3000, // 3000ms = 3 seconds (change this value as needed)
                        disableOnInteraction: false, // Set to true if you want to stop autoplay when user interacts
                        pauseOnMouseEnter: true, // Pause autoplay when mouse hovers over the slider
                    }}
                    
                    breakpoints={{
                        200 : {
                            slidesPerView : 1,
                            spaceBetween : 0
                        },
                        650 : {
                            slidesPerView : 2,
                            spaceBetween : 200
                        },
                        1000 : {
                            slidesPerView : 3,
                            spaceBetween : 200
                        },
                        1400 : {
                            slidesPerView : 4,
                            spaceBetween : 300
                        }
                    }}
                    >
                        {
                            displayData?.length !== undefined && displayData?.length !== 0 && displayData?.map((item, index) => {
                                return(
                                    <SwiperSlide key={index}>
                                        <div className='item'>
                                            <div className='text-center paddingForMobile'>
                                                <div className='cardInfo'>
                                                    <img src={item?.images[0]} style={{borderRadius: '20px'}} />
                                                    <p className='mt-3'>{item?.name?.substring(0, 62)}</p>
                                                </div>
                                                <div className='cardBtn'>
                                                    <Link to={`/course/${item?.id}`}>
                                                        <Button>
                                                            مشاهده جزئیات دوره
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )
                            })
                        }

                        {/*<SwiperSlide className='displayNoneInMobile'>

                        </SwiperSlide>*/}
                    </Swiper>

                </div>
                
            </div>
        </>
    );
}
 
export default CoursesSection;