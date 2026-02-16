import Button from "@mui/material/Button";
import Banner from "./../../assets/Listing/shopBanner2.png";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../../Components/Cards/courseCard";
import { MyContext } from "../../App";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Skeleton from '@mui/material/Skeleton';
import { GiArchiveResearch } from "react-icons/gi";
import ProductCard from "../../Components/Cards/productCard";

//responsive
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoIosArrowDown } from "react-icons/io";
import { fetchDataFromApi } from "../../utils/api";


const Shop = () => {

    useEffect(() => {
        context.setIsShowFooter(true); 
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

    const context = useContext(MyContext);
    const [value, setValue] = useState(0);
    const [viewActive, setViewActive] = useState(context.itemView);
    const [loading, setLoading] = useState(true);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const changeItemView = (index) => {
        context.setItemView(index);
        setViewActive(index);
    }

    useEffect(() => {
        window.scrollTo(0, 240);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [viewActive]);
     //responsive
    const [anchorEl, setAnchorEl] = useState(null);
    const open = (anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = (value) => {
      setValue(value);
      setAnchorEl(null);
    };
    // to close menu on scroll
    useEffect(() => {
        const handleScrollTwo = () => {
            if (anchorEl) {
                handleClose(value);
            }
        };
        window.addEventListener('scroll', handleScrollTwo);
        return () => {
            window.removeEventListener('scroll', handleScrollTwo);
        };
    }, [anchorEl]);
    //
    
    // backend
    
    const [productData, setProductDate] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/product').then((res) => {
            setProductDate(res);
        })
    }, []);
    useEffect(() => {
        setBtnDisabled(true);
        if(value !== 0){
            fetchDataFromApi(`/api/product?filterKey=${value}`).then((res) => {
                setProductDate(res);
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
            });
        }
        else{
            fetchDataFromApi('/api/product').then((res) => {
                setProductDate(res);
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
            })
        }
        
    }, [value]);
    
    
        return (
            <>
    
            <div className="listingPage shop">
                <div className="container">
                    
                    <div className="row">
    
                        <div className="col-12 col-lg-2 filterSection">
                            <p className="mb-1 mt-4 me-4 me-lg-0 breadCrumb ">
                                <Link to="/" ><b> خانه </b></Link> /
                                <Link to="/courseShop" ><b>فروشگاه محصولات</b></Link>
                            </p>
                            <div className="filterBox">
                                <h6>فیلتر بر اساس حوزه</h6>
                                
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    onChange={handleChange}
                                    className={`${btnDisabled === true ? 'pointerEventsNone' : ''}`}
                                >
                                    {/*<FormControlLabel value={0} control={<Radio />} label="همه محصولات" />*/}
                                    <FormControlLabel value={"سلولی، مولکولی و ژنتیک"} control={<Radio />} label="سلولی، مولکولی و ژنتیک" />
                                    <FormControlLabel value={'میکروبیولوژی'} control={<Radio />} label="میکروبیولوژی" />
                                    <FormControlLabel value={'نانوفناوری'} control={<Radio />} label="نانوفناوری" />
                                    <FormControlLabel value={'خدمات عمومی'} control={<Radio />} label="خدمات عمومی" />
                                    <FormControlLabel value={'زیست پزشکی'} control={<Radio />} label="زیست پزشکی" />
                                    <FormControlLabel value={'بالینی و مدل حیوانی'} control={<Radio />} label="بالینی و مدل حیوانی" />
                                </RadioGroup>
                            </div>
                            <div className="searchBtn">
                                <Button onClick={context.handleClickOpenSearchModal}>
                                    <span>جستجوی محصول&nbsp;</span>
                                    <GiArchiveResearch />
                                </Button>
                            </div>
                        </div>
    
                        <div className="col-12 col-lg-10">
                            <div className="container banner">
                                <img src={Banner} />
                                <h1>فروشگاه اوژن</h1>
                            </div>
                            <div className="toolBar">
                                <div className="d-flex align-items-center">
                                    <div className="viewButton align-items-center">
                                        <Button onClick={() => changeItemView(3)}>
                                            <div className="">
                                                <TfiLayoutGrid4Alt className={`${context.itemView === 3 ? 'active' : ''}`} />
                                            </div>
                                        </Button>
                                        <Button onClick={() => changeItemView(4)}>
                                            <div className="">
                                                <BsGrid3X3GapFill className={`${context.itemView === 4 ? 'active' : ''}`} />
                                            </div>
                                        </Button>
                                    </div>
    
                                    <div className="tabSection">
                                        <Box sx={{ maxWidth: { xs: 2820, sm: 2080 }}} >
                                            <Tabs
                                                value={value}
                                                onChange={handleChange}
                                                variant="scrollable"
                                                scrollButtons={false}
                                                aria-label="scrollable auto tabs example"
                                                className={`${btnDisabled === true ? 'pointerEventsNone' : ''}`}
                                            >
                                                <Tab className="tab" value={0} label="همه محصولات" />
                                                <Tab className="tab" value={'سلولی، مولکولی و ژنتیک'} label="سلولی، مولکولی و ژنتیک" />
                                                <Tab className="tab" value={'میکروبیولوژی'} label="میکروبیولوژی" />
                                                <Tab className="tab" value={'نانوفناوری'} label="نانوفناوری" />
                                                <Tab className="tab" value={'خدمات عمومی'} label="خدمات عمومی" />
                                                <Tab className="tab" value={'زیست پزشکی'} label="زیست پزشکی" />
                                                <Tab className="tab" value={'بالینی و مدل حیوانی'} label="بالینی و مدل حیوانی" />
                                            </Tabs>
                                        </Box>
                                    </div>

                                    <div className="mobileTabSection">
                                    <div className="btnWrapper">
                                        <Button onClick={handleClick}>{value === 0 ? 'همه محصولات' : value}&nbsp; <IoIosArrowDown /></Button>
                                    </div>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={() => handleClose(value)}
                                            slotProps={{
                                              list: {
                                                'aria-labelledby': 'basic-button',
                                              },
                                            }}
                                        >
                                            <MenuItem onClick={() => handleClose(0)}>همه محصولات</MenuItem>
                                            <MenuItem onClick={() => handleClose('سلولی، مولکولی و ژنتیک')}>سلولی، مولکولی و ژنتیک</MenuItem>
                                            <MenuItem onClick={() => handleClose('میکروبیولوژی')}>میکروبیولوژی</MenuItem>
                                            <MenuItem onClick={() => handleClose('نانوفناوری')}>نانوفناوری</MenuItem>
                                            <MenuItem onClick={() => handleClose('خدمات عمومی')}>خدمات عمومی</MenuItem>
                                            <MenuItem onClick={() => handleClose('زیست پزشکی')}>زیست پزشکی</MenuItem>
                                            <MenuItem onClick={() => handleClose('بالینی و مدل حیوانی')}>بالینی و مدل حیوانی</MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </div>
    
                            <div className="productSection mt-5">
                                <div className="row">
                                    {
                                        loading === false ?
                                            <>
                                            {
                                                productData?.length !== undefined && productData?.length !== 0 ? productData?.map((item, index) => {
                                                    return(
                                                        <div className={`col-12 col-md-12 col-lg-${context.itemView}`} key={index}>
                                                            <ProductCard item={item} />
                                                        </div>
                                                    )
                                                }) : <p className="mx-4">محصولی در حوزه انتخاب شده وجود ندارد!</p>
                                            }
                                            </>
                                        :
                                            <>
                                            <div className={`col-1 col-md-12  col-lg-${context.itemView} mb-5 skeletonWrapper`}>
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCard" />
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCardTwo" />
                                            </div> 
    
                                            <div className={`col-12 col-md-12  col-lg-${context.itemView} mb-5 skeletonWrapper`}>
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCard" />
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCardTwo" />
                                            </div> 
    
                                            <div className={`col-12 col-md-12  col-lg-${context.itemView} mb-5 skeletonWrapper`}>
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCard" />
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCardTwo" />
                                            </div> 
    
                                            <div className={`col-12 col-md-12  col-lg-${context.itemView} mb-5 skeletonWrapper`}>
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCard" />
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCardTwo" />
                                            </div> 
    
                                            <div className={`col-12 col-md-12  col-lg-${context.itemView} mb-5 skeletonWrapper`}>
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCard" />
                                                <Skeleton animation="wave" variant="rectangular" width={'100%'} className="skeletonCardTwo" />
                                            </div> 
                                            </>              
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }
 
export default Shop;