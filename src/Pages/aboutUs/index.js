import { Link } from "react-router-dom";
import MainBanner from "./../../assets/aboutUsPage/main.png";
import SecondImg from "./../../assets/aboutUsPage/second.png";
import Map from "./../../assets/aboutUsPage//map.png";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";

const AboutUs = () => {

    useEffect(() => {
        window.scrollTo(0,0); 
    } ,[]);

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(true); 
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);


    return (
        <>
        <div className="aboutUsSection container">
            <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb ">
                <Link to="/" ><b> خانه </b></Link> /
                <Link to="/aboutUs" ><b> درباره ما</b></Link>
            </p>

            <div className="text-center secOne mt-4">
                <h1>درباره اوژن</h1>
                <h3>آموزشگاه نانوزیست فناوری اوژن</h3>
                <img src={MainBanner} />

                <p >با هدف برگزاری دوره ها و کارگاه های آموزشی، انجام خدمات آزمایشگاهی و پژوهشی از جمله تعریف،
                    تعیین و هدایت پایان نامه و پروژه های کارشناسی ارشد و دکتری در رشته ژنتیک پزشکی و مولکولی، نانوفناوری،
                    میکروبیولوژی، بیوتکنولوژی، مهندسی بافت، بیوانفورماتیک و سایر رشته های مرتبط تاسیس شده است.
                </p>
            </div>
            
            <div className="row secTwo">
                <div className="col-12 col-md-6">
                    <h1>چرا آموزشگاه <br /> نانوزیست فناوری اوژن</h1>
                    <p>اولین اولویت ما این است که اطمینان حاصل کنیم که بالاترین کیفیت را هم در بخش آزمایشگاهی و عملی
                        و هم در بخش تئوری و کلاس های مجازی به کارآموزان و همکاران محترم ارائه دهیم و امید است با توکل بر خدا
                        و همراهی شما گرامیان به این امر مهم دست یابیم.
                    </p>
                    <p>
                        اما فراتر از یک آموزشگاه، ما میخواهیم شاهد موفقیت دوستداران در رشته ژنتیک پزشکی و مولوکی باشیم. ما با
                        همکاری کارآموزان، دانشجویان و اساتید گرامی سعی می کنیم تا نقاط ضعف و قوت آموزشگاه خود را بیابیم و سپس
                        با توصیه ها و راهنمایی های متخصصین نقاط ضعف خود را تقویت کنیم.
                    </p>
                </div>
                <div className="col-12 col-md-6">
                    <img src={SecondImg} />
                </div>
            </div>

            <div className="text-center secThree">
                <h1>تماس با اوژن</h1>
            </div>
            <div className="row secThree">
                <div className="col-12 col-md-6">
                    <img src={Map} />
                    <p className="address">آدرس: هران، صادقیه، بلوار فردوس شرق، انتهای خیابان ولیعصر، جنب متروی صادقیه، خیابان رز غربی، پلاک 7، طبقه همکف</p>
                </div>
                <div className="col-12 col-md-6">
                    <p>شماره های تماس : 09120169816 - 09050168316- 02144961487</p>
                    <p>ایمیل : ogenetech@gmail.com</p>
                </div>
            </div>
        </div>
        </>
    );
}
 
export default AboutUs;