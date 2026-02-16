import CalenderHomeImg from "./../../assets/calenderSectionHomeImg.png"
import Button from '@mui/material/Button';

const CalenderSection = () => {
    return (
        <>
        <div className="calenderSectionHome">

            <div className='text-center title'>
                <h2>تقویم آموزشی</h2>
                <p>تقویم آموزشی مهر ماه 1404</p>
            </div>

            <div className="container">
                <div class="overlap-container">
                    <div class="bottom-div"></div>
                    <div class="top-div">
                        <div className="row">
                            <div className="text-center imgWrapperMobile">
                                <img src={CalenderHomeImg} />
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="calenderPWrapper">
                                    <p>
                                        <span>02 مرداد </span> &nbsp;&nbsp;   دوره اصول و مفاهیم انواع PCR<br />
                                        <span>04 مرداد </span>&nbsp;&nbsp;   کارگاه تشخیص هویت  <br />
                                        <span>04 مرداد </span>&nbsp;&nbsp;   کارگاه کاربری دستگاه الایزا-ELISA<br />
                                        <span>04 مرداد </span>&nbsp;&nbsp;   دوره جامع مولکولی<br />
                                        <div className="blurInMobileOne">
                                            <span>04 مرداد </span>&nbsp;&nbsp;   دوره جامع آزمایشگاه ژنتیک <br />
                                        </div>
                                        <div className="blurInMobileTwo">
                                            <span>05 مرداد </span>&nbsp;&nbsp;   دوره جامع مولکولی<br />
                                        </div>
                                            <div className="mobileDisplayNone">
                                                <span>05 مرداد </span>&nbsp;&nbsp;   دوره جامع آموزش صفر تا صد مهاجرت تحصیلی<br />
                                                <span>06 مرداد </span>&nbsp;&nbsp;   دوره تکنسین آزمایشگاه (کاریوتایپ)<br />
                                                <span>08 مرداد </span>&nbsp;&nbsp;   دوره جامع مهندسی ژنتیک (کلونینگ)<br />
                                                <span>08 مرداد </span>&nbsp;&nbsp;   دوره پرینتر‌های سه بعدی و بایوپرینترها<br />
                                                <span>10 مرداد </span>&nbsp;&nbsp;   کارگاه تکثیر حیوانات آزمایشگاهی<br />
                                                <span>11 مرداد </span>&nbsp;&nbsp;   دوره جامع کارآموزی در آزمایشگاه<br />
                                                <span>11 مرداد </span>&nbsp;&nbsp;   دوره کشت سلول گیاهی و بیوتکنولوژی گیاهی<br />
                                                <span>11 مرداد </span>&nbsp;&nbsp;   دوره مقدماتی برنامه نویسی پایتون<br />
                                                <span>11 مرداد </span>&nbsp;&nbsp;    دوره جامع سنتز نانوذرات و نانوتکنولوژی<br />
                                                <span>11 مرداد </span>&nbsp;&nbsp;   دوره کاربری میکروب شناسی آزمایشگاه (میکروبیولوژی) <br />
                                                <span>11 مرداد </span>&nbsp;&nbsp;   دوره آموزشی کنترل کیفی در آزمایشگاه‌های تشخیص پزشکی<br />
                                                <span>12 مرداد </span>&nbsp;&nbsp;   دوره آنالیز داده های NGS<br />
                                                <span>13 مرداد </span>&nbsp;&nbsp;   دوره جامع مولکولی <br />
                                                <span>15 مرداد </span>&nbsp;&nbsp;   کارگاه SDS-page و وسترن بلات <br />
                                                <span>16 مرداد </span>&nbsp;&nbsp;   دوره مقدماتی بیوانفورماتیک<br />
                                                <span>17 مرداد </span>&nbsp;&nbsp;    دوره جامع کشت سلول (رده سلول‌های سرطانی و بنیادی)<br />
                                                <span>17 مرداد </span>&nbsp;&nbsp;   دوره آنالیز کروموزوم های انسانی (مقدماتی)<br />
                                                <span>17 مرداد </span>&nbsp;&nbsp;   کارگاه سیستم‌های میکروفلوئیدیک<br />
                                                <span>18 مرداد </span>&nbsp;&nbsp;   دوره جامع فلوسایتومتری<br />
                                                <span>18 مرداد </span>&nbsp;&nbsp;   کارگاه مقدماتی آنالز داده های زیستی<br />
                                                <span>18 مرداد </span>&nbsp;&nbsp;   کارگاه جامع آنالیز های طیف سنجی و غیر طیف سنجی<br />
                                                <span>19 مرداد </span>&nbsp;&nbsp;   کارگاه پروتئومیکس<br />
                                                <span>19 مرداد </span>&nbsp;&nbsp;   کارگاه طراحی پرایمر Real Time PCR<br />
                                                <span>19 مرداد </span>&nbsp;&nbsp;   کارگاه تحلیل آزمایشات علوم زیستی با نرم افزار minitab<br />
                                                <span>20 مرداد </span>&nbsp;&nbsp;   کارگاه جامع ساخت هیدروژل ها<br />
                                                <span>22 مرداد </span>&nbsp;&nbsp;   تور پژوهشی تحقیقاتی اوژن<br />
                                                <span>23 مرداد </span>&nbsp;&nbsp;   کارگاه معرفی کریسپر<br />
                                                <span>24 مرداد </span>&nbsp;&nbsp;   دوره جامع مهندسی بافت و الکتروریسی<br />
                                                <span>24 مرداد </span>&nbsp;&nbsp;   کارگاه جامع زیست سازگاری و آزمون‌های بیولوژیک<br />
                                                <span>24 مرداد </span>&nbsp;&nbsp;   کارگاه مهندسی حامل‌های دارورسان<br />
                                                <span>24 مرداد </span>&nbsp;&nbsp;   کارگاه نرم افزار های میکروبی<br />
                                                <span>25 مرداد </span>&nbsp;&nbsp;   کارگاه تهیه و تدوین پروپوزال و پایان نامه نویسی<br />
                                                <span>25 مرداد </span>&nbsp;&nbsp;   کارگاه جامع صفر تا صد مقاله نویسی <br />
                                                <span>26 مرداد </span>&nbsp;&nbsp;   کارگاه کاربری دستگاه Real Time PCR<br />
                                                <span>27 مرداد </span>&nbsp;&nbsp;   کارگاه کروماتوگرافی مایع با کارایی بالا -HPLC<br />
                                                <span>27 مرداد </span>&nbsp;&nbsp;   دوره پیشرفته بیوانفورماتیک <br />
                                                <span>28 مرداد </span>&nbsp;&nbsp;   کارگاه نرم افزار‌های میکروبی <br />
                                                <span>30 مرداد </span>&nbsp;&nbsp;   کارگاه پیشرفته آنالیز داده‌های زیستی <br />
                                            </div>
                                    </p>
                                </div>
                                <div className="text-center seeFullCalender">
                                    <Button>مشاهده کامل تقویم</Button>
                                </div>
                            </div>
                            <div className="col-6 text-center">
                                <div className="imgWrapper text-center">
                                    <img src={CalenderHomeImg} />
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