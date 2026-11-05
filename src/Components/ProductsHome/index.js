import { useLanguage } from "../../i18n/LanguageContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Autoplay, Pagination} from 'swiper/modules';

import Button from '@mui/material/Button';

const ProductsSection = () => {
    const { t } = useLanguage();
    return (
        <>
        <div className='productsSection'>
                <div className='text-center title'>
                    <h2>{t("محصولات فروشگاه اوژن  (تکوین)")}</h2>
                    <p>{t("فروشگاه آنلاین اوژن")}</p>
                </div>
                
                <div className='productsWrapper'>
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
                        500 : {
                            slidesPerView : 4,
                            spaceBetween : 200
                        }
                    }}
                    >
                        <SwiperSlide>
                            <div className='item'>
                                <div className='text-center paddingForMobile'>
                                    <div className='cardInfo'>
                                        <img src='https://c.animaapp.com/NMpalZkr/img/image-11@2x.png' />
                                        <p className='mt-4'>{t("کتاب زیست شناسی")}<br />{t("سلولی و مولکولی")}</p>
                                    </div>
                                    <div className='cardBtn'>
                                        <Button>{t("مشاهده جزئیات محصول")}</Button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className='item'>
                                <div className='text-center paddingForMobile'>
                                    <div className='cardInfo'>
                                        <img src='https://c.animaapp.com/NMpalZkr/img/image-11@2x.png' />
                                        <p className='mt-4'>{t("کتاب زیست شناسی")}<br />{t("سلولی و مولکولی")}</p>
                                    </div>
                                    <div className='cardBtn'>
                                        <Button>{t("مشاهده جزئیات محصول")}</Button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className='item'>
                                <div className='text-center paddingForMobile'>
                                    <div className='cardInfo'>
                                        <img src='https://c.animaapp.com/NMpalZkr/img/image-11@2x.png' />
                                        <p className='mt-4'>{t("کتاب زیست شناسی")}<br />{t("سلولی و مولکولی")}</p>
                                    </div>
                                    <div className='cardBtn'>
                                        <Button>{t("مشاهده جزئیات محصول")}</Button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className='item'>
                                <div className='text-center paddingForMobile'>
                                    <div className='cardInfo'>
                                        <img src='https://c.animaapp.com/NMpalZkr/img/image-11@2x.png' />
                                        <p className='mt-4'>{t("کتاب زیست شناسی")}<br />{t("سلولی و مولکولی")}</p>
                                    </div>
                                    <div className='cardBtn'>
                                        <Button>{t("مشاهده جزئیات محصول")}</Button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className='item'>
                                <div className='text-center paddingForMobile'>
                                    <div className='cardInfo'>
                                        <img src='https://c.animaapp.com/NMpalZkr/img/image-11@2x.png' />
                                        <p className='mt-4'>{t("کتاب زیست شناسی")}<br />{t("سلولی و مولکولی")}</p>
                                    </div>
                                    <div className='cardBtn'>
                                        <Button>{t("مشاهده جزئیات محصول")}</Button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className='item'>
                                <div className='text-center paddingForMobile'>
                                    <div className='cardInfo'>
                                        <img src='https://c.animaapp.com/NMpalZkr/img/image-11@2x.png' />
                                        <p className='mt-4'>{t("کتاب زیست شناسی")}<br />{t("سلولی و مولکولی")}</p>
                                    </div>
                                    <div className='cardBtn'>
                                        <Button>{t("مشاهده جزئیات محصول")}</Button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className='displayNoneInMobile'></SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>
    );
}
 
export default ProductsSection;