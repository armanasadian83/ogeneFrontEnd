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

    const [courseData, setCourseDate] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/course').then((res) => {
            setCourseDate(res);
        })
    }, []);

    return (
        <>
        <div className='CoursesSection'>
                <div className='text-center title'>
                    <h2>دوره های آموزشی</h2>
                    <p>تقویم آموزشی آذر ماه 1404</p>
                </div>

                <div className='CoursesWrapper'>
                    <Swiper 
                    slidesPerView={4}
                    spaceBetween={200}
                    navigation={false}
                    loop={false}
                    modules={[Navigation]}
                    
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
                            courseData?.length !== undefined && courseData?.length !== 0 && courseData?.map((item, index) => {
                                return(
                                    <SwiperSlide key={index}>
                                        <div className='item'>
                                            <div className='text-center paddingForMobile'>
                                                <div className='cardInfo'>
                                                    <img src={item?.images[0]} />
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

                        <SwiperSlide className='displayNoneInMobile'>

                        </SwiperSlide>
                    </Swiper>

                </div>
                
            </div>
        </>
    );
}
 
export default CoursesSection;