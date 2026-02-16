import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

import { VscAccount } from "react-icons/vsc";

const AccountPage = () => {

    const {id} = useParams();

    const [user, setUser] = useState([]);
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user?.userId === id){
            fetchDataFromApi(`/api/client/${id}`).then((res) => {
                setUser(res);
            })
        }

    }, [id]);


    return (
        <>

        <div className="container">
            <div className="accountPage">

                <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb ">
                    <Link to="/" ><b> خانه </b></Link> /
                    <Link to="/cart" ><b>حساب کاربری</b></Link> /
                    <Link to="" ><b>{`${user.length !== 0 ? user?.name : ''} ${user.length !== 0 ? user?.lastName : ''} `}</b></Link>
                </p>

                <div className="card w-100 w-md-50 shadow shadow-sm mt-5 accountBox">

                    <h4 className="px-3 mt-3"><VscAccount /> اطلاعات کاربر</h4>
                    
                    <hr />

                    <div className="accountProfile p-3 mx-3">
                        <p>{user.length !== 0 && user?.name?.charAt(0) + "." + user?.lastName?.charAt(0)}</p>
                    </div>

                    <div className="row px-3 py-1 mt-3">
                        <div className="col-12 col-md-10">
                            <h6>
                                <b>نام : </b>
                                <span className="text-muted">{user?.name}</span>
                            </h6>
                        </div>
                    </div>

                    <div className="row px-3 py-1">
                        <div className="col-12 col-md-10">
                            <h6>
                                <b>نام خانوادگی :</b>
                                <span className="text-muted">{user?.lastName ? user?.lastName : <b>-</b>}</span>
                            </h6>
                        </div>
                    </div>

                    <div className="row px-3 py-1">
                        <div className="col-12 col-md-10">
                            <h6>
                                <b>شماره تماس :</b>
                                <span className="text-muted">&nbsp;{user?.phone ? user?.phone : <b>&nbsp;-</b>}</span>
                            </h6>
                        </div>
                    </div>

                    <div className="row px-3 py-1">
                        <div className="col-12 col-md-10">
                            <h6>
                                <b>آدرس ایمیل :</b>
                                <span className="text-muted">&nbsp;{user?.email ? user?.email : <b>&nbsp;-</b>}</span>
                            </h6>
                        </div>
                    </div>

                    <div className="row px-3 py-1">
                        <div className="col-12 col-md-10">
                            <h6>
                                <b>زمان ساخت حساب کاربری :</b>
                                <span className="text-muted">&nbsp;{user?.dateCreated ? user?.dateCreated : <b>&nbsp;-</b>}</span>
                            </h6>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>

        </>
    );
}
 
export default AccountPage;