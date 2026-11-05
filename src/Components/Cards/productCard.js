import { useLanguage } from "../../i18n/LanguageContext";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const ProductCard = (props) => {
    const { t, localize, formatNumber } = useLanguage();
    const price = props?.item?.price === '' ? '' : formatNumber(props?.item?.price);
    const oldPrice = props?.item?.oldPrice === '' ? '' : formatNumber(props?.item?.oldPrice);

    const discountPercent = props?.item?.oldPrice && props?.item?.price
        ? Math.round(100 - (Number(props.item.price) / Number(props.item.oldPrice)) * 100)
        : null;

    return (
        <div className="courseCard productCardWrapper">
            <div className="courseImgWrapper">
                <img src={props?.item?.images[0]} alt={localize(props?.item, "name")} />
                {discountPercent > 0 && (
                    <span className="productDiscountBadge">{t("٪{percent} تخفیف", "{percent}% off", { percent: formatNumber(discountPercent) })}</span>
                )}
            </div>

            <div className="courseCardBody">
                <p className="courseTitle">{localize(props?.item, "name").substring(0, 41)}</p>

                <div className="productPriceWrapper">
                    {
                        props?.item?.oldPrice ? (
                            <span className="productOldPrice">{oldPrice}{t(" تومان")}</span>
                        ) : (
                            <span className="productStock">{props?.item?.countInStock}{t(" عدد موجود")}</span>
                        )
                    }
                    <span className="productPrice">{price}{t(" تومان")}</span>
                </div>

                <Link to={`/product/${props?.item?.id}`} className="courseCardLink">
                    <Button className="courseCardBtn">{t("مشاهده جزئیات محصول")}<IoArrowBackOutline className="courseCardBtnIcon" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default ProductCard;
