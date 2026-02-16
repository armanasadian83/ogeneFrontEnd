import imgOne from "./../../assets/serviceSectionImgs/imgOne.png"
import imgTwo from "./../../assets/serviceSectionImgs/imgTwo.png"
import imgThree from "./../../assets/serviceSectionImgs/imgThree.png"
import imgFour from "./../../assets/serviceSectionImgs/imgFour.png"
import imgFive from "./../../assets/serviceSectionImgs/imgFive.png"
import imgSix from "./../../assets/serviceSectionImgs/imgSix.png"
import { Link } from "react-router-dom"

const ServiceSection = () => {
    return (
        <>

        <div className="container serviceSection">
            <div className='text-center title'>
                <h2>ما در چه حوزه هایی فعالیت می کنیم؟</h2>
            </div>

            <div className="row mt-4">
                <div className="col-12 col-md-6">
                    <Link to='/field/I'>
                        <div class="overlap-container">
                            <div class="bottom-div"></div>
                            <div class="top-div text-center">
                                <img src={imgTwo} className="imgLine1" />
                                <div className="text-center">سلولی، مولکولی و ژنتیک</div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-12 col-md-6">
                    <Link to='/field/II'>
                        <div class="overlap-container">
                            <div class="bottom-div"></div>
                                <div class="top-div text-center">
                                    <img src={imgFive} className="imgLine2" />
                                <div className="text-center">میکروبیولوژی</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-6">
                    <Link to='/field/III'>
                        <div class="overlap-container">
                            <div class="bottom-div"></div>
                            <div class="top-div text-center">
                                <img src={imgThree} className="imgLine1" />
                                <div className="text-center">نانوفناوری</div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-12 col-md-6">
                    <Link to='/field/IV'>
                        <div class="overlap-container">
                            <div class="bottom-div"></div>
                                <div class="top-div text-center">
                                    <img src={imgFour} className="imgLine3" />
                                <div className="text-center">خدمات عمومی</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-6">
                    <Link to='/field/V'>
                        <div class="overlap-container">
                            <div class="bottom-div"></div>
                            <div class="top-div text-center">
                                <img src={imgOne} className="imgLine1" />
                                <div className="text-center">زیست پزشکی</div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-12 col-md-6">
                    <Link to='/field/VI'>
                        <div class="overlap-container">
                            <div class="bottom-div"></div>
                                <div class="top-div text-center">
                                    <img src={imgSix} className="imgLine2" />
                                <div className="text-center">بالینی و مدل حیوانی/هیستولوژی</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            
        </div>
        {/*<div className='servicesSection'>
                <div className='text-center title'>
                    <h2>خدمات آموزشگاه تکوین</h2>
                    <p>خدمات در زمینه های مهندسی ژنتیک پزشکی، ژنتیک مولکولی، کشت سلول، بیوانفورماتیک ، پایان نامه و مقاله نویسی</p>
                </div>

                <div class="overlap-group">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-13">بیوانفورماتیک</div>
                    <div class="group-2"></div>
                </div>

                <div class="overlap-2">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-13">بیوانفورماتیک</div>
                    <div class="group-3"></div>
                </div>

                <div class="overlap-3">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-13">بیوانفورماتیک</div>
                    <div class="group-3"></div>
                </div>

                <div class="overlap-5">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-15">خدمات ژنتیک مولکولی</div>
                    <div class="group-5"></div>
                </div>

                <div class="overlap-6">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-15">خدمات ژنتیک مولکولی</div>
                    <div class="group-5"></div>
                </div>

                <div class="overlap-7">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-15">خدمات ژنتیک مولکولی</div>
                    <div class="group-6"></div>
                </div>

                <div class="overlap-9">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-17">خدمات سیتوژنتیک</div>
                    <div class="group-8"></div>
                </div>

                <div class="overlap-10">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-17">خدمات سیتوژنتیک</div>
                    <div class="group-9"></div>
                </div>

                <div class="overlap-11">
                    <div class="group">
                        <div class="overlap-group-2">
                            <div class="rectangle"></div>
                            <div class="rectangle-2"></div>
                        </div>
                    </div>
                    <div class="text-wrapper-17">خدمات سیتوژنتیک</div>
                    <div class="group-8"></div>
                </div>
            </div>*/}
        </>
    );
}
 
export default ServiceSection;