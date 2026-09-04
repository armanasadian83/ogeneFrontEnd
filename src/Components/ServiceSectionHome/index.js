import imgOne from "./../../assets/serviceSectionImgs/imgOne.png"
import imgTwo from "./../../assets/serviceSectionImgs/imgTwo.png"
import imgThree from "./../../assets/serviceSectionImgs/imgThree.png"
import imgFour from "./../../assets/serviceSectionImgs/imgFour.png"
import imgFive from "./../../assets/serviceSectionImgs/imgFive.png"
import imgSix from "./../../assets/serviceSectionImgs/imgSix.png"
import { Link } from "react-router-dom"
import { IoArrowBackOutline } from "react-icons/io5"

const serviceItems = [
    { id: 'I', img: imgTwo, imgClass: 'imgLine1', title: 'سلولی، مولکولی و ژنتیک' },
    { id: 'II', img: imgFive, imgClass: 'imgLine2', title: 'میکروبیولوژی' },
    { id: 'III', img: imgThree, imgClass: 'imgLine1', title: 'نانوفناوری' },
    { id: 'IV', img: imgFour, imgClass: 'imgLine3', title: 'خدمات عمومی' },
    { id: 'V', img: imgOne, imgClass: 'imgLine1', title: 'زیست پزشکی و گیاهی' },
    { id: 'VI', img: imgSix, imgClass: 'imgLine2', title: 'بالینی و مدل حیوانی/هیستولوژی' },
];

const ServiceSection = () => {
    return (
        <>
            <div className="container serviceSection">
                <div className="text-center title">
                    <span className="titleTag">حوزه‌های فعالیت</span>
                    <h2>ما در چه حوزه‌هایی فعالیت می‌کنیم؟</h2>
                </div>

                <div className="row mt-4 serviceGrid">
                    {serviceItems.map((item) => (
                        <div className="col-12 col-md-6 item" key={item.id}>
                            <Link to={`/field/${item.id}`}>
                                <div className="overlap-container">
                                    <div className="bottom-div"></div>
                                    <div className="top-div text-center">
                                        <div className="imgWrapperService">
                                            <img src={item.img} className={item.imgClass} />
                                        </div>
                                        <div className="serviceCardFooter">
                                            <div className="serviceCardTitle">{item.title}</div>
                                            <span className="serviceCardArrow">
                                                <IoArrowBackOutline />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ServiceSection;