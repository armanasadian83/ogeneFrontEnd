import { Link } from 'react-router-dom';

import logo from "./../../assets/logo.png"

import { FaInstagram, FaTelegram } from "react-icons/fa6";
import { IoCallOutline } from "react-icons/io5";
import { FiMapPin, FiArrowLeft } from "react-icons/fi";
import { PiCopyrightFill } from "react-icons/pi";

const Footer = () => {
    return (
        <footer className="site-footer">

            {/* decorative DNA-helix line, purely visual */}
            <svg className="footer-helix" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M40 0 C120 100, -40 200, 40 300 C120 400, -40 500, 40 600 C120 700, -40 750, 40 800" stroke="currentColor" strokeWidth="4" />
                <path d="M160 0 C80 100, 240 200, 160 300 C80 400, 240 500, 160 600 C80 700, 240 750, 160 800" stroke="currentColor" strokeWidth="4" />
                {Array.from({ length: 9 }).map((_, i) => (
                    <line key={i} x1="40" y1={i * 100} x2="160" y2={i * 100} stroke="currentColor" strokeWidth="1.5" />
                ))}
            </svg>

            <div className="footer-inner">
                <div className="footer-top">

                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src={logo} alt="لوگوی آموزشگاه اوژن" />
                            <h3>آموزشگاه آزاد نانو زیست فناوری اوژن</h3>
                        </div>
                        <p className="footer-desc">
                            با هدف برگزاری دوره ها و کارگاه های آموزشی، انجام خدمات آزمایشگاهی و پژوهشی از جمله تعریف،
                            تعیین و هدایت پایان نامه و پروژه های کارشناسی ارشد و دکتری در رشته ژنتیک پزشکی و مولکولی، نانوفناوری،
                            میکروبیولوژی، بیوتکنولوژی، مهندسی بافت، بیوانفورماتیک و سایر رشته های مرتبط، تاسیس شده است.
                        </p>
                        <div className="footer-social">
                            <a href="https://www.instagram.com/ogenetech?igsh=dXJlb3BuajJ1cGFq" aria-label="اینستاگرام" className="social-btn"><FaInstagram /></a>
                            <a href="https://t.me/Ogenetechnology" aria-label="تلگرام" className="social-btn"><FaTelegram /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>دسترسی سریع</h4>
                        <ul>
                            <li><Link to='/courseShop'><FiArrowLeft className="link-arrow" /><span>دوره های آموزشی</span></Link></li>
                            <li><Link to='/shop'><FiArrowLeft className="link-arrow" /><span>فروشگاه</span></Link></li>
                            <li><Link to='/degree'><FiArrowLeft className="link-arrow" /><span>مدرک فنی و حرفه ای</span></Link></li>
                            <li><Link to='/blog'><FiArrowLeft className="link-arrow" /><span>بلاگ</span></Link></li>
                            <li><Link to='/aboutUs'><FiArrowLeft className="link-arrow" /><span>درباره و  تماس</span></Link></li>
                        </ul> 
                    </div>

                    <div className="footer-contact">
                        <h4>ارتباط با ما</h4>
                        <p className="footer-address">
                            <FiMapPin className="address-icon" />
                            <span>تهران، صادقیه، بلوار فردوس شرق، انتهای خیابان ولیعصر، جنب متروی صادقیه، خیابان رز غربی، پلاک ۷، طبقه همکف</span>
                        </p>
                        <ul className="footer-phones">
                            <li><a href="tel:+982144961487"><IoCallOutline /><span>021-44961487</span></a></li>
                            <li><a href="tel:+989120169816"><IoCallOutline /><span>0912-0169816</span></a></li>
                            <li><a href="tel:+989050168316"><IoCallOutline /><span>0905-0168316</span></a></li>
                        </ul>
                    </div>

                    <div className="footer-trust">
                        <div
                            className="trust-seal"
                            dangerouslySetInnerHTML={{
                                __html: `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=6800848&Code=DCUvppqG13XGco7UU3cpoZFr82zDH5vY'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=6800848&Code=DCUvppqG13XGco7UU3cpoZFr82zDH5vY' alt='نماد اعتماد الکترونیکی' style='cursor:pointer' code='DCUvppqG13XGco7UU3cpoZFr82zDH5vY' /></a>`
                            }}
                        />
                    </div>

                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <span className="footer-copy">
                        <PiCopyrightFill />
                        تمامی حقوق این وب سایت متعلق به آموزشگاه اوژن می باشد
                    </span>
                    <Link className="footer-credit" to='https://armanassadian.ir' target='_blank'>
                        توسعه داده شده توسط تیم فیوژن
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;



{/*import { Link } from 'react-router-dom';

import logo from "./../../assets/logo.png"

import { BiLogoTelegram } from "react-icons/bi";
import { FaInstagram, FaTelegram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";
import { IoCallOutline } from "react-icons/io5";

import { PiCopyrightFill } from "react-icons/pi";

const Footer = () => {
    return (
        <>
        <div className='footerSection'>

            <div class="overlap-container">
                <div class="bottom-div"></div>
                <div class="top-div">
                    <div className='footerBody'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 col-md-6'>
                                <h1>آموزشگاه آزاد نانو زیسـت فناوری اوژن</h1>
                                <div className='textCenterMobile'>
                                    <p>
                                        با هدف برگزاری دوره ها و کارگاه های آموزشی، انجام خدمات آزمایشگاهی و پژوهشی از جمله تعریف،
                                        تعیین و هدایت پایان نامه و پروژه های کارشناسی ارشد و دکتری در رشته ژنتیک پزشکی و مولکولی، نانوفناوری،
                                        میکروبیولوژی، بیوتکنولوژی، مهندسی بافت، بیوانفورماتیک و سایر رشته های مرتبط، تاسیس شده است.
                                    </p>
                                </div>
                                <h2>دسترسی سریع</h2>
                                <div className='footerMenu'>
                                    <p>
                                        <Link to='/courseShop'>دوره های آموزشی</Link>
                                    </p>
                                    <p>
                                        <Link to='/shop'>فروشگاه</Link>
                                    </p>
                                    <p>
                                        <Link to='/degree'>مدرک فنی و حرفه ای</Link>
                                    </p>
                                    <p>
                                        <Link to='/aboutUs'>تماس با ما</Link>
                                    </p>
                                    <p>
                                        <Link to='/aboutUs'>درباره ما</Link>
                                    </p>
                                </div>
                            </div>
                            <div className='col-12 col-md-6 left-part'>
                                <p>تهران، صادقیه، بلوار فردوس شرق، انتهای خیابان ولیعصر,
                                    جنب متروی صادقیه، خیابان رز غربی، پلاک 7، طبقه همکف
                                </p>
                                <div className='d-flex contactSection'>
                                    <div className='d-flex align-items-center gap-3'>
                                        <div className='contact-info'>
                                            <div>
                                                <a href="tel:+982144961487">021-44961487</a>
                                            </div>
                                            <div>
                                                <a href="tel:+989120169816">09120169816</a>
                                            </div>
                                            <div>
                                                <a href="tel:+989050168316">09050168316</a>
                                            </div>
                                            <div className='flex align-items-center justify-content-end gap-3 icons'>
                                                <span><FaInstagram /></span>
                                                <span><FaTelegram /></span>
                                            </div>
                                        </div>
                                        <div className='footerLogo text-center align-items-center ogeneLogo'>
                                            <img src={logo} alt="Egon Logo" />
                                        </div>
                                        <div 
                                            className='footerLogo text-center align-items-center'
                                            dangerouslySetInnerHTML={{
                                                __html: `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=6800848&Code=DCUvppqG13XGco7UU3cpoZFr82zDH5vY'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=6800848&Code=DCUvppqG13XGco7UU3cpoZFr82zDH5vY' alt='' style='cursor:pointer' code='DCUvppqG13XGco7UU3cpoZFr82zDH5vY' /></a>`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='text-center footerCopyRight'>
                            <Link className='text-muted' to='https://armanassadian.ir' target='_blank'>
                                <span>توسعه داده شده توسط تیم فیوژن
                                    <PiCopyrightFill />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        
        </div>
        </>
    );
}
 
export default Footer;*/}
