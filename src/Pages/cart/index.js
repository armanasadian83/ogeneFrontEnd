import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link, useParams } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import { Button } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import Toman from "./../../assets/toman icon.png";

import { BsFillCartCheckFill } from "react-icons/bs";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import QuantityBox from "../../Components/quantityBox";

const Cart = () => {

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(true); 
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

    //backend : add to cart

    const {id} = useParams();

    const [cartData, setCartData] = useState([]);
    const [productQuantity, setProductQuantity] = useState();
    let [cartFields, setCartFeilds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [changedQuantity, setChangedQuantity] = useState(0);

    const [btnDisabled, setBtnDisabled] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user?.userId === id){
            fetchDataFromApi(`/api/cart?userId=${id}`).then((res) => {
                setCartData(res);
                console.log(res);
        });
        }
    }, []);

    
    const quantity = (val) => {
        setProductQuantity(val);
    }

    const selectedItem = (item, inputVal) => {
        setIsLoading(true);
        setBtnDisabled(true);
        const user = JSON.parse(localStorage.getItem("user"));

        cartFields.productTitle = item?.productTitle;
        cartFields.image = item?.image;
        cartFields.price = item?.price;
        cartFields.quantity = inputVal;
        cartFields.subTotal = parseInt(item?.price * inputVal);
        cartFields.productId = item?.productId;
        cartFields.userId = user?.userId;
        cartFields.typeCourse = item?.typeCourse;

        editData(`/api/cart/${item?._id}`, cartFields).then((res) => {
            setIsLoading(false);

            fetchDataFromApi(`/api/cart?userId=${id}`).then((res) => {
                setCartData(res);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
            })
        })
    }


    const removeItem = (cartId) => {
        setIsLoading(true);
        deleteData(`/api/cart/${cartId}`).then((res) => {
            
            fetchDataFromApi(`/api/cart?userId=${id}`).then((res) => {
                setCartData(res);
                setIsLoading(false);
            })

            context.setAlertBox({
                open: true,
                error: false,
                msg: 'محصول از سبد خرید حذف شد!'
            });

        })
    }


    //

    const sendAlert = () => {
        alert('به زودی امکان ثبت سفارش فراهم میشود!');
    }

    return (
        <>
        <div className="cartPage container">
            <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb ">
                <Link to="/" ><b> خانه </b></Link> /
                <Link to="/cart" ><b>سبد خرید</b></Link> /
                <Link to="" ><b>{`${context.user?.name} ${context.user?.lastName}`}</b></Link>
            </p>

            <div className="row">
                
                <div className="col-12 col-md-9 my-3">
                    <h5>شما <b>{cartData?.length}</b> محصول در سبد خرید خود دارید.</h5>
                    <div className="table-responsive mt-4">
                        <table className="table table-bordered v-align">
                            {cartData?.length !== undefined && cartData?.length !== 0 &&
                            <thead className="thead-dark">
                                <tr>
                                    <th>ردیف</th>
                                    <th style={{width: '300px'}}>محصول/دوره</th>
                                    <th>قیمت</th>
                                    <th>تعداد</th>
                                    <th>قیمت کل</th>
                                    <th>حذف</th>
                                </tr>
                            </thead>
                            }
                            <tbody>
                                {
                                    cartData?.length !== 0 && cartData?.length !== undefined && cartData?.map((item, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>
                                                    <div className="miniBox">
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className="d-flex align-items-center productBox">
                                                            <div className="imgWrapper">
                                                                <div className="img">
                                                                    <img className="w-100" src={item?.image} />
                                                                </div>
                                                            </div>
                                                            <div className="info pl-3">
                                                                <h6>
                                                                    {item?.productTitle?.substr(0, 30) + '...'}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="priceBox">
                                                        {item?.price?.toLocaleString()}
                                                         تومان
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='quantityDrop d-flex align-items-center justify-content-center'>
                                                        {
                                                            item?.typeCourse !== true ? <QuantityBox value={item?.quantity} selectedItem={selectedItem} item={item} quantity={quantity} btnDisabled={btnDisabled} />
                                                            : <b>-</b>
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="priceBox">
                                                        {item?.subTotal?.toLocaleString()} تومان
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="actions">
                                                        <Button onClick={() => {removeItem(item?._id)}} className='error' color="error"><TiDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                
                                
                            </tbody>
                        </table>

                        <div className="d-flex align-items-center tableFooter">
                            {
                                cartData?.length === undefined || cartData?.length === 0 && <span className="text-muted">
                                    سبد خرید شما خالی است!
                                </span>
                            }
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3 my-3">
                    <div className="card">
                        <h6 className="px-3 pt-3">مجموع سفارش</h6>
                        <hr className="mx-3" />
                        <div className="d-flex align-items-center px-3">
                            <h6 className="mb-0">تعداد سفارش : &nbsp;&nbsp;</h6>
                            <b>
                                {cartData?.length}
                            </b>
                        </div>
                        <hr className="mx-3" />
                        <div className="d-flex align-items-center px-3">
                            <h6 className="mb-0">مجموع : &nbsp;&nbsp;</h6>
                            <b>
                                {
                                cartData?.length !== 0 && cartData?.length !== undefined &&
                                cartData?.map(item => parseInt(item?.price) * item?.quantity).reduce((total, value) => total + value, 0).toLocaleString()
                                }
                            </b>
                            <img src={Toman} style={{width: '40px'}} />
                        </div>
                        <Button className="orderSubmit" onClick={sendAlert}>
                            ثبت سفارش <BsFillCartCheckFill /> 
                        </Button>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}
 
export default Cart;