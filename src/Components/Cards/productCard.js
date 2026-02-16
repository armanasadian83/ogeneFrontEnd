import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = (props) => {

    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    
    useEffect(() => {
        const formattedPrice = props?.item?.price === '' ? '' : Number(props?.item?.price).toLocaleString();
        const formattedOldPrice = props?.item?.oldPrice === '' ? '' : Number(props?.item?.oldPrice).toLocaleString();
        setPrice(formattedPrice);
        setOldPrice(formattedOldPrice);
    }, []);
    
 
    return (
        <>
        <div className="productCard"> 
            <div className='item'> 
                <div className="text-center cardInfo">
                    <img src={props?.item?.images[0]} />
                    <p className='mt-3'>{props?.item?.name?.substring(0, 41)}</p>

                    <div className="priceWrapper">
                        {
                            props?.item?.oldPrice ?
                            <>
                                <span className="oldPrice">{oldPrice}&nbsp; تومان</span><br />
                            </> : 
                            <>
                                <span className="oldPrice" style={{textDecoration: 'none'}}>{props?.item?.countInStock}&nbsp;  عدد موجود</span><br />
                            </>
                        }
                        <span className="price">{price}&nbsp; تومان</span>
                    </div>
                </div>
            </div>
            <div className='cardBtn text-center'>
                <Button>
                    <Link to={`/product/${props?.item?.id}`}>مشاهده جزئیات محصول</Link>
                </Button>
            </div>
        </div>
        </>
    );
}
 
export default ProductCard;