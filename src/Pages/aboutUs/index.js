import { Link } from "react-router-dom";
import MainBanner from "./../../assets/aboutUsPage/main.png";
import SecondImg from "./../../assets/aboutUsPage/second.png";
import Map from "./../../assets/aboutUsPage//map.png";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";

const content = {
    fa: {
        home: "خانه",
        aboutUs: "درباره ما",
        title: "درباره اوژن",
        subtitle: "آموزشگاه نانوزیست فناوری اوژن",
        intro:
            "با هدف برگزاری دوره ها و کارگاه های آموزشی، انجام خدمات آزمایشگاهی و پژوهشی از جمله تعریف، تعیین و هدایت پایان نامه و پروژه های کارشناسی ارشد و دکتری در رشته ژنتیک پزشکی و مولکولی، نانوفناوری، میکروبیولوژی، بیوتکنولوژی، مهندسی بافت، بیوانفورماتیک و سایر رشته های مرتبط تاسیس شده است.",
        whyTitle: "چرا آموزشگاه نانوزیست فناوری اوژن",
        whyP1:
            "اولین اولویت ما این است که اطمینان حاصل کنیم که بالاترین کیفیت را هم در بخش آزمایشگاهی و عملی و هم در بخش تئوری و کلاس های مجازی به کارآموزان و همکاران محترم ارائه دهیم و امید است با توکل بر خدا و همراهی شما گرامیان به این امر مهم دست یابیم.",
        whyP2:
            "اما فراتر از یک آموزشگاه، ما میخواهیم شاهد موفقیت دوستداران در رشته ژنتیک پزشکی و مولوکی باشیم. ما با همکاری کارآموزان، دانشجویان و اساتید گرامی سعی می کنیم تا نقاط ضعف و قوت آموزشگاه خود را بیابیم و سپس با توصیه ها و راهنمایی های متخصصین نقاط ضعف خود را تقویت کنیم.",
        contactTitle: "تماس با اوژن",
        address:
            "آدرس: تهران، صادقیه، بلوار فردوس شرق، انتهای خیابان ولیعصر، جنب متروی صادقیه، خیابان رز غربی، پلاک 7، طبقه همکف",
        phones: "شماره های تماس : 09120169816 - 09050168316 - 02144961487",
        email: "ایمیل : ogenetech@gmail.com",
        toggleLabel: "English",
    },
    en: {
        home: "Home",
        aboutUs: "About Us",
        title: "About Ogene",
        subtitle: "Ogene Nano-Biotechnology Institute",
        intro:
            "Established to hold educational courses and workshops, and to provide laboratory and research services, including defining, determining, and supervising master's and doctoral theses and projects in medical and molecular genetics, nanotechnology, microbiology, biotechnology, tissue engineering, bioinformatics, and other related fields.",
        whyTitle: "Why Ogene Nano-Biotechnology Institute",
        whyP1:
            "Our first priority is to ensure we deliver the highest quality in both the laboratory/practical side and the theoretical/virtual class side to our trainees and colleagues, and we hope to achieve this, with trust in God and your support.",
        whyP2:
            "But beyond being an institute, we want to witness the success of those passionate about medical and molecular genetics. Together with our trainees, students, and esteemed professors, we work to identify our strengths and weaknesses, then strengthen those weaknesses with expert advice and guidance.",
        contactTitle: "Contact Ogen",
        address:
            "Address: Tehran, Sadeghieh, Ferdows Sharq Blvd, end of Valiasr St., next to Sadeghieh Metro Station, Rose West St., No. 7, Ground Floor",
        phones: "Phone Numbers: 09120169816 - 09050168316 - 02144961487",
        email: "Email: ogenetech@gmail.com",
        toggleLabel: "فارسی",
    },
};

const AboutUs = () => {
    const [lang, setLang] = useState("fa");
    const t = content[lang];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(true);
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

    const toggleLang = () => {
        setLang((prev) => (prev === "fa" ? "en" : "fa"));
    };

    return (
        <>
            <div className="aboutUsSection container" dir={lang === "fa" ? "rtl" : "ltr"}>
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <p className="mb-1 me-4 me-lg-0 breadCrumb">
                        <Link to="/"><b>{t.home}</b></Link> /
                        <Link to="/aboutUs"><b> {t.aboutUs}</b></Link>
                    </p>
                    <div className="changeLangBtn">
                        {
                            lang === 'fa' ? <span onClick={toggleLang}>English</span> : <span onClick={toggleLang}>فارسی</span>
                        }
                    </div>
                </div>

                <div className="text-center secOne mt-4">
                    <h1>{t.title}</h1>
                    <h3>{t.subtitle}</h3>
                    <img src={MainBanner} />

                    <p>{t.intro}</p>
                </div>

                <div className="row secTwo">
                    <div className="col-12 col-md-6"> 
                        <h1>{t.whyTitle}</h1>
                        <p>{t.whyP1}</p>
                        <p>{t.whyP2}</p>
                    </div>
                    <div className="col-12 col-md-6">
                        <img src={SecondImg} />
                    </div>
                </div>

                <div className="text-center secThree">
                    <h1>{t.contactTitle}</h1>
                </div>
                <div className="row secThree">
                    <div className="col-12 col-md-6">
                        <img src={Map} />
                        <p className="address">{t.address}</p>
                    </div>
                    <div className="col-12 col-md-6">
                        <p>{t.phones}</p>
                        <p>{t.email}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AboutUs;