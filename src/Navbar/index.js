import logo from "./../assets/logo.png"
import { Link, Links, useNavigate } from "react-router-dom";
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
import { Box, ListItemIcon, Menu, MenuItem } from "@mui/material";
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

    const [mobileAccPanelOpen, setMobileAccPanelOpen] = useState(false);

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
                handleCloseMyAccDrop();
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const SideNavOpen = () => {
        setIsSideNavOpen(!isSideNavOpen);
    }
    const SideNavClose = () => {
        setIsSideNavOpen(false);
    }

    const MobileSidenavbarRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleVerticalScroll);
    }, []);

    const handleClickOutside = (event) => {
        if (MobileSidenavbarRef.current && !MobileSidenavbarRef.current.contains(event.target)) {
            handleCloseMyAccDropMobile();
            setIsSideNavOpen(false);
        }
    }

    const handleVerticalScroll = () => {
        const position = window.scrollY;
        if (position > 1) {
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
        navigate('/courseShop');
    };

    // backend
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
            <div className="special">
                <div className="myNavbar" data-model-id="51:46">
                    <div className="navbarInner">

                        <div className="navbarLogo">
                            <Link to="/">
                                <img className="picture" src={logo} />
                            </Link>
                        </div>

                        <div className="navbarMenu">
                            <ul className="list-unstyled d-flex justify-content-center">
                                <div ref={dropdownRef} style={{ position: 'relative' }}>
                                    <li className={`flex align-items-center cursor-pointer ${navbarDropDown && 'fixedBold'}`}
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
                                                زیست پزشکی و گیاهی
                                            </div>
                                            <div onClick={() => handleClick(0)}>
                                                تمامی دوره ها
                                            </div>
                                        </div>
                                    }
                                </div>
                                <Link to='/degree'><li>مدرک فنی و حرفه ای</li></Link>
                                <Link to='/service'><li>خدمات</li></Link>
                                <Link to='/shop'><li>فروشگاه</li></Link>
                                <Link to='/blog'><li>بلاگ</li></Link>
                                <Link to='/aboutUs'><li>درباره و تماس</li></Link>
                            </ul>
                        </div>

                        <div className="navbarActions d-flex align-items-center justify-content-center">
                            {
                                context.isLoggedIn === true ?
                                    <Link className="iconBtn">
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
                                                        <FaUserCog />
                                                    </ListItemIcon>
                                                    حساب من
                                                </MenuItem>
                                            </Link>
                                            <Link to={`/orders/${userId}`}>
                                                <MenuItem className="menuItemInMobile" onClick={handleCloseMyAccDrop}>
                                                    <ListItemIcon>
                                                        <GiShoppingBag />
                                                    </ListItemIcon>
                                                    سفارشات من
                                                </MenuItem>
                                            </Link>
                                            <Link to={'/change-password'}>
                                                <MenuItem className="menuItemInMobile mobile" onClick={handleCloseMyAccDropMobile}>
                                                    <ListItemIcon>
                                                        <MdPublishedWithChanges />
                                                    </ListItemIcon>
                                                    تغییر رمز عبور
                                                </MenuItem>
                                            </Link>
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
                                        <div className="hideInMobile ms-1 logInBtn">ورود / ثبت نام</div>
                                    </Link>
                            }
                            {
                                context.isLoggedIn === true &&
                                <Link to={`/cart/${context.user?.userId}`} className="iconBtn">
                                    <Button className="hideInMobile">
                                        <BsBasket3Fill />
                                    </Button>
                                </Link>
                            }
                            <div className="d-flex align-items-center justify-content-center iconBtn search">
                                <Tooltip title="جستجو" arrow>
                                    <div onClick={context.handleClickOpenSearchModal}>
                                        <IoSearch />
                                    </div>
                                </Tooltip>
                            </div>
                            <Button className="menuButton" onClick={SideNavOpen}>
                                <MdOutlineMenu />
                            </Button>
                        </div>

                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className={`${isSideNavOpen === true ? 'sidenavOpen' : 'sidenavClosed'}`} ref={MobileSidenavbarRef}>
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
                                    <div
                                        className={`mobileAccPanelToggle ${mobileAccPanelOpen ? 'open' : ''}`}
                                        onClick={() => setMobileAccPanelOpen(!mobileAccPanelOpen)}
                                    >
                                        <Link className="cartIcon">
                                            <div>
                                                <FaUserCircle />
                                                &nbsp;
                                                پنل کاربری
                                                <IoChevronDownOutline className={`mobileAccPanelArrow ${mobileAccPanelOpen ? 'rotated' : ''}`} />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className={`mobileAccPanel ${mobileAccPanelOpen ? 'expanded' : ''}`}>
                                        <Link to={`/accountPage/${userId}`} onClick={SideNavClose}>
                                            <div className="mobileAccPanelItem">
                                                <ListItemIcon>
                                                    <FaUserCog />
                                                </ListItemIcon>
                                                حساب من
                                            </div>
                                        </Link>
                                        <Link to={`/orders/${userId}`} onClick={SideNavClose}>
                                            <div className="mobileAccPanelItem">
                                                <ListItemIcon>
                                                    <GiShoppingBag />
                                                </ListItemIcon>
                                                سفارشات من
                                            </div>
                                        </Link>
                                        <Link to={'/change-password'} onClick={SideNavClose}>
                                            <div className="mobileAccPanelItem">
                                                <ListItemIcon>
                                                    <MdPublishedWithChanges />
                                                </ListItemIcon>
                                                تغییر رمز عبور
                                            </div>
                                        </Link>
                                        <Link>
                                            <div className={`mobileAccPanelItem ${btnDisabled !== false && 'btnDisabled'}`} onClick={logout}>
                                                <ListItemIcon>
                                                    <BiLogOut fontSize="small" />
                                                </ListItemIcon>
                                                خروج از حساب
                                            </div>
                                        </Link>
                                    </div>
                                </>
                        }
                        {
                            context.isLoggedIn === true &&
                            <Link onClick={SideNavClose} to={`/cart/${context.user?.userId}`} className="cartIcon">
                                <div>
                                    <BsBasket3Fill />
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
                        <Link to='/service' onClick={SideNavClose}><li>خدمات</li></Link>
                        <Link to='/shop' onClick={SideNavClose}><li>فروشگاه</li></Link>
                        <Link to='/blog' onClick={SideNavClose}><li>بلاگ</li></Link>
                        <Link to='/aboutUs' onClick={SideNavClose} className="mb-5"><li>درباره اوژن</li></Link>
                    </div>
                </div>

               {/* Search Modal */}
                <div className="modalWrapper">
                    <Dialog
                        open={context.searchModalOpen}
                        onClose={context.handleCloseOpenSearchModal}
                        maxWidth={dialogWidth}
                        sx={{
                            zIndex: 99999, // ensures the dialog + its backdrop sit above navbar, dropdown, and sidenav
                        }}
                        PaperProps={{
                            sx: {
                                borderRadius: '24px',
                                padding: '8px',
                                boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
                                minWidth: { xs: 'unset', sm: '420px' },
                                width: { xs: 'calc(100% - 32px)', sm: 'auto' },
                                margin: { xs: '16px', sm: '32px' },
                            }
                        }}
                    >
                        <DialogTitle
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: { xs: '17px', sm: '19px' },
                                fontWeight: 700,
                                color: '#1f2d27',
                                padding: { xs: '18px 18px 6px 18px', sm: '20px 24px 8px 24px' },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: '#eafaf4',
                                    color: '#1e7d5f',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    flexShrink: 0,
                                }}
                            >
                                <BsSearch />
                            </Box>
                            جستجو
                        </DialogTitle>
                            
                        <DialogContent
                            sx={{
                                padding: { xs: '10px 18px 6px 18px', sm: '12px 24px 8px 24px' },
                            }}
                        >
                            <form id="subscription-form">
                                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <BsSearch
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            fontSize: '17px',
                                            color: '#9aa8a1',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                    <Box
                                        component="input"
                                        autoFocus
                                        placeholder="جستجو بر اساس دوره، محصول و ..."
                                        sx={{
                                            width: '100%',
                                            padding: { xs: '12px 42px 12px 14px', sm: '14px 46px 14px 18px' },
                                            border: '2px solid #eef2f0',
                                            borderRadius: '16px',
                                            fontSize: { xs: '14px', sm: '15px' },
                                            background: '#fafcfb',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.25s ease, background 0.25s ease',
                                            '&:focus': {
                                                borderColor: '#26A999',
                                                background: '#ffffff',
                                            },
                                        }}
                                    />
                                </Box>
                            </form>
                        </DialogContent>
                                    
                        <DialogActions
                            sx={{
                                padding: { xs: '14px 18px 18px 18px', sm: '16px 24px 22px 24px' },
                                gap: '10px',
                            }}
                        >
                            <Button
                                onClick={context.handleCloseOpenSearchModal}
                                sx={{
                                    background: '#f5f8f6',
                                    color: '#6b7b73',
                                    borderRadius: '14px',
                                    padding: '9px 24px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    textTransform: 'none',
                                    transition: 'background 0.25s ease',
                                    '&:hover': {
                                        background: '#eef2f0',
                                    },
                                }}
                            >
                                انصراف
                            </Button>
                            <Button
                                onClick={handleSearch}
                                sx={{
                                    background: '#26A999',
                                    color: '#ffffff',
                                    borderRadius: '14px',
                                    padding: '9px 28px',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    textTransform: 'none',
                                    boxShadow: '0 6px 16px rgba(38,169,153,0.3)',
                                    transition: 'background 0.25s ease, transform 0.25s ease',
                                    '&:hover': {
                                        background: '#1e8a7d',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                جستجو
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </>
    );
}

export default Navbar;