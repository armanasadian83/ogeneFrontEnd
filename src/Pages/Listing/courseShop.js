import Button from "@mui/material/Button";
import Banner from "./../../assets/Listing/banner One.jpg"
import { BsGrid3X3GapFill } from "react-icons/bs";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CourseCard from "../../Components/Cards/courseCard";
import { MyContext } from "../../App";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { GiArchiveResearch } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { fetchDataFromApi } from "../../utils/api";

/* Skeleton card matching CourseCard's shape */
const CourseSkeletonCard = () => (
    <div className='shopCourseCard shopSkeletonCard'>
        <div className='shopCourseImgWrapper shopShimmer'></div>
        <div className='shopCourseCardBody'>
            <div className='shopSkeletonLine shopSkeletonLineTitle shopShimmer'></div>
            <div className='shopSkeletonLine shopSkeletonLineTitle2 shopShimmer'></div>
            <div className='shopSkeletonLine shopSkeletonLineBtn shopShimmer'></div>
        </div>
    </div>
);

const filterOptions = [
    { value: 'سلولی، مولکولی و ژنتیک', label: 'سلولی، مولکولی و ژنتیک' },
    { value: 'میکروبیولوژی', label: 'میکروبیولوژی' },
    { value: 'نانوفناوری', label: 'نانوفناوری' },
    { value: 'خدمات عمومی', label: 'خدمات عمومی' },
    { value: 'زیست پزشکی', label: 'زیست پزشکی' },
    { value: 'بالینی و مدل حیوانی', label: 'بالینی و مدل حیوانی' },
];

const CourseShop = () => {

    const context = useContext(MyContext);
    const [viewActive, setViewActive] = useState(context.itemView);
    const [loading, setLoading] = useState(true);
    const [btnDisabled, setBtnDisabled] = useState(false);

    useEffect(() => {
        context.setIsShowFooter(true);
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);

    const handleChange = (event, newValue) => {
        context.setCourseFilterValue(newValue);
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

    // responsive filter menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (value) => {
        context.setCourseFilterValue(value);
        setAnchorEl(null);
    };

    useEffect(() => {
        const handleScrollTwo = () => {
            if (anchorEl) {
                handleClose(context.courseFilterValue);
            }
        };
        window.addEventListener('scroll', handleScrollTwo);
        return () => {
            window.removeEventListener('scroll', handleScrollTwo);
        };
    }, [anchorEl]);

    // backend
    const [courseData, setCourseDate] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/course').then((res) => {
            setCourseDate(res);
        })
    }, []);

    useEffect(() => {
        setBtnDisabled(true);
        if (context.courseFilterValue !== 0) {
            fetchDataFromApi(`/api/course?filterKey=${context.courseFilterValue}`).then((res) => {
                setCourseDate(res);
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
            });
        } else {
            fetchDataFromApi('/api/course').then((res) => {
                setCourseDate(res);
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
            })
        }
    }, [context.courseFilterValue]);

    return (
        <>
            <div className="listingPage">
                <div className="container">
                    <div className="row">

                        {/* ===== Sidebar ===== */}
                        <div className="col-12 col-lg-2 filterSection">
                            <p className="mb-1 mt-2 me-4 me-lg-0 breadCrumb">
                                <Link to="/"><b>خانه</b></Link> /
                                <Link to="/courseShop"><b> دوره های آموزشی</b></Link>
                            </p>

                            <div className="filterBox">
                                <div className="filterBoxHeader">
                                    <HiOutlineAdjustmentsHorizontal />
                                    <h6>فیلتر بر اساس حوزه</h6>
                                </div>

                                <RadioGroup
                                    value={context.courseFilterValue}
                                    onChange={handleChange}
                                    className={`${btnDisabled === true ? 'pointerEventsNone' : ''}`}
                                >
                                    {filterOptions.map((opt) => (
                                        <FormControlLabel
                                            key={opt.value}
                                            value={opt.value}
                                            control={<Radio />}
                                            label={opt.label}
                                        />
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="searchBtn">
                                <Button onClick={context.handleClickOpenSearchModal}>
                                    <span>جستجوی دوره &nbsp;</span>
                                    <GiArchiveResearch />
                                </Button>
                            </div>
                        </div>

                        {/* ===== Main content ===== */}
                        <div className="col-12 col-lg-10">

                            <div className="container banner">
                                <img src={Banner} />
                                <div className="bannerOverlay"></div>
                                <h1>دوره های آموزشی اوژن</h1>
                            </div>

                            <div className="toolBar">
                                <div className="d-flex align-items-center">

                                    <div className="viewButton align-items-center">
                                        <Button onClick={() => changeItemView(3)}>
                                            <TfiLayoutGrid4Alt className={`${context.itemView === 3 ? 'active' : ''}`} />
                                        </Button>
                                        <Button onClick={() => changeItemView(4)}>
                                            <BsGrid3X3GapFill className={`${context.itemView === 4 ? 'active' : ''}`} />
                                        </Button>
                                    </div>

                                    <div className="tabSection">
                                        <Box sx={{ maxWidth: { xs: 2820, sm: 2080 } }}>
                                            <Tabs
                                                value={context.courseFilterValue}
                                                onChange={handleChange}
                                                variant="scrollable"
                                                scrollButtons={false}
                                                className={`${btnDisabled === true ? 'pointerEventsNone' : ''}`}
                                            >
                                                <Tab className="tab" value={0} label="همه دوره ها" />
                                                {filterOptions.map((opt) => (
                                                    <Tab className="tab" key={opt.value} value={opt.value} label={opt.label} />
                                                ))}
                                            </Tabs>
                                        </Box>
                                    </div>

                                    <div className="mobileTabSection">
                                        <div className="btnWrapper">
                                            <Button onClick={handleClick}>
                                                {context.courseFilterValue === 0 ? 'همه دوره ها' : context.courseFilterValue}
                                                &nbsp; <IoIosArrowDown />
                                            </Button>
                                        </div>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={() => handleClose(context.courseFilterValue)}
                                        >
                                            <MenuItem onClick={() => handleClose(0)}>همه دوره ها</MenuItem>
                                            {filterOptions.map((opt) => (
                                                <MenuItem key={opt.value} onClick={() => handleClose(opt.value)}>{opt.label}</MenuItem>
                                            ))}
                                        </Menu>
                                    </div>
                                </div>
                            </div>

                            <div className="productSection mt-5">
                                <div className="row">
                                    {
                                        loading === false ? (
                                            courseData?.length !== undefined && courseData?.length !== 0 ? (
                                                courseData.map((item, index) => (
                                                    <div className={`col-12 col-md-12 col-lg-${context.itemView}`} key={index}>
                                                        <CourseCard item={item} />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="emptyState">
                                                    <GiArchiveResearch />
                                                    <p>دوره ای در حوزه انتخاب شده وجود ندارد!</p>
                                                </div>
                                            )
                                        ) : (
                                            Array.from({ length: 6 }).map((_, i) => (
                                                <div className={`col-12 col-md-12 col-lg-${context.itemView} mb-4`} key={i}>
                                                    <CourseSkeletonCard />
                                                </div>
                                            ))
                                        )
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

export default CourseShop;