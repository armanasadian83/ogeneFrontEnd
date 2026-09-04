import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

import ServiceSection from '../../Components/ServiceSectionHome';
import CoursesInformative from '../../Components/CoursesInformativeHome';

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

/* Decorative DNA + hexagon SVG used inside each banner card */
const BannerDecor = () => (
    <svg className="bannerDecor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none">
        {/* Faint Hexagons */}
        <g stroke="var(--decor-light)" strokeWidth="2" opacity="0.35">
            <path d="M324 64 L365 88 L365 136 L324 160 L283 136 L283 88 Z"/>
            <path d="M398 102 L439 126 L439 174 L398 198 L357 174 L357 126 Z"/>
            <path d="M171 348 L212 372 L212 420 L171 444 L130 420 L130 372 Z"/>
            <path d="M140 296 L181 320 L181 368 L140 392 L99 368 L99 320 Z"/>
        </g>

        {/* Upper Leaf Loop */}
        <path d="M255 225 C221 211 211 163 225 112 C240 58 287 48 337 55 C385 62 399 101 393 145 C386 196 350 226 303 226 C285 226 269 226 255 225 Z" stroke="var(--decor-strong)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Upper Leaf Veins */}
        <line x1="253" y1="122" x2="342" y2="164" stroke="var(--decor-strong)" strokeWidth="2" opacity="0.8"/>
        <line x1="251" y1="151" x2="312" y2="190" stroke="var(--decor-strong)" strokeWidth="2" opacity="0.8"/>
        <line x1="278" y1="87" x2="343" y2="86" stroke="var(--decor-strong)" strokeWidth="2" opacity="0.8"/>
        <path d="M255 225 C252 186 247 151 252 120" stroke="var(--decor-strong)" strokeWidth="3" strokeLinecap="round"/>

        {/* Upper Leaves */}
        <path d="M252 120 C230 101 232 103 249 105 C268 107 281 118 292 134 C276 142 260 139 252 120 Z" fill="var(--decor-strong)" opacity="0.9"/>
        <path d="M355 75 C372 58 391 58 407 64 C402 82 388 93 366 91 C359 87 356 81 355 75 Z" fill="var(--decor-strong)" opacity="0.9"/>

        {/* Lower Leaf Loop */}
        <path d="M255 225 C214 215 164 217 135 243 C104 271 101 322 119 365 C134 399 170 389 204 374 C243 357 264 321 260 281 C258 260 257 242 255 225 Z" stroke="var(--decor-strong)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Lower Leaf Veins */}
        <line x1="137" y1="286" x2="225" y2="344" stroke="var(--decor-strong)" strokeWidth="2" opacity="0.8"/>
        <line x1="159" y1="264" x2="239" y2="316" stroke="var(--decor-strong)" strokeWidth="2" opacity="0.8"/>
        <line x1="148" y1="335" x2="202" y2="371" stroke="var(--decor-strong)" strokeWidth="2" opacity="0.8"/>

        {/* Main Stem */}
        <path d="M255 225 C255 266 250 315 220 350 C198 375 169 385 138 382" stroke="var(--decor-strong)" strokeWidth="3" strokeLinecap="round"/>

        {/* Lower Leaves */}
        <path d="M221 310 C238 289 254 292 265 305 C273 322 264 340 248 344 C231 345 220 332 221 310 Z" fill="var(--decor-strong)" opacity="0.9"/>
        <path d="M256 224 C241 202 219 199 202 209 C212 226 231 230 256 224 Z" fill="var(--decor-strong)" opacity="0.9"/>

        {/* Orange Accent Dots */}
        <circle cx="78" cy="226" r="8" fill="var(--decor-dot)"/>
        <circle cx="151" cy="129" r="5" fill="var(--decor-dot)" opacity="0.8"/>
        <circle cx="298" cy="153" r="5" fill="var(--decor-dot)" opacity="0.8"/>
        <circle cx="421" cy="201" r="6" fill="var(--decor-dot)" opacity="0.8"/>
        <circle cx="199" cy="349" r="8" fill="var(--decor-dot)"/>
        <circle cx="372" cy="325" r="13" fill="var(--decor-dot)"/>

        {/* Small Mint Dots */}
        <circle cx="211" cy="54" r="6" fill="var(--decor-light)" opacity="0.6"/>
        <circle cx="89" cy="324" r="5" fill="var(--decor-light)" opacity="0.6"/>
        <circle cx="422" cy="299" r="7" fill="var(--decor-light)" opacity="0.6"/>
        <circle cx="247" cy="378" r="4" fill="var(--decor-light)" opacity="0.6"/>
    </svg>
);

const CoursesDecor = () => (
    <svg className="bannerDecor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none">
        {/* Faint Hexagons */}
        <g stroke="var(--decor-light)" strokeWidth="2" opacity="0.35">
            <path d="M355 55 L396 79 L396 127 L355 151 L314 127 L314 79 Z"/>
            <path d="M407 150 L448 174 L448 222 L407 246 L366 222 L366 174 Z"/>
            <path d="M105 315 L146 339 L146 387 L105 411 L64 387 L64 339 Z"/>
            <path d="M155 395 L196 419 L196 467 L155 491 L114 467 L114 419 Z"/>
        </g>

        {/* Open Book - Main Educational Symbol */}
        <path d="M256 190 C222 168 180 166 145 181 C137 185 132 193 132 202 V328 C132 337 141 343 150 340 C185 328 222 331 256 352 C290 331 327 328 362 340 C371 343 380 337 380 328 V202 C380 193 375 185 367 181 C332 166 290 168 256 190 Z"
              stroke="var(--decor-strong)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"/>

        {/* Book Center */}
        <path d="M256 190 V352"
              stroke="var(--decor-strong)"
              strokeWidth="4"
              strokeLinecap="round"/>

        {/* Left Book Lines */}
        <line x1="159" y1="215" x2="229" y2="211" stroke="var(--decor-strong)" strokeWidth="2.5" opacity="0.65"/>
        <line x1="159" y1="240" x2="225" y2="237" stroke="var(--decor-strong)" strokeWidth="2.5" opacity="0.65"/>
        <line x1="159" y1="265" x2="218" y2="263" stroke="var(--decor-strong)" strokeWidth="2.5" opacity="0.65"/>
        <line x1="159" y1="290" x2="226" y2="292" stroke="var(--decor-strong)" strokeWidth="2.5" opacity="0.65"/>

        {/* Right Book Lines */}
        <line x1="283" y1="211" x2="353" y2="215" stroke="var(--decor-strong)" strokeWidth="2.5" opacity="0.65"/>
        <line x1="287" y1="237" x2="353" y2="240" stroke="var(--decor-strong)" strokeWidth="2.5" opacity="0.65"/>
        <line x1="294" y1="263" x2="353" y2="265" stroke="var(--decor-strong)" strokeWidth="2.5" opacity="0.65"/>
        <line x1="286" y1="292" x2="353" y2="290" stroke="var(--decor-strong)" strokeWidth="2.5" opacity="0.65"/>

        {/* Learning Path */}
        <path d="M256 352 C256 376 239 388 216 388 C193 388 181 401 181 421"
              stroke="var(--decor-strong)"
              strokeWidth="4"
              strokeLinecap="round"/>

        <path d="M256 352 C256 376 273 388 296 388 C319 388 331 401 331 421"
              stroke="var(--decor-strong)"
              strokeWidth="4"
              strokeLinecap="round"/>

        {/* Growth Leaves */}
        <path d="M181 421 C158 405 139 414 137 434 C154 446 174 441 181 421 Z"
              fill="var(--decor-strong)"
              opacity="0.9"/>

        <path d="M331 421 C354 405 373 414 375 434 C358 446 338 441 331 421 Z"
              fill="var(--decor-strong)"
              opacity="0.9"/>

        {/* Central Learning Leaf */}
        <path d="M256 154 C235 137 214 145 211 166 C228 177 247 171 256 154 Z"
              fill="var(--decor-strong)"
              opacity="0.9"/>

        {/* Central Stem */}
        <path d="M256 190 C256 177 256 166 256 154"
              stroke="var(--decor-strong)"
              strokeWidth="3"
              strokeLinecap="round"/>

        {/* Orange Course Dots */}
        <circle cx="108" cy="205" r="7" fill="var(--decor-dot)"/>
        <circle cx="405" cy="280" r="6" fill="var(--decor-dot)" opacity="0.8"/>
        <circle cx="116" cy="280" r="5" fill="var(--decor-dot)" opacity="0.8"/>
        <circle cx="393" cy="350" r="8" fill="var(--decor-dot)"/>
        <circle cx="256" cy="116" r="6" fill="var(--decor-dot)" opacity="0.85"/>
        <circle cx="213" cy="420" r="5" fill="var(--decor-dot)" opacity="0.75"/>

        {/* Small Mint Dots */}
        <circle cx="290" cy="78" r="5" fill="var(--decor-light)" opacity="0.6"/>
        <circle cx="90" cy="150" r="6" fill="var(--decor-light)" opacity="0.6"/>
        <circle cx="420" cy="315" r="5" fill="var(--decor-light)" opacity="0.6"/>
        <circle cx="72" cy="430" r="4" fill="var(--decor-light)" opacity="0.6"/>
    </svg>
);

const ShopDecor = () => (
    <svg className="bannerDecor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="none">
        {/* Faint Hexagons */}
        <g stroke="var(--decor-light)" strokeWidth="2" opacity="0.35">
            <path d="M82 105 L123 81 L164 105 L164 153 L123 177 L82 153 Z"/>
            <path d="M365 75 L406 51 L447 75 L447 123 L406 147 L365 123 Z"/>
            <path d="M390 355 L431 331 L472 355 L472 403 L431 427 L390 403 Z"/>
            <path d="M62 365 L103 341 L144 365 L144 413 L103 437 L62 413 Z"/>
        </g>

        {/* Main Product / Shopping Box */}
        <path d="M155 190 L357 190 L382 230 L382 353 C382 362 375 369 366 369 H146 C137 369 130 362 130 353 V230 Z"
              stroke="var(--decor-strong)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"/>

        {/* Box Top */}
        <path d="M130 230 L155 190 H357 L382 230 L256 258 Z"
              stroke="var(--decor-strong)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"/>

        {/* Box Center */}
        <path d="M256 258 V369"
              stroke="var(--decor-strong)"
              strokeWidth="4"
              strokeLinecap="round"/>

        {/* Product Label */}
        <path d="M205 276 H307 V330 H205 Z"
              stroke="var(--decor-strong)"
              strokeWidth="3"
              strokeLinejoin="round"
              opacity="0.8"/>

        <line x1="223" y1="294" x2="289" y2="294"
              stroke="var(--decor-strong)"
              strokeWidth="2.5"
              opacity="0.7"/>

        <line x1="232" y1="309" x2="280" y2="309"
              stroke="var(--decor-strong)"
              strokeWidth="2.5"
              opacity="0.7"/>

        {/* Biotechnology Leaf */}
        <path d="M256 154 C232 134 209 144 207 168 C226 181 247 173 256 154 Z"
              fill="var(--decor-strong)"
              opacity="0.9"/>

        <path d="M256 190 C256 178 256 166 256 154"
              stroke="var(--decor-strong)"
              strokeWidth="3"
              strokeLinecap="round"/>

        {/* Leaf Vein */}
        <line x1="217" y1="161" x2="249" y2="160"
              stroke="var(--decor-light)"
              strokeWidth="2"
              opacity="0.8"/>

        {/* Molecular / Product Connection */}
        <path d="M155 190 C135 170 119 160 101 160"
              stroke="var(--decor-strong)"
              strokeWidth="3"
              strokeLinecap="round"/>

        <path d="M357 190 C377 170 393 160 411 160"
              stroke="var(--decor-strong)"
              strokeWidth="3"
              strokeLinecap="round"/>

        {/* Molecular Nodes */}
        <circle cx="101" cy="160" r="8"
                fill="var(--decor-strong)" opacity="0.9"/>

        <circle cx="411" cy="160" r="8"
                fill="var(--decor-strong)" opacity="0.9"/>

        <line x1="101" y1="160" x2="82" y2="135"
              stroke="var(--decor-strong)"
              strokeWidth="2.5"
              opacity="0.7"/>

        <line x1="411" y1="160" x2="430" y2="135"
              stroke="var(--decor-strong)"
              strokeWidth="2.5"
              opacity="0.7"/>

        <circle cx="82" cy="135" r="5"
                fill="var(--decor-dot)"
                opacity="0.85"/>

        <circle cx="430" cy="135" r="5"
                fill="var(--decor-dot)"
                opacity="0.85"/>

        {/* Small Product Leaves */}
        <path d="M142 276 C119 260 101 268 100 288 C117 298 135 292 142 276 Z"
              fill="var(--decor-strong)"
              opacity="0.85"/>

        <path d="M370 276 C393 260 411 268 412 288 C395 298 377 292 370 276 Z"
              fill="var(--decor-strong)"
              opacity="0.85"/>

        {/* Orange Accent Dots */}
        <circle cx="82" cy="225" r="7"
                fill="var(--decor-dot)"/>

        <circle cx="421" cy="235" r="6"
                fill="var(--decor-dot)"
                opacity="0.8"/>

        <circle cx="112" cy="315" r="5"
                fill="var(--decor-dot)"
                opacity="0.8"/>

        <circle cx="400" cy="315" r="8"
                fill="var(--decor-dot)"/>

        <circle cx="256" cy="115" r="6"
                fill="var(--decor-dot)"
                opacity="0.85"/>

        {/* Small Mint Dots */}
        <circle cx="183" cy="91" r="5"
                fill="var(--decor-light)"
                opacity="0.6"/>

        <circle cx="329" cy="91" r="5"
                fill="var(--decor-light)"
                opacity="0.6"/>

        <circle cx="72" cy="300" r="4"
                fill="var(--decor-light)"
                opacity="0.6"/>

        <circle cx="444" cy="300" r="4"
                fill="var(--decor-light)"
                opacity="0.6"/>

        <circle cx="256" cy="400" r="5"
                fill="var(--decor-light)"
                opacity="0.6"/>
    </svg>
);

const BannerDotsBg = () => (
    <div className="bannerDotsBg" aria-hidden="true">
        <span className="dot dot1"></span>
        <span className="dot dot2"></span>
        <span className="dot dot3"></span>
        <span className="dot dot4"></span>
        <span className="dot dot5"></span>
        <span className="dot dot6"></span>
        <span className="dot dot7"></span>
        <span className="dot dot8"></span>
    </div>
);

/* Shop banner decorative SVG — lab/book illustration in site palette */
const ShopBannerDecor = () => (
    <svg className="shopDecorSvg" viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" fill="none">
        {/* ground shadow */}
        <ellipse cx="250" cy="290" rx="190" ry="14" fill="var(--decor-light)" opacity="0.25"/>

        {/* books stack */}
        <rect x="70" y="120" width="60" height="160" rx="6" fill="var(--decor-strong)"/>
        <rect x="85" y="148" width="30" height="5" rx="2" fill="#ffffff" opacity="0.85"/>
        <rect x="85" y="162" width="30" height="5" rx="2" fill="#ffffff" opacity="0.85"/>

        <rect x="135" y="130" width="55" height="150" rx="6" fill="#fdfdfd" stroke="var(--decor-strong)" strokeWidth="3"/>
        <rect x="148" y="155" width="28" height="5" rx="2" fill="var(--decor-strong)" opacity="0.6"/>
        <rect x="148" y="168" width="28" height="5" rx="2" fill="var(--decor-strong)" opacity="0.6"/>

        {/* notebook tilted */}
        <rect x="150" y="190" width="90" height="70" rx="8" fill="#fdfdfd" stroke="var(--decor-strong)" strokeWidth="3" transform="rotate(-18 195 225)"/>
        <line x1="168" y1="205" x2="215" y2="220" stroke="var(--decor-dot)" strokeWidth="4" strokeLinecap="round" transform="rotate(-18 195 225)"/>
        <line x1="163" y1="220" x2="210" y2="235" stroke="var(--decor-dot)" strokeWidth="4" strokeLinecap="round" transform="rotate(-18 195 225)"/>
        <line x1="158" y1="235" x2="205" y2="250" stroke="var(--decor-dot)" strokeWidth="4" strokeLinecap="round" transform="rotate(-18 195 225)"/>

        {/* flask */}
        <path d="M255 60 h30 v55 l35 70 a14 14 0 0 1 -13 20 h-74 a14 14 0 0 1 -13 -20 l35 -70 Z"
              fill="#ffffff" stroke="var(--decor-strong)" strokeWidth="4" strokeLinejoin="round"/>
        <rect x="252" y="50" width="36" height="14" rx="3" fill="var(--decor-strong)"/>
        <path d="M223 190 a14 14 0 0 0 13 20 h74 a14 14 0 0 0 13 -20 Z" fill="var(--decor-dot)" opacity="0.85"/>
        <circle cx="248" cy="175" r="5" fill="var(--decor-strong)" opacity="0.5"/>
        <circle cx="270" cy="160" r="4" fill="var(--decor-strong)" opacity="0.4"/>

        {/* petri dish */}
        <ellipse cx="345" cy="245" rx="55" ry="22" fill="#ffffff" stroke="var(--decor-strong)" strokeWidth="4"/>
        <path d="M310 240 q35 -20 65 3" stroke="var(--decor-dot)" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="345" cy="243" r="5" fill="var(--decor-dot)"/>

        {/* microscope */}
        <rect x="385" y="235" width="80" height="14" rx="6" fill="var(--decor-strong)"/>
        <rect x="415" y="205" width="18" height="35" rx="6" fill="var(--decor-strong)"/>
        <path d="M410 205 q15 -35 35 0 Z" fill="#fdfdfd" stroke="var(--decor-strong)" strokeWidth="4"/>
        <rect x="418" y="150" width="14" height="55" rx="6" fill="#fdfdfd" stroke="var(--decor-strong)" strokeWidth="3"/>
        <circle cx="425" cy="150" r="9" fill="var(--decor-strong)"/>
        <circle cx="452" cy="222" r="6" fill="var(--decor-dot)"/>

        {/* floating accent dots */}
        <circle cx="60" cy="90" r="6" fill="var(--decor-dot)" opacity="0.6"/>
        <circle cx="470" cy="130" r="5" fill="var(--decor-light)" opacity="0.7"/>
        <circle cx="440" cy="80" r="4" fill="var(--decor-dot)" opacity="0.5"/>
    </svg>
);

/* One card = one slide */
const BannerCard = ({ id, title, bullets, primaryBtn, secondaryLink }) => (
    <div className="bannerCard">
        <div className="bannerCardContent">
            <h2>{title}</h2>
            <ul>
                {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <div className="bannerCardActions">
                <Link to={primaryBtn.link}>
                    <Button className="bannerPrimaryBtn">{primaryBtn.text}</Button>
                </Link>
                <Link to='/aboutUs' className="bannerAskLink">سوالی دارید؟</Link>
            </div>
        </div>
        <BannerDotsBg />
        {
            id === 0 ? <BannerDecor /> :
            id === 1 ? <CoursesDecor /> :
            id === 2 ? <ShopDecor /> :
            null
        }
    </div>
);

/* Flat list — each entry is ONE slide/card.
   Order here = the order they slide in, one by one.
   Add as many as you want; two are always visible on desktop. */
const bannerCards = [
    {
        id: 0,
        title: 'آموزشگاه آزاد نانوزیست فن‌آوری اوژن',
        bullets: [
            'کامل‌ترین دوره‌های بیولوژی',
            'ارائه مدرک سازمان فنی و حرفه‌ای',
            'هدایت پایان‌نامه‌های کارشناسی ارشد و دکتری',
            'مختص رشته‌های ژنتیک پزشکی و مولکولی، مهندسی بافت، نانوفناوری'
        ],
        primaryBtn: { text: 'مشاهده خدمات', link: '/service' },
        secondaryLink: '/contact-us'
    },
    {
        id: 1,
        title: 'دوره های آموزشی اوژن',
        bullets: [
            'سلولی، مولکولی و ژنتیک',
            'میکروبیولوژی',
            'نانوفناوری و خدمات عمومی',
            'زیست پزشکی و گیاهی، بالینی و حیوانی'
        ],
        primaryBtn: { text: 'مشاهده دوره‌ها', link: '/courses' },
        secondaryLink: '/courseShop'
    },
    {
        id: 2,
        title: 'فروشگاه اوژن',
        bullets: [
            'کتاب‌های میکروبیولوژی و نانوفناوری',
            'انواع نانوذرات',
            'ارسال رایگان و تخفیف های ویژه'],
        primaryBtn: { text: 'مشاهده محصولات', link: '/shop' },
        secondaryLink: '/shop'
    }
];

const Home = () => {

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(true);
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

    return (
        <>
            <div className="newBannerWrapper">
                <Swiper
                    slidesPerView={2}
                    spaceBetween={24}
                    navigation={false}
                    loop={true}
                    speed={800}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    modules={[Navigation, Autoplay, Pagination]}
                    pagination={{ clickable: true }}
                    className="newBannerSwiper"
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                        },
                        768: {
                            slidesPerView: 2,
                            slidesPerGroup: 1,
                        },
                    }}
                >
                    {bannerCards.map((card, i) => (
                        <SwiperSlide key={i}>
                            <BannerCard {...card} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* tabs section*/}
            <TabsHome />

            {/* Home Service Section -> Components -> ServiceSectionHome */}
            <ServiceSection />

            {/* shop banner — redesigned to match site palette */}
            <div className='shopBanner'>
                <div className='row align-items-center'>
                    <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
                        <div className='infoContent'>
                            <span className='shopBannerTag'>
                                <FaShoppingCart /> فروشگاه اوژن
                            </span>
                            <h1 className='mb-3'>انواع محصولات علمی و آموزشی</h1>
                            <p className='mt-2'>انواع کتاب، محصولات تخصصی و کاربردی از فروشگاه اوژن</p>
                            <Link to='/shop'>
                                <Button className='shopBannerBtn'>خرید از فروشگاه</Button>
                            </Link>
                        </div>
                    </div>
                    <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
                        <div className='imgWrapper'>
                            <ShopBannerDecor />
                        </div>
                    </div>
                </div>
            </div>

            {/*<CoursesInformative />*/}
            <CoursesSection />
            {/*<ProductsSection /> */}

        </>
    );
}

export default Home;