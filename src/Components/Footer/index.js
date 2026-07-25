import { Link } from 'react-router-dom';

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
                                {/*<div className='d-flex justify-content-end'>
                                    <div className='text-center right-content'>
                                        <p className='motto'>اوژن همه جا با شما</p>
                                        <div className='iconWrapper'>
                                            <div className='d-flex'>
                                                <div className='icon text-center align-items-center'>
                                                    <FaTelegram className='svgTelegram' />
                                                </div>
                                                <div className='icon text-center align-items-center'>
                                                    <FaInstagram className='svgInstagram' />
                                                </div>
                                            </div>
                                            <div className='d-flex'>
                                                <div className='icon text-center align-items-center'>
                                                    <FaWhatsapp className='svgWhatsapp' />
                                                </div>
                                                <div className='icon text-center align-items-center'>
                                                    <IoCallOutline className='svgPhone' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex align-items-center flex-nowrap'>
                                        <div className=''>
                                            <span>021-2244961487</span>
                                        </div>
                                        <div className='footerLogo text-center align-items-center'>
                                            <img src={logo} />
                                        </div>
                                    </div>
                                </div>*/}
                                <div className='d-flex contactSection'>
                                    <div className='d-flex align-items-center gap-3'>
                                        <div className='contact-info'>
                                            <div>
                                                <a href="tel:+98212244961487">۰۲۱-۲۲۴۴۹۶۱۴۸۷</a>
                                            </div>
                                            <div>
                                                <a href="tel:+989120169816">۰۹۱۲۰۱۶۹۸۱۶</a>
                                            </div>
                                            <div>
                                                <a href="tel:+989050168316">۰۹۰۵۰۱۶۸۳۱۶</a>
                                            </div>
                                            <div className='flex align-items-center justify-content-end gap-3 icons'>
                                                <span><FaInstagram /></span>
                                                <span><FaTelegram /></span>
                                            </div>
                                        </div>
                                        <div className='footerLogo text-center align-items-center ogeneLogo'>
                                            <img src={logo} alt="Egon Logo" />
                                        </div>
                                        <div className='footerLogo text-center align-items-center'>
                                            <a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=6800848&Code=DCUvppqG13XGco7UU3cpoZFr82zDH5vY'>
                                                <img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=6800848&Code=DCUvppqG13XGco7UU3cpoZFr82zDH5vY' alt='' style={{cursor: 'pointer'}} code='DCUvppqG13XGco7UU3cpoZFr82zDH5vY' />
                                            </a>
                                        </div>
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
        {/*<div className='footerSection'>

                <div className='footerBody'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6'>
                                <h1>آموزشگاه آزاد نانو زیسـت فناوری اوژن</h1>
                                <p>با هدف برگزاری دوره ها و کارگاه های آموزشی، انجام خدمات آزمایشگاهی و پژوهشی از جمله تعریف،
                                    تعیین و هدایت پایان نامه و پروژه های کارشناسی ارشد و دکتری در رشته ژنتیک پزشکی و مولکولی، نانوفناوری،
                                    میکروبیولوژی، بیوتکنولوژی، مهندسی بافت، بیوانفورماتیک و سایر رشته های مرتبط، تاسیس شده است.
                                </p>
                                <h2>دسترسی سریع</h2>
                                <Link to='#'>دوره های آموزشی</Link><br />
                                <Link to='#'>فروشگاه آنلاین</Link><br />
                                <Link to='#'>اساتید در اوژن</Link><br />
                                <Link to='#'>تماس با ما</Link><br />
                                <Link to='#'>درباره ما</Link>
                            </div>
                            <div className='col-6 left-part'>
                                <p>تهران، صادقیه، بلوار فردوس شرق, انتهای خیابان ولیعصر,
                                    جنب متروی صادقیه, خیابان رز غربی, پلاک 7, طبقه همکف
                                </p>
                                <div className='d-flex'>
                                    <div className='text-center right-content'>
                                        <p className='motto'>اوژن همه جا با شما</p>
                                        <div className='iconWrapper'>
                                            <div className='d-flex'>
                                                <div className='icon text-center align-items-center'>
                                                    <FaTelegram />
                                                </div>
                                                <div className='icon text-center align-items-center'>
                                                    <FaInstagram />
                                                </div>
                                            </div>
                                            <div className='d-flex'>
                                                <div className='icon text-center align-items-center'>
                                                    <FaWhatsapp />
                                                </div>
                                                <div className='icon text-center align-items-center'>
                                                    <IoCallOutline />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='footerLogo text-center align-items-center me-auto'>
                                        <img src={logo} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>*/}
        </>
    );
}
 
export default Footer;