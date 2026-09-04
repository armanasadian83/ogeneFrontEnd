import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const ProductCard = (props) => {

    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');

    useEffect(() => {
        const formattedPrice = props?.item?.price === '' ? '' : Number(props?.item?.price).toLocaleString();
        const formattedOldPrice = props?.item?.oldPrice === '' ? '' : Number(props?.item?.oldPrice).toLocaleString();
        setPrice(formattedPrice);
        setOldPrice(formattedOldPrice);
    }, []);

    const discountPercent = props?.item?.oldPrice && props?.item?.price
        ? Math.round(100 - (Number(props.item.price) / Number(props.item.oldPrice)) * 100)
        : null;

    return (
        <div className="courseCard productCardWrapper">
            <div className="courseImgWrapper">
                <img src={props?.item?.images[0]} />
                {discountPercent > 0 && (
                    <span className="productDiscountBadge">٪{discountPercent} تخفیف</span>
                )}
            </div>

            <div className="courseCardBody">
                <p className="courseTitle">{props?.item?.name?.substring(0, 41)}</p>

                <div className="productPriceWrapper">
                    {
                        props?.item?.oldPrice ? (
                            <span className="productOldPrice">{oldPrice} تومان</span>
                        ) : (
                            <span className="productStock">{props?.item?.countInStock} عدد موجود</span>
                        )
                    }
                    <span className="productPrice">{price} تومان</span>
                </div>

                <Link to={`/product/${props?.item?.id}`} className="courseCardLink">
                    <Button className="courseCardBtn">
                        مشاهده جزئیات محصول
                        <IoArrowBackOutline className="courseCardBtnIcon" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default ProductCard;