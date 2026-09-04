import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDataFromApi, updateAccountData } from "../../utils/api";

import { VscAccount } from "react-icons/vsc";
import { FiEdit2 } from "react-icons/fi";
import { HiOutlineMail, HiOutlinePhone, HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";
import { FiSave, FiX } from "react-icons/fi";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";

const AccountPage = () => {

    const { id } = useParams();

    const [user, setUser] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', lastName: '', email: '' });
    const context = useContext(MyContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.userId === id) {
            fetchDataFromApi(`/api/client/${id}`).then((res) => {
                setUser(res);
                setFormData({
                    name: res?.name || '',
                    lastName: res?.lastName || '',
                    email: res?.email || ''
                });
            })
        }
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            lastName: user?.lastName || '',
            email: user?.email || ''
        });
        setIsEditing(false);
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {

        if (!formData.name.trim()) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'لطفا نام خود را وارد کنید!'
            });
            return;
        }

        if (!formData.lastName.trim()) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'لطفا نام خانوادگی خود را وارد کنید!'
            });
            return;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'لطفا یک ایمیل معتبر وارد کنید!'
            });
            return;
        }

        if (isLoading) return;
    
        setIsLoading(true);

        try {
            // Get the user from localStorage
            const user = JSON.parse(localStorage.getItem('user'));

            // Prepare the data to update
            const updatedData = {
                name: formData.name,
                lastName: formData.lastName,
                email: formData.email
            };

            // Make the API call to update user using the new function
            const response = await updateAccountData(`/api/client/${id}`, updatedData);

            if (response && !response.error) {
                // Update the local user state
                setUser(response);

                // Update localStorage with new user data
                const updatedUser = {
                    ...user,
                    name: response.name,
                    lastName: response.lastName,
                    email: response.email
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Exit edit mode
                setIsEditing(false);
                setIsLoading(false);

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'اطلاعات با موفقیت ویرایش شد.'
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'خطا در بروزرسانی اطلاعات! مجددا تلاش کنید.'
                });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در بروزرسانی اطلاعات! مجددا تلاش کنید.'
            });
        }  finally {
            setIsLoading(false);
        }
    };

    const initials = user.length !== 0 ? `${user?.name?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}` : '';

    return (
        <>
            <div className="container">
                <div className="accountPage">

                    <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb">
                        <Link to="/"><b> خانه </b></Link> /
                        <Link to="/cart"><b>حساب کاربری</b></Link> /
                        <Link to=""><b>{`${user.length !== 0 ? user?.name : ''} ${user.length !== 0 ? user?.lastName : ''} `}</b></Link>
                    </p>

                    <div className="accountBox">

                        <div className="accountBoxHeader">
                            <div className="accountHeaderTitle">
                                <VscAccount />
                                <h4>اطلاعات کاربر</h4>
                            </div>
                            {
                                !isEditing && (
                                    <Button className="editProfileBtn" onClick={handleEditToggle}>
                                        <FiEdit2 />
                                        ویرایش اطلاعات
                                    </Button>
                                )
                            }
                        </div>

                        <div className="accountProfileHeader">
                            <div className="accountAvatar">
                                <span>{initials}</span>
                            </div>
                            <div className="accountProfileMeta">
                                <h5>{user?.name} {user?.lastName}</h5>
                                <span className="accountJoinDate">
                                    <HiOutlineCalendar />
                                    عضویت از {user?.dateCreated ? user?.dateCreated : '-'}
                                </span>
                            </div>
                        </div>

                        <div className="accountFieldsGrid">

                            <div className="accountField">
                                <label>
                                    <HiOutlineUser />
                                    نام
                                </label>
                                {
                                    isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="accountInput"
                                        />
                                    ) : (
                                        <p>{user?.name || '-'}</p>
                                    )
                                }
                            </div>

                            <div className="accountField">
                                <label>
                                    <HiOutlineUser />
                                    نام خانوادگی
                                </label>
                                {
                                    isEditing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="accountInput"
                                        />
                                    ) : (
                                        <p>{user?.lastName || '-'}</p>
                                    )
                                }
                            </div>

                            <div className="accountField">
                                <label>
                                    <HiOutlinePhone />
                                    شماره تماس
                                </label>
                                <p className="accountFieldLocked">
                                    {user?.phone || '-'}
                                    <span className="lockedBadge">غیرقابل ویرایش</span>
                                </p>
                            </div>

                            <div className="accountField">
                                <label>
                                    <HiOutlineMail />
                                    آدرس ایمیل
                                </label>
                                {
                                    isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="accountInput"
                                            placeholder="ایمیل خود را وارد کنید"
                                        />
                                    ) : (
                                        <p>{user?.email || '-'}</p>
                                    )
                                }
                            </div>

                        </div>

                        {
                            isEditing && (
                                <div className="accountEditActions">
                                    <Button className="accountCancelBtn" onClick={handleCancel}>
                                        <FiX />
                                        انصراف
                                    </Button>
                                    <Button className="accountSaveBtn" onClick={handleSave} disabled={isLoading}>
                                        <FiSave />
                                        {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                    </Button>
                                </div>
                            )
                        }

                    </div>

                </div>
            </div>
        </>
    );
}

export default AccountPage;