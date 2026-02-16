import { useContext, useEffect, useRef, useState } from "react";
import FieldsBanner from "./banner";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import CourseCard from "../../Components/Cards/courseCard";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { SiMicrogenetics } from "react-icons/si";
import { FaEye, FaRegEye } from "react-icons/fa";
import { fetchDataFromApi } from "../../utils/api";

import { MyContext } from "../../App";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/*const names = [
    ' استخراج RNA و DNA ',
    ' سنتز cDNA ',
    ' انجام کلیه آزمون ها و آنالیز بررسی های Real-time PCR ',
    ' آنالیز بررسی میزان رشد، تکثیر و مرگ سلولی',
    ' آنالیز به روش وسترن بلات',
    ' آزمون واکنش های زنجیره ای پلیمراز (PCR) ',
    ' آنالیز شناسایی دقیق انواع پروتئین ها ',
    ' خدمات انتقال افقی ژن به روش ترانسفرماسیون به سلول یا باکتری ',
    ' آزمون آنتی ژن های مجموعه سازگاری بافتی اصلی مولکول های پروتئینی به روش SSP-PCR و SSO ',
    ' آزمون زنده مانی سلولی' ,
    ' خدمات تهیه بافر ',
    ' خدمات جداسازی سلول از PBMC ',
    ' خدمات جداسازی و تکثیر سلول اولیه از نمونه بافت با استفاده از آنزیم یا بدون آنزیم ',
    ' آزمون جداسازی و شناسایی سلول های بنیادی سرطان(CSCs) ',
    ' خدمات کشت دو بعدی و سه بعدی سلول ها ',
    ' آنالیز تعیین همسانی در لوکوس های HLA ',
    ' محاسبه دلتا-دلتا سی تی RT-PCR ',
    ' خدمات تیمار سلول ها ',
    ' آنالیز تعیین توالی بیماری های ژنتیک ',
    ' خدمات شمارش سلول با استفاده از میکروسکوپ ',
    ' خدمات جداسازی و کشت سلول از انواع بافت های بدن (Primary culture) ',
    ' خدمات ترانسداکشن (ترانسداکسیون) سلول با ویروس ',
    ' خدمات انتقال افقی ژن به روش هم یوغی با کونژوگاسیون (conjugation) ',
    ' خدمات جداسازی سلول بر اساس مارکر های سطحی با روش MACS ',
    ' خدمات انتقال پلاسمید به داخل سلول CHO و ایجاد سلول ترانسژنیک ',
    ' خدمات تهیه محیط کشت آماده مصرف RPMI ',
    ' آنالیز بررسی میزان ROS ',
    ' آنالیز بررسی آپوپتوز در سلول ',
    ' آنالیز بررسی شکست DNA ',
    ' آنالیز بررسی شاخص های سطحی و درون سلولی ',
    ' آنالیز بررسی چرخه سلولی و پلوئید ',
    ' الکتروفورز عمودی و افقی ',
    ' طراحی پرایمر ',
    ' سنتز پرایمر ',
    ' آزمون MTT به روش عصاری گیری ',
    ' خدمات انواع رنگ آمیزی '
];*/


function getStyles(name, personName, theme) {
    return {
        fontWeight: personName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

const FieldOne = () => {

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsShowFooter(true); 
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);
    }, []);
    
    const theme = useTheme();
    const [personName, setPersonName] = useState([]);

    const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
    
    const [sectionOneIndex, setSectionOneIndex] = useState(false);
    const [sectionTwoIndex, setSectionTwoIndex] = useState(false);
    const [sectionThreeIndex, setSectionThreeIndex] = useState(false);

    const openSectionOne = () => {
        setSectionOneIndex(!sectionOneIndex);
    }

    const openSectionTwo = () => {
        setSectionTwoIndex(!sectionTwoIndex);
    }

    const openSectionThree = () => {
        setSectionThreeIndex(!sectionThreeIndex);
    }

    useEffect(() => {
        window.scrollTo(0,0);
    } ,[]);

    //
    const [openPortionsSelect, setOpenPortionsSelect] = useState(false);

    const handleClosePortions = () => {
        setOpenPortionsSelect(false);
    }

    const handleOpenPortions = () => {
        setOpenPortionsSelect(true);
    };

    useEffect(() => {
      const handleScroll = () => {
        if (openPortionsSelect) {
          handleClosePortions();
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [openPortionsSelect]);

    const ref = useRef(null);


    //backend 

    const [serviceData, setServiceData] = useState([]);
    const [courseData, setCourseData] = useState([]);

    useEffect(() => {
        fetchDataFromApi(`/api/service?filterKey=سلولی، مولکولی و ژنتیک`).then((res) => {
            setServiceData(res);
        });

        fetchDataFromApi(`/api/course?filterKey=سلولی، مولکولی و ژنتیک`).then((res) => {
            setCourseData(res);
        })
    }, []);

    const fieldName = "سلولی، مولکولی و ژنتیک";



    return (
        <>
        <div className="feildCellularAndMolecular">
            
            <FieldsBanner name={'سلولی، مولکولی و ژنتیک'} ref={ref} />

            <div className="container">
                <div className="section" ref={ref}>
                    <div className="d-flex align-items-center p-1 cursor" onClick={openSectionOne}>
                        <h1>دوره های آموزشی</h1>
                        {
                            sectionOneIndex === false ? <span><IoIosArrowDown /></span> : <span><IoIosArrowUp /></span>
                        }
                    </div>
                    {
                        sectionOneIndex === true &&
                        <>
                    <div className="courseList">
                        <div className="row">
                            {
                                courseData?.length !== undefined && courseData?.length !== 0 && courseData?.map((item, index) => {
                                    return(
                                        <div className="col-12 col-md-6 col-lg-3" key={index}>
                                            <CourseCard item={item} />
                                        </div>  
                                    )
                                })
                            }                          
                        </div>
                    </div>
                    <div className="text-center py-1 mb-4 viewAllCourses">
                        <Link to='/courseShop'>
                            <Button>مشاهده تمامی دوره ها</Button>
                        </Link>
                    </div>
                    </>
                    }
                </div>

                <div className="section">
                   <div className="d-flex align-items-center cursor p-1" onClick={openSectionTwo}>
                        <h1>مقالات و مطالب آموزشی</h1>
                        {
                            sectionTwoIndex === false ? <span><IoIosArrowDown /></span> : <span><IoIosArrowUp /></span>
                        }
                    </div>
                    {
                        sectionTwoIndex === true &&
                        <>
                        <div className="articleItem">
                            <div className="d-flex align-items-center">
                                <SiMicrogenetics />
                                <p className="mb-0">روش های شناخت واکنش های زنجیره ای پلیمراز</p>
                                <Link className="mx-5" to='/'>
                                    <span className="mobileHide">مشاهده مقاله</span>
                                    <span className="desktopHide"><FaEye /></span>
                                </Link>
                            </div>
                        </div>
                        <div className="articleItem">
                            <div className="d-flex align-items-center">
                                <SiMicrogenetics />
                                <p className="mb-0">روش های شناخت واکنش های زنجیره ای پلیمراز</p>
                                <Link className="mx-5" to='/'>
                                    <span className="mobileHide">مشاهده مقاله</span>
                                    <span className="desktopHide"><FaEye /></span>
                                </Link>
                            </div>
                        </div>
                        <div className="articleItem">
                            <div className="d-flex align-items-center">
                                <SiMicrogenetics />
                                <p className="mb-0">روش های شناخت واکنش های زنجیره ای پلیمراز</p>
                                <Link className="mx-5" to='/'>
                                    <span className="mobileHide">مشاهده مقاله</span>
                                    <span className="desktopHide"><FaEye /></span>
                                </Link>
                            </div>
                        </div>
                        <div className="articleItem">
                            <div className="d-flex align-items-center">
                                <SiMicrogenetics />
                                <p className="mb-0">روش های شناخت واکنش های زنجیره ای پلیمراز</p>
                                <Link className="mx-5" to='/'>
                                    <span className="mobileHide">مشاهده مقاله</span>
                                    <span className="desktopHide"><FaEye /></span>
                                </Link>
                            </div>
                        </div>
                        <div className="articleItem">
                            <div className="d-flex align-items-center">
                                <SiMicrogenetics />
                                <p className="mb-0">روش های شناخت واکنش های زنجیره ای پلیمراز</p>
                                <Link className="mx-5" to='/'>
                                    <span className="mobileHide">مشاهده مقاله</span>
                                    <span className="desktopHide"><FaEye /></span>
                                </Link>
                            </div>
                        </div>
                        <div className="articleItem">
                            <div className="d-flex align-items-center">
                                <SiMicrogenetics />
                                <p className="mb-0">روش های شناخت واکنش های زنجیره ای پلیمراز</p>
                                <Link className="mx-5" to='/'>
                                    <span className="mobileHide">مشاهده مقاله</span>
                                    <span className="desktopHide"><FaEye /></span>
                                </Link>
                            </div>
                        </div>
                        
                        <br />
                        </>
                    }
                </div>

                <div className="section">
                    <div className="d-flex align-items-center cursor p-1" onClick={openSectionThree}>
                        <h1>خدمات</h1>
                        {
                            sectionThreeIndex === false ? <span><IoIosArrowDown /></span> : <span><IoIosArrowUp /></span>
                        }
                    </div>
                    {
                        sectionThreeIndex === true &&
                        <>
                        <div className="text-center info">
                            <h5>خدمات ارائه شده در این بخش</h5>
                        </div>
                        <div className="serviceAnformaticSection">
                        <div className="row mt-4">
                            {
                                serviceData?.length !== undefined && serviceData?.length !== 0 && serviceData?.map((item, index) => {
                                    return(
                                        <div className="col-12 col-md-6 col-lg-3" key={index}>
                                            <div class="overlap-container">
                                                <div class="bottom-div"></div>
                                                <div class="top-div text-center">
                                                    <p>{item?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        
                        </div>
                        
                        <div className="serviceForm">
                            <div className="text-center">
                                <h1>درخواست خود را برای ما ارسال کنید</h1>
                                <p>تمامی خدمات توسط ما ارائه می شود</p>
                            </div>

                            <form>

                                

                                {/*<div className="row container">
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label>نام و نام خانوادگی</label>
                                            <input className="w-100" type="text" />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label>شماره تماس</label>
                                            <input className="w-100" type="text" />
                                        </div>
                                    </div>
                                </div>
                                <br />
                                

                                <div className="row container specialMobile">
                                    <div className="col-12">
                                        <label>خدمات</label>
                                        <br />
                                        <FormControl className="w-100">
                                            <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                multiple
                                                value={personName}
                                                onChange={handleChange}
                                                input={<OutlinedInput />}
                                                renderValue={(selected) => selected.join(', ')}
                                                MenuProps={MenuProps}
                                                open={openPortionsSelect}
                                                onClose={handleClosePortions}
                                                onOpen={handleOpenPortions}
                                            >
                                            {serviceData?.length !== undefined && serviceData?.length !== 0 && serviceData?.map((item, index) => (
                                                <MenuItem key={index} value={item?.name}>
                                                    <Checkbox checked={personName.includes(item?.name)} />
                                                    <ListItemText primary={item?.name} />
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                {
                                    personName.length !== 0 &&
                                    <div className="container serviceNotifier">
                                        <p>
                                            شما &nbsp;<span className="badge">{personName.length}</span>&nbsp; نوع از خدمات را انتخاب کردید.
                                        </p>
                                    </div>
                                }*/}

                                <div className="w-100 mb-4 btnWrapper">
                                    <Link to={`/service?fieldName=${encodeURIComponent(fieldName)}`}>
                                        <Button className="w-100">ثبت درخواست</Button>
                                    </Link>
                                </div>

                            </form>
                        </div>

                        </>
                    }
                            </div>
                        </div>

        </div>
        </>
    );
}
 
export default FieldOne;