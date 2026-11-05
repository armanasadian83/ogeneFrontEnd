import { useLanguage } from "../../i18n/LanguageContext";
import CalenderHomeImg from "./../../assets/calenderSectionHomeImg.png"
import Button from '@mui/material/Button';

const CalenderSection = () => {
    const { t, dir } = useLanguage();
    return (
        <>
        <div className="calenderSectionHome" dir={dir}>

            <div className='text-center title'>
                <h2>{t("تقویم آموزشی", "Training calendar")}</h2>
                <p>{t("تقویم آموزشی مهر ماه 1404", "Training calendar for Mehr 1404")}</p>
            </div>

            <div className="container">
                <div className="overlap-container">
                    <div className="bottom-div"></div>
                    <div className="top-div">
                        <div className="row">
                            <div className="text-center imgWrapperMobile">
                                <img src={CalenderHomeImg} alt={t("تصویر تقویم آموزشی", "Training calendar illustration")} />
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="calenderPWrapper">
                                    <p>
                                        <span>{t("02 مرداد ", "02 Mordad ")}</span> &nbsp;&nbsp;   {t("دوره اصول و مفاهیم انواع PCR", "PCR principles and concepts")}<br />
                                        <span>{t("04 مرداد ", "04 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه تشخیص هویت", "Identity testing workshop")}  <br />
                                        <span>{t("04 مرداد ", "04 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه کاربری دستگاه الایزا-ELISA", "ELISA instrument operation workshop")}<br />
                                        <span>{t("04 مرداد ", "04 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع مولکولی", "Comprehensive molecular biology course")}<br />
                                        <div className="blurInMobileOne">
                                            <span>{t("04 مرداد ", "04 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع آزمایشگاه ژنتیک", "Comprehensive genetics laboratory course")} <br />
                                        </div>
                                        <div className="blurInMobileTwo">
                                            <span>{t("05 مرداد ", "05 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع مولکولی", "Comprehensive molecular biology course")}<br />
                                        </div>
                                            <div className="mobileDisplayNone">
                                                <span>{t("05 مرداد ", "05 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع آموزش صفر تا صد مهاجرت تحصیلی", "Complete guide to studying abroad")}<br />
                                                <span>{t("06 مرداد ", "06 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره تکنسین آزمایشگاه (کاریوتایپ)", "Laboratory technician course (karyotyping)")}<br />
                                                <span>{t("08 مرداد ", "08 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع مهندسی ژنتیک (کلونینگ)", "Comprehensive genetic engineering course (cloning)")}<br />
                                                <span>{t("08 مرداد ", "08 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره پرینتر‌های سه بعدی و بایوپرینترها", "3D printing and bioprinting course")}<br />
                                                <span>{t("10 مرداد ", "10 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه تکثیر حیوانات آزمایشگاهی", "Laboratory animal breeding workshop")}<br />
                                                <span>{t("11 مرداد ", "11 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع کارآموزی در آزمایشگاه", "Comprehensive laboratory internship course")}<br />
                                                <span>{t("11 مرداد ", "11 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره کشت سلول گیاهی و بیوتکنولوژی گیاهی", "Plant cell culture and biotechnology course")}<br />
                                                <span>{t("11 مرداد ", "11 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره مقدماتی برنامه نویسی پایتون", "Introductory Python programming course")}<br />
                                                <span>{t("11 مرداد ", "11 Mordad ")}</span>&nbsp;&nbsp;    {t("دوره جامع سنتز نانوذرات و نانوتکنولوژی", "Comprehensive nanoparticle synthesis and nanotechnology course")}<br />
                                                <span>{t("11 مرداد ", "11 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره کاربری میکروب شناسی آزمایشگاه (میکروبیولوژی)", "Applied laboratory microbiology course")} <br />
                                                <span>{t("11 مرداد ", "11 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره آموزشی کنترل کیفی در آزمایشگاه‌های تشخیص پزشکی", "Quality control in medical diagnostic laboratories")}<br />
                                                <span>{t("12 مرداد ", "12 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره آنالیز داده های NGS", "NGS data analysis course")}<br />
                                                <span>{t("13 مرداد ", "13 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع مولکولی", "Comprehensive molecular biology course")} <br />
                                                <span>{t("15 مرداد ", "15 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه SDS-page و وسترن بلات", "SDS-PAGE and western blotting workshop")} <br />
                                                <span>{t("16 مرداد ", "16 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره مقدماتی بیوانفورماتیک", "Introductory bioinformatics course")}<br />
                                                <span>{t("17 مرداد ", "17 Mordad ")}</span>&nbsp;&nbsp;    {t("دوره جامع کشت سلول (رده سلول‌های سرطانی و بنیادی)", "Comprehensive cell culture course (cancer and stem cell lines)")}<br />
                                                <span>{t("17 مرداد ", "17 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره آنالیز کروموزوم های انسانی (مقدماتی)", "Introductory human chromosome analysis course")}<br />
                                                <span>{t("17 مرداد ", "17 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه سیستم‌های میکروفلوئیدیک", "Microfluidic systems workshop")}<br />
                                                <span>{t("18 مرداد ", "18 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع فلوسایتومتری", "Comprehensive flow cytometry course")}<br />
                                                <span>{t("18 مرداد ", "18 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه مقدماتی آنالز داده های زیستی", "Introductory biological data analysis workshop")}<br />
                                                <span>{t("18 مرداد ", "18 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه جامع آنالیز های طیف سنجی و غیر طیف سنجی", "Comprehensive spectroscopic and non-spectroscopic analysis workshop")}<br />
                                                <span>{t("19 مرداد ", "19 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه پروتئومیکس", "Proteomics workshop")}<br />
                                                <span>{t("19 مرداد ", "19 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه طراحی پرایمر Real Time PCR", "Real-time PCR primer design workshop")}<br />
                                                <span>{t("19 مرداد ", "19 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه تحلیل آزمایشات علوم زیستی با نرم افزار minitab", "Life-science experiment analysis with Minitab")}<br />
                                                <span>{t("20 مرداد ", "20 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه جامع ساخت هیدروژل ها", "Comprehensive hydrogel fabrication workshop")}<br />
                                                <span>{t("22 مرداد ", "22 Mordad ")}</span>&nbsp;&nbsp;   {t("تور پژوهشی تحقیقاتی اوژن", "Ogene research tour")}<br />
                                                <span>{t("23 مرداد ", "23 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه معرفی کریسپر", "Introduction to CRISPR workshop")}<br />
                                                <span>{t("24 مرداد ", "24 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره جامع مهندسی بافت و الکتروریسی", "Comprehensive tissue engineering and electrospinning course")}<br />
                                                <span>{t("24 مرداد ", "24 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه جامع زیست سازگاری و آزمون‌های بیولوژیک", "Comprehensive biocompatibility and biological testing workshop")}<br />
                                                <span>{t("24 مرداد ", "24 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه مهندسی حامل‌های دارورسان", "Drug-delivery carrier engineering workshop")}<br />
                                                <span>{t("24 مرداد ", "24 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه نرم افزار های میکروبی", "Microbiology software workshop")}<br />
                                                <span>{t("25 مرداد ", "25 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه تهیه و تدوین پروپوزال و پایان نامه نویسی", "Research proposal and thesis writing workshop")}<br />
                                                <span>{t("25 مرداد ", "25 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه جامع صفر تا صد مقاله نویسی", "Complete scientific paper writing workshop")} <br />
                                                <span>{t("26 مرداد ", "26 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه کاربری دستگاه Real Time PCR", "Real-time PCR instrument operation workshop")}<br />
                                                <span>{t("27 مرداد ", "27 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه کروماتوگرافی مایع با کارایی بالا -HPLC", "High-performance liquid chromatography workshop (HPLC)")}<br />
                                                <span>{t("27 مرداد ", "27 Mordad ")}</span>&nbsp;&nbsp;   {t("دوره پیشرفته بیوانفورماتیک", "Advanced bioinformatics course")} <br />
                                                <span>{t("28 مرداد ", "28 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه نرم افزار‌های میکروبی", "Microbiology software workshop")} <br />
                                                <span>{t("30 مرداد ", "30 Mordad ")}</span>&nbsp;&nbsp;   {t("کارگاه پیشرفته آنالیز داده‌های زیستی", "Advanced biological data analysis workshop")} <br />
                                            </div>
                                    </p>
                                </div>
                                <div className="text-center seeFullCalender">
                                    <Button>{t("مشاهده کامل تقویم", "View full calendar")}</Button>
                                </div>
                            </div>
                            <div className="col-6 text-center">
                                <div className="imgWrapper text-center">
                                    <img src={CalenderHomeImg} alt={t("تصویر تقویم آموزشی", "Training calendar illustration")} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/*<div className='CalenderSection'>
                <div className='text-center title'>
                    <h2>تقویم آموزشی</h2>
                    <p>تقویم آموزشی مرداد ماه 1404</p>
                </div>

                <div class="overlap-30">
                    <div class="div-wrapper">
                        <div class="overlap-31">
                            <div class="rectangle-11"></div>
                            <div class="rectangle-12"></div>
                        </div>
                    </div>
                    <div class="online-calendar-bro-wrapper">
                        <div class="online-calendar-bro">
                            <div class="overlap-group-3">
                                <img
                                    class="freepik-background"
                                    src="https://c.animaapp.com/NMpalZkr/img/freepik--background-simple--inject-12@2x.png"
                                />
                                <div class="freepik-graphics">
                                    <img class="group-12" src="https://c.animaapp.com/NMpalZkr/img/group@2x.png" />
                                    <img class="group-13" src="https://c.animaapp.com/NMpalZkr/img/group-1@2x.png" />
                                </div>
                                <div class="freepik-clock-inject">
                                  <img class="group-14" src="https://c.animaapp.com/NMpalZkr/img/group-2@2x.png" />
                                </div>
                                <img
                                  class="freepik-airplane"
                                  src="https://c.animaapp.com/NMpalZkr/img/freepik--airplane--inject-12@2x.png"
                                />
                                <img
                                  class="freepik-plants"
                                  src="https://c.animaapp.com/NMpalZkr/img/freepik--plants--inject-12@2x.png"
                                />
                                <img
                                  class="freepik-calendar"
                                  src="https://c.animaapp.com/NMpalZkr/img/freepik--calendar--inject-12@2x.png"
                                />
                                <img
                                  class="freepik-floor-inject"
                                  src="https://c.animaapp.com/NMpalZkr/img/freepik--floor--inject-12@2x.png"
                                />
                                <img
                                  class="freepik-character"
                                  src="https://c.animaapp.com/NMpalZkr/img/freepik--character-2--inject-12@2x.png"
                                />
                                <img
                                  class="freepik-character-2"
                                  src="https://c.animaapp.com/NMpalZkr/img/freepik--character-1--inject-12@2x.png"
                                />
                
                            </div>
                        </div>
                    </div>
                </div>


                <p class="element-PCR-ELISA">
                    02 مرداد &nbsp;&nbsp;   دوره اصول و مفاهیم انواع PCR<br />
                    04 مرداد &nbsp;&nbsp;   کارگاه تشخیص هویت  <br />
                    04 مرداد &nbsp;&nbsp;   کارگاه کاربری دستگاه الایزا-ELISA<br />
                    04 مرداد &nbsp;&nbsp;   دوره جامع مولکولی<br />
                    04 مرداد &nbsp;&nbsp;   دوره جامع آزمایشگاه ژنتیک <br />
                    05 مرداد &nbsp;&nbsp;   دوره جامع مولکولی<br />
                    05 مرداد &nbsp;&nbsp;   دوره جامع آموزش صفر تا صد مهاجرت تحصیلی<br />
                    06 مرداد &nbsp;&nbsp;   دوره تکنسین آزمایشگاه (کاریوتایپ)<br />
                    08 مرداد &nbsp;&nbsp;   دوره جامع مهندسی ژنتیک (کلونینگ)<br />
                    08 مرداد &nbsp;&nbsp;   دوره پرینتر‌های سه بعدی و بایوپرینترها<br />
                    10 مرداد &nbsp;&nbsp;   کارگاه تکثیر حیوانات آزمایشگاهی<br />
                    11 مرداد &nbsp;&nbsp;   دوره جامع کارآموزی در آزمایشگاه<br />
                    11 مرداد &nbsp;&nbsp;   دوره کشت سلول گیاهی و بیوتکنولوژی گیاهی<br />
                    11 مرداد &nbsp;&nbsp;   دوره مقدماتی برنامه نویسی پایتون<br />
                    11 مرداد &nbsp;&nbsp;    دوره جامع سنتز نانوذرات و نانوتکنولوژی<br />
                    11 مرداد &nbsp;&nbsp;   دوره کاربری میکروب شناسی آزمایشگاه (میکروبیولوژی) <br />
                    11 مرداد &nbsp;&nbsp;   دوره آموزشی کنترل کیفی، استانداردسازی و مستند سازی در آزمایشگاه‌های تشخیص پزشکی<br />
                    12 مرداد &nbsp;&nbsp;   دوره آنالیز داده های NGS<br />
                    13 مرداد &nbsp;&nbsp;   دوره جامع مولکولی <br />
                    15 مرداد &nbsp;&nbsp;   کارگاه SDS-page و وسترن بلات <br />
                    16 مرداد &nbsp;&nbsp;   دوره مقدماتی بیوانفورماتیک<br />
                    17 مرداد &nbsp;&nbsp;    دوره جامع کشت سلول (رده سلول‌های سرطانی و بنیادی)<br />
                    17 مرداد &nbsp;&nbsp;   دوره آنالیز کروموزوم های انسانی (مقدماتی)<br />
                    17 مرداد &nbsp;&nbsp;   کارگاه سیستم‌های میکروفلوئیدیک<br />
                    18 مرداد &nbsp;&nbsp;   دوره جامع فلوسایتومتری<br />
                    18 مرداد &nbsp;&nbsp;   کارگاه مقدماتی آنالز داده های زیستی<br />
                    18 مرداد &nbsp;&nbsp;   کارگاه جامع آنالیز های طیف سنجی و غیر طیف سنجی<br />
                    19 مرداد &nbsp;&nbsp;   کارگاه پروتئومیکس<br />
                    19 مرداد &nbsp;&nbsp;   کارگاه طراحی پرایمر Real Time PCR<br />
                    19 مرداد &nbsp;&nbsp;   کارگاه تحلیل آزمایشات علوم زیستی با نرم افزار minitab<br />
                    20 مرداد &nbsp;&nbsp;   کارگاه جامع ساخت هیدروژل ها<br />
                    22 مرداد &nbsp;&nbsp;   تور پژوهشی تحقیقاتی اوژن (مقاله نویسی، پروپوزال نویسی و پایان نامه نویسی)<br />
                    23 مرداد &nbsp;&nbsp;   کارگاه معرفی کریسپر<br />
                    24 مرداد &nbsp;&nbsp;   دوره جامع مهندسی بافت و الکتروریسی<br />
                    24 مرداد &nbsp;&nbsp;   کارگاه جامع زیست سازگاری و آزمون‌های بیولوژیک<br />
                    24 مرداد &nbsp;&nbsp;   کارگاه مهندسی حامل‌های دارورسان<br />
                    24 مرداد &nbsp;&nbsp;   کارگاه نرم افزار های میکروبی<br />
                    25 مرداد &nbsp;&nbsp;   کارگاه تهیه و تدوین پروپوزال و پایان نامه نویسی<br />
                    25 مرداد &nbsp;&nbsp;   کارگاه جامع صفر تا صد مقاله نویسی <br />
                    26 مرداد &nbsp;&nbsp;   کارگاه کاربری دستگاه Real Time PCR<br />
                    27 مرداد &nbsp;&nbsp;   کارگاه کروماتوگرافی مایع با کارایی بالا -HPLC<br />
                    27 مرداد &nbsp;&nbsp;   دوره پیشرفته بیوانفورماتیک <br />
                    28 مرداد &nbsp;&nbsp;   کارگاه نرم افزار‌های میکروبی <br />
                    30 مرداد &nbsp;&nbsp;   کارگاه پیشرفته آنالیز داده‌های زیستی <br />
                </p>
            </div>*/}
        </>
    );
}
 
export default CalenderSection;