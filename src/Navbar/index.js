import logo from "./../assets/logo.png"
import {Link, Links, useNavigate} from "react-router-dom";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import Button from '@mui/material/Button';
import { MdOutlineMenu } from "react-icons/md";

import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useRef, useState } from "react";

import { BsSearch, BsShieldFillExclamation } from "react-icons/bs";

import { BsBasket3Fill } from "react-icons/bs";
import { MyContext } from "../App";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { BiLogOut } from "react-icons/bi";

import { FaUserCog } from "react-icons/fa";
import { MdPublishedWithChanges } from "react-icons/md";
import { GiShoppingBag } from "react-icons/gi";

import { IoChevronDownOutline } from "react-icons/io5";

const Navbar = () => {

    const [dialogWidth, setDialogWidth] = useState('lg');
    const context = useContext(MyContext);
    const history = useNavigate();

    // menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElMobile, setAnchorElMobile] = useState(null);

    const openMyAcc = Boolean(anchorEl);
    const openMyAccMobile = Boolean(anchorElMobile);

    const handleOpenMyAccDrop = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleOpenMyAccDropMobile = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDrop = () => {
      setAnchorEl(null);
    };
    const handleCloseMyAccDropMobile = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1100) {
              handleCloseMyAccDrop(); // close the menu
            }
        };
      
        window.addEventListener("resize", handleResize);
    
        // run once on mount in case the page loads small
        handleResize();
      
          return () => window.removeEventListener("resize", handleResize);
    }, []);

    //

    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const SideNavOpen = () => {
        setIsSideNavOpen(!isSideNavOpen);
    }
    const SideNavClose = () => {
        setIsSideNavOpen(false);
    }

    const MobileSidenavbarRef = useRef(null);

    useEffect(()=>{
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleVerticalScroll);
    } ,[]);

    const handleClickOutside = (event) => {
        if (MobileSidenavbarRef.current && !MobileSidenavbarRef.current.contains(event.target)) {
            handleCloseMyAccDropMobile();
            setIsSideNavOpen(false);
        }
    }

    const handleVerticalScroll = () => {
        const position = window.scrollY;
        if (position > 1){
            handleCloseMyAccDropMobile();
            setIsSideNavOpen(false);
        } 
    }

    const [navbarDropDown, setNavbarDropDown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setNavbarDropDown(false);
            }
        }; 

        const handleScroll = () => {
            if (navbarDropDown) {
                setNavbarDropDown(false);
            }
        };

        // Use 'click' instead of 'mousedown' and add it to the document
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [navbarDropDown]);

    const navigate = useNavigate();

    const handleClick = (value) => {
        context.setCourseFilterValue(value);
        navigate('/courseShop'); // Navigate without filter in URL
    };


    //backend
    const [btnDisabled, setBtnDisabled] = useState(false);

    const logout = () => {
        setBtnDisabled(true);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        context.setAlertBox({
            open: true,
            error: false,
            msg: "با موفقیت خارج شدید!"
        });

        setAnchorEl(null);

        setTimeout(() => {
            history('/login');
        }, 1000);

        setTimeout(() => {
            setBtnDisabled(false);
        }, 2000);
    }

    const [userId, setUserId] = useState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserId(user?.userId);

    }, [userId]);


    const handleSearch = () => {
        alert('به زودی امکان جستجو فراهم میشود!')
    }


    return (
        <>

        {/* PC Navbar */}
        <div className="special container">
            <div className="myNavbar" data-model-id="51:46">
                <div className="d-flex align-items-center w-100">
                    <div className="logoSection">
                        <Link to="/">
                            <img className="picture" src= {logo} />
                        </Link>
                    </div>
                    <div className="menuItems">
                        <ul className="list-unstyled d-flex">
                            <div ref={dropdownRef} style={{position: 'relative'}}>
                                
                                <li className={`flex align-items-center ${navbarDropDown && 'fixedBold'}`} 
                                onClick={() => setNavbarDropDown(!navbarDropDown)}>
                                    دوره های آموزشی &nbsp;
                                    <span><IoChevronDownOutline 
                                    className={`icon ${navbarDropDown ? 'rotatefull' : ''}`} /></span>
                                </li>
                                {
                                    navbarDropDown &&
                                    <div className="dropdownMenu shadow shadow-md">
                                        <div onClick={() => handleClick('سلولی، مولکولی و ژنتیک')}>
                                            سلولی، مولکولی و ژنتیک
                                        </div>
                                        <div onClick={() => handleClick('میکروبیولوژی')}>
                                            میکروبیولوژی
                                        </div>
                                        <div onClick={() => handleClick('خدمات عمومی')}>
                                            خدمات عمومی
                                        </div>
                                        <div onClick={() => handleClick('نانوفناوری')}>
                                            نانوفناوری
                                        </div>
                                        <div onClick={() => handleClick('بالینی و مدل حیوانی')} className="text-nowrap">
                                            بالینی و مدل حیوانی/هیستولوژی
                                        </div>
                                        <div onClick={() => handleClick('زیست پزشکی')}>
                                            زیست پزشکی
                                        </div>
                                        <div onClick={() => handleClick(0)}>
                                            تمامی دوره ها
                                        </div>
                                    </div>
                                }
                            
                            </div>
                            <Link to='/degree'><li>مدرک فنی و حرفه ای</li></Link>
                            {/*<Link to=''><li>مدرک کارآموزی</li></Link>*/}
                            <Link to='/service'><li>خدمات</li></Link>
                            <Link to='/shop'><li>فروشگاه</li></Link>
                            <Link to='/'><li>بلاگ</li></Link>
                            <Link to='/aboutUs'><li>درباره و تماس</li></Link>
                        </ul>
                    </div>

                    <div className="btnGroup d-flex align-items-center">
                        {
                            context.isLoggedIn === true ? 
                                <Link>
                                    <Button onClick={handleOpenMyAccDrop} className="hideInMobile">
                                        <FaUserCircle />
                                    </Button>

                                    <Menu className="menuInMobile" anchorEl={anchorEl} id="account-menu" open={openMyAcc} onClose={handleCloseMyAccDrop} 
                                        onClick={handleCloseMyAccDrop}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>                 
                                        <Link to={`/accountPage/${userId}`}>
                                            <MenuItem className="menuItemInMobile mobile" onClick={handleOpenMyAccDropMobile}>
                                                <ListItemIcon>
                                                    <FaUserCog/>
                                                </ListItemIcon>
                                                حساب من
                                            </MenuItem>
                                        </Link>
                                        <MenuItem className="menuItemInMobile" onClick={handleCloseMyAccDrop}>
                                            <ListItemIcon>
                                                <GiShoppingBag/>
                                            </ListItemIcon>
                                            سفارشات من
                                        </MenuItem>
                                        <MenuItem className="menuItemInMobile" onClick={handleCloseMyAccDrop}>
                                          <ListItemIcon>
                                                <MdPublishedWithChanges />
                                          </ListItemIcon>
                                          تغییر رمز عبور
                                        </MenuItem>
                                        <MenuItem className={`menuItemInMobile ${btnDisabled !== false && 'btnDisabled'}`} onClick={logout}>
                                            <ListItemIcon>
                                                <BiLogOut fontSize="small" />
                                            </ListItemIcon>
                                            خروج از حساب     
                                        </MenuItem>
                                    </Menu>
                                </Link>
                            :
                            <Link to='/logIn'>
                                <div className="hideInMobile logInBtn ms-1">ورود</div>
                            </Link>
                        }
                        {
                            context.isLoggedIn === true && 
                            <Link to={`/cart/${context.user?.userId}`}>
                                <Button className="hideInMobile">
                                    <BsBasket3Fill />
                                    {/*<span className="d-flex align-items-center justify-content-center basketCounter">{context.cartData?.length}</span>*/}
                                </Button>
                            </Link>
                        }
                        <Tooltip title="جستجو" arrow>
                            <div onClick={context.handleClickOpenSearchModal} className="searchBtn">
                                <IoSearch />
                            </div>
                        </Tooltip>
                        <Button className="menuButton" onClick={SideNavOpen}>
                            <MdOutlineMenu />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navbar */}

            <div class={`${isSideNavOpen === true ? 'sidenavOpen' : 'sidenavClosed'}`} ref={MobileSidenavbarRef}>
                <div className="sideBarbtnGroup">
                    {
                        context.isLoggedIn === false ? 
                            <Link to='/logIn'>
                                <FaUserCircle /> 
                                &nbsp;
                                ورود / ثبت نام
                            </Link>
                        :
                        <>
                            <Link onClick={handleOpenMyAccDropMobile}>
                                <FaUserCircle /> 
                                &nbsp;
                                پنل کاربری
                            </Link>

                            <Menu className="menuInMobile" anchorEl={anchorElMobile} id="account-menu" open={openMyAccMobile} onClose={handleCloseMyAccDropMobile} 
                                onClick={handleCloseMyAccDrop}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}>                 
                                <Link to={`/accountPage/${userId}`}>
                                    <MenuItem className="menuItemInMobile mobile" onClick={handleOpenMyAccDropMobile}>
                                        <ListItemIcon>
                                            <FaUserCog/>
                                        </ListItemIcon>
                                    </MenuItem>
                                </Link>
                                <MenuItem className="menuItemInMobile mobile" onClick={handleCloseMyAccDropMobile}>
                                    <ListItemIcon>
                                        <GiShoppingBag/>
                                    </ListItemIcon>
                                    سفارشات من
                                </MenuItem>
                                <MenuItem className="menuItemInMobile mobile" onClick={handleCloseMyAccDropMobile}>
                                  <ListItemIcon>
                                        <MdPublishedWithChanges />
                                  </ListItemIcon>
                                  تغییر رمز عبور
                                </MenuItem>
                                <MenuItem className={`menuItemInMobile ${btnDisabled !== false && 'btnDisabled'}`} onClick={logout}>
                                    <ListItemIcon>
                                        <BiLogOut fontSize="small" />
                                    </ListItemIcon>
                                    خروج از حساب     
                                </MenuItem>
                            </Menu>
                        </>
                    }
                    {
                        context.isLoggedIn === true &&
                        <Link  onClick={SideNavClose} to={`/cart/${context.user?.userId}`} className="cartIcon">
                            <div>
                                <BsBasket3Fill />
                                {/*<span className="d-flex align-items-center justify-content-center">{context.cartData?.length}</span>*/}
                                &nbsp;
                                سبد خرید
                            </div>
                        </Link>
                    }
                </div>
                <hr />

                <div className="list-unstyled">
                    <Button className="closeBtn" onClick={SideNavClose}>&times;</Button>
                    <Link to='/' onClick={SideNavClose}><li>صفحه اصلی</li></Link>
                    <Link to='/courseShop' onClick={SideNavClose}><li>دوره های آموزشی</li></Link>
                    <Link to='/degree' onClick={SideNavClose}><li>مدرک فنی و حرفه ای</li></Link>
                    {/*<Link to='' onClick={SideNavClose}><li>مدرک کارآموزی</li></Link>*/}
                    <Link to='/service' onClick={SideNavClose}><li>خدمات</li></Link>
                    <Link to='/shop' onClick={SideNavClose}><li>فروشگاه</li></Link>
                    <Link to='/aboutUs' onClick={SideNavClose}><li>درباره اوژن</li></Link>
                </div>
            </div>




            {/* Search Modal */}
            <div className="modalWrapper">
                <Dialog open={context.searchModalOpen} onClose={context.handleCloseOpenSearchModal} maxWidth={dialogWidth}>
                    <DialogTitle>جستجو &nbsp;<BsSearch style={{fontSize : "18px"}} /></DialogTitle>
                    <DialogContent>
                        <form id="subscription-form">
                            <input className="modalInput" placeholder="جستجو بر اساس دوره، محصول و ..." />
                        </form>
                    </DialogContent>
                    <DialogActions className="modalButtonWrapper">
                        <Button className="mx-2" onClick={handleSearch}>جستجو</Button>
                        <Button className="ms-3" onClick={context.handleCloseOpenSearchModal}>انصراف</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
        </>
    );
} 
 
export default Navbar;