
const CoursesInformative = () => {
    return (
        <>
        <div className="CoursesHomeSection">

            <div className='text-center title'>
                    <h2>دوره های آموزشگاه اوژن (تکوین)</h2>
                    <p>خدمات در زمینه های مهندسی ژنتیک پزشکی، ژنتیک مولکولی، کشت سلول، بیوانفورماتیک ، پایان نامه و مقاله نویسی</p>
            </div>

            <div className="row mt-5 RightSidedContent">
                <div className="col-12">
                    <div class="overlap-container">
                        <div class="bottom-div"></div>
                        <div class="top-div">
                            <div className="infoWrapper">
                                <p>دوره های سلولی و مولکولی</p>

                                <div className="row data">
                                    <div className="col-12 col-md-6">
                                        <p>دوره جامع مولکولی</p>
                                        <p>دوره ارشد آزمایشگر</p>
                                        <p>دوره آنالیز داده های NGS</p>
                                        <p>دوره جامع بیوانفورماتیک</p>
                                        <p>دوره جامع آزمایشگاه ژنتیک</p>
                                        <p>دوره جامع فلوسایتومتری بالینی</p>
                                        <p>دوره کاربری دستگاه فلوسایتومتری</p>
                                    </div>
                                    <div className="col-12 col-md-6 hideInMobile">
                                        <p>دوره آنالیز داده‌های Sanger Sequencing</p>
                                        <p>کارگاه پروتئومیکس</p>
                                        <p>کارگاه طراحی پرایمر</p>
                                        <p>کارگاه داکینگ مولکولی</p>
                                        <p>کارگاه SDS-PAGE و وسترن بلات</p>                                  
                                        <p>کارگاه اصول و مــفاهیم انواع PCR</p>                                  
                                        <p>کارگاه کاربری دستگاه Real time PCR</p>                                  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-5 leftSidedContent" style={{direction : "ltr"}}>
                <div className="col-12">
                    <div class="overlap-container">
                        <div class="bottom-div"></div>
                        <div class="top-div" style={{direction : "rtl"}}>
                            <div className="infoWrapper">
                                <p>دوره های بالینی</p>

                                <div className="row data">
                                    <div className="col-12 col-md-6 hideInMobile">
                                        <p>دوره آنالیز داده‌های Sanger Sequencing</p>
                                        <p>کارگاه پروتئومیکس</p>
                                        <p>کارگاه طراحی پرایمر</p>
                                        <p>کارگاه داکینگ مولکولی</p>
                                        <p>کارگاه SDS-PAGE و وسترن بلات</p>                                  
                                        <p>کارگاه اصول و مــفاهیم انواع PCR</p>                                  
                                        <p>کارگاه کاربری دستگاه Real time PCR</p>                                  
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <p>دوره جامع مولکولی</p>
                                        <p>دوره ارشد آزمایشگر</p>
                                        <p>دوره آنالیز داده های NGS</p>
                                        <p>دوره جامع بیوانفورماتیک</p>
                                        <p>دوره جامع آزمایشگاه ژنتیک</p>
                                        <p>دوره جامع فلوسایتومتری بالینی</p>
                                        <p>دوره کاربری دستگاه فلوسایتومتری</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        {/*<div className='CoursesInformativeSection'>
                <div className='text-center title'>
                    <h2>دوره های آموزشگاه اوژن (تکوین)</h2>
                    <p>خدمات در زمینه های مهندسی ژنتیک پزشکی، ژنتیک مولکولی، کشت سلول، بیوانفورماتیک ، پایان نامه و مقاله نویسی</p>
                </div>

                <div class="overlap-21">
                    <div class="overlap-wrapper">
                        <div class="overlap-22">
                            <div class="rectangle-7"></div>
                            <div class="rectangle-8"></div>
                        </div>
                    </div>
                    <p class="text-wrapper-24">دوره های سلولی و مولکولی</p>
                    <p class="NGS">
                        دوره جامع مولکولی<br />دوره ارشد آزمایشگر<br />دوره آنالیز داده‌های NGS<br />دوره جامع بيوانفورماتیک<br />دوره
                        جامع آزمایشگاه ژنتیک<br />دوره جامع فلوسایتومتری بالینی<br />دوره کاربری دستگاه فلوسایتومتری
                    </p>
                    <p class="sanger-sequencing">
                        دوره آنالیز داده های Sanger Sequencing<br />کارگاه پروتئومیکس<br />کارگاه طراحی پرایمر<br />کارگاه داکینگ
                        مولکولی<br />کارگاه SDS-PAGE و وسترن بلات<br />کارگاه اصول و مــفاهیم انواع PCR<br />کارگاه کاربری دستگاه
                        Real time PCR
                    </p>
                    <p class="sanger-sequencing-2">
                        دوره آنالیز داده های Sanger Sequencing<br />کارگاه پروتئومیکس<br />کارگاه طراحی پرایمر<br />کارگاه داکینگ
                        مولکولی<br />کارگاه SDS-PAGE و وسترن بلات<br />کارگاه اصول و مــفاهیم انواع PCR<br />کارگاه کاربری دستگاه
                        Real time PCR
                    </p>
                </div>

                <div class="overlap-23">
                    <div class="overlap-wrapper">
                        <div class="overlap-22">
                            <div class="rectangle-7"></div>
                            <div class="rectangle-8"></div>
                        </div>
                    </div>
                    <p class="text-wrapper-24">دوره های سلولی و مولکولی</p>
                    <p class="NGS">
                        دوره جامع مولکولی<br />دوره ارشد آزمایشگر<br />دوره آنالیز داده‌های NGS<br />دوره جامع بيوانفورماتیک<br />دوره
                        جامع آزمایشگاه ژنتیک<br />دوره جامع فلوسایتومتری بالینی<br />دوره کاربری دستگاه فلوسایتومتری
                    </p>
                    <p class="sanger-sequencing">
                        دوره آنالیز داده های Sanger Sequencing<br />کارگاه پروتئومیکس<br />کارگاه طراحی پرایمر<br />کارگاه داکینگ
                        مولکولی<br />کارگاه SDS-PAGE و وسترن بلات<br />کارگاه اصول و مــفاهیم انواع PCR<br />کارگاه کاربری دستگاه
                        Real time PCR
                    </p>
                    <p class="sanger-sequencing-2">
                        دوره آنالیز داده های Sanger Sequencing<br />کارگاه پروتئومیکس<br />کارگاه طراحی پرایمر<br />کارگاه داکینگ
                        مولکولی<br />کارگاه SDS-PAGE و وسترن بلات<br />کارگاه اصول و مــفاهیم انواع PCR<br />کارگاه کاربری دستگاه
                        Real time PCR
                    </p>
                </div>

                <div class="overlap-25">
                    <div class="overlap-wrapper">
                        <div class="overlap-22">
                            <div class="rectangle-7"></div>
                            <div class="rectangle-8"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-25">دوره های میکروبیولوژی</div>
                    <p class="sanger-sequencing-3">
                        دوره آنالیز داده های Sanger Sequencing<br />کارگاه پروتئومیکس<br />کارگاه طراحی پرایمر<br />کارگاه داکینگ
                        مولکولی<br />کارگاه SDS-PAGE و وسترن بلات<br />کارگاه اصول و مــفاهیم انواع PCR<br />کارگاه کاربری دستگاه
                        Real time PCR
                    </p>
                    <p class="sanger-sequencing-4">
                        دوره آنالیز داده های Sanger Sequencing<br />کارگاه پروتئومیکس<br />کارگاه طراحی پرایمر<br />کارگاه داکینگ
                        مولکولی<br />کارگاه SDS-PAGE و وسترن بلات<br />کارگاه اصول و مــفاهیم انواع PCR<br />کارگاه کاربری دستگاه
                        Real time PCR
                    </p>
                </div>

                <div class="overlap-26">
                    <div class="overlap-wrapper">
                        <div class="overlap-22">
                            <div class="rectangle-7"></div>
                            <div class="rectangle-8"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-25">دوره های میکروبیولوژی</div>
                    <p class="sanger-sequencing-3">
                        دوره آنالیز داده های Sanger Sequencing<br />کارگاه پروتئومیکس<br />کارگاه طراحی پرایمر<br />کارگاه داکینگ
                        مولکولی<br />کارگاه SDS-PAGE و وسترن بلات<br />کارگاه اصول و مــفاهیم انواع PCR<br />کارگاه کاربری دستگاه
                        Real time PCR
                    </p>
                    <p class="sanger-sequencing-4">
                        دوره آنالیز داده های Sanger Sequencing<br />کارگاه پروتئومیکس<br />کارگاه طراحی پرایمر<br />کارگاه داکینگ
                        مولکولی<br />کارگاه SDS-PAGE و وسترن بلات<br />کارگاه اصول و مــفاهیم انواع PCR<br />کارگاه کاربری دستگاه
                        Real time PCR
                    </p>
                </div>

            </div>*/}
        </>
    );
}
 
export default CoursesInformative;