import imgServiceAnformatic from "./../../assets/ServiceAnformaticImg.jpeg";

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { fetchDataFromApi, postData } from "../../utils/api";

import { MyContext } from "../../App";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSearchParams } from "react-router-dom";
import { MdSupportAgent } from "react-icons/md";

const ITEM_HEIGHT = 70;
const ITEM_PADDING_TOP = 12;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
    'سلولی، مولکولی و ژنتیک',
    'میکروبیولوژی',
    'نانوفناوری',
    'خدمات عمومی',
    'زیست پزشکی',
    'بالینی و مدل حیوانی',
];

const COOLDOWN_SECONDS = 300; // how long the user must wait to resubmit

const Service = () => {

    useEffect(() => {
        context.setIsShowFooter(true); 
        context.setIsShowNavbar(true);
        context.setIsShowCalenderBar(true);

        window.scrollTo(0, 0);
    }, []);

    const [formFields, setFormFields] = useState({
        reqName: [],
        name: '',
        phone: '',
        userId: ''
    });

    const context = useContext(MyContext);

    const [personName, setPersonName] = useState('');
    const [serviceName, setServiceName] = useState([]);
    
    const handleChange = (event) => {
        setPersonName(event.target.value);
    };

    const handleChangeServiceName = (event) => {
        const {
          target: { value },
        } = event;
        setServiceName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [openPortionsSelect, setOpenPortionsSelect] = useState(false);
    const [openServiceSelect, setOpenServiceSelect] = useState(false);
    
    const handleClosePortions = () => {
        setOpenPortionsSelect(false);
    }

    const handleCloseServiceSelect = () => {
        setOpenServiceSelect(false);
    }

    const handleOpenPortions = () => {
        setOpenPortionsSelect(true);
    };

    const handleOpenServiceSelect = () => {
        setOpenServiceSelect(true);
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

    useEffect(() => {
        const handleScroll = () => {
            if (openServiceSelect) {
                handleCloseServiceSelect();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [openServiceSelect]);

    const ref = useRef(null);

    // cool down
    const [cooldown, setCooldown] = useState(0);

    const cooldownKey = useMemo(
        () => `formCooldown:${formFields.userId || "anon"}`,
        [formFields.userId]
    );

    useEffect(() => {
        const storedUntil = localStorage.getItem(cooldownKey);
        if (!storedUntil) return;
            const msRemaining = Number(storedUntil) - Date.now();
        if (msRemaining > 0) {
            setCooldown(Math.ceil(msRemaining / 1000));
        }else{
            localStorage.removeItem(cooldownKey);
        }
    }, [cooldownKey]);

    // 3) Tick the countdown once per second while active
    useEffect(() => {  
        if (cooldown <= 0) return;
            const id = setInterval(() => {
            setCooldown((s) => {
                const next = s - 1;
                if (next <= 0) localStorage.removeItem(cooldownKey);
                    return Math.max(0, next);
                });
        }, 1000);
      return () => clearInterval(id);
    }, [cooldown, cooldownKey]);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };


    //

    //backend

    const [searchParams] = useSearchParams();
    const fieldName = searchParams.get("fieldName");
    useEffect(() => {
        if(fieldName !== null){
            setPersonName(fieldName);
        }
        window.scrollTo(0, 600);
    }, [fieldName]);

    const [serviceData, setServiceData] = useState([]);

    useEffect(() => {
        fetchDataFromApi(`/api/service?filterKey=${personName}`).then((res) => {
            setServiceData(res);
        });
    }, [personName]);

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name] : e.target.value
        }));
    }

    useEffect(() => {
        if (context.isLoggedIn === true) {
            const user = JSON.parse(localStorage.getItem("user"));

            fetchDataFromApi(`/api/client/${user?.userId}`).then((res) => {
                setFormFields((prev) => ({
                    ...prev,
                    name: `${user?.name} ${user?.lastName}`,
                    userId: user?.userId,
                    phone: res.phone
                }));
            });
        }
    }, [context.isLoggedIn]);

    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const history = useNavigate();

    const sendRequest = (e) => {
        e.preventDefault();
        if (cooldown > 0) return;

        formFields.reqName = serviceName;

        if(context?.isLoggedIn === true){
            try {
                if(formFields.name === ""){
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "نام را وارد کنید!"
                    });
                    return false;
                }

                if(formFields.phone === ""){
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "شماره تماس را وارد کنید!"
                    });
                    return false;
                }

                if(formFields.reqName.length === 0){
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "حداقل یک خدمت باید انتخاب شود!"
                    });
                    return false;
                }

                setLoader(true);
                setBtnDisabled(true);

                postData('/api/request/create', formFields).then((res) => {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "درخواست با موفقیت ثبت شد!"
                    });

                    setLoader(false);
                    setTimeout(() => {
                        setBtnDisabled(false);
                    }, 1000);

                    setServiceName([]);
                });

                // start cooldown
                const until = Date.now() + COOLDOWN_SECONDS * 1000;
                localStorage.setItem(cooldownKey, String(until));
                setCooldown(COOLDOWN_SECONDS);

            } catch (error) {
                console.log(error);

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "مشکلی در ثبت درخواست وجود دارد!"
                });
            }
        }
        else{
            history('/login');
            
            context.setAlertBox({
                open: true,
                error: true,
                msg: "برای ثبت درخواست وارد حساب کاربری خود شوید!"
            });
        }
    }


    return (
        <>
        <div className="container serviceAnformaticSection">

            <div className="text-center imgWrapper">
                <img src={imgServiceAnformatic} />
            </div>
            <div className="text-center info">
                <h1>خدمات اوژن</h1>
            </div>
            <div className="fieldSelection mt-4">
                <InputLabel id="demo-simple-select-label" className="my-1">حوزه خدمات را انتخاب کنید:</InputLabel>
                <FormControl className="w-100">
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput />}
                        MenuProps={MenuProps}
                        open={openPortionsSelect}
                        onClose={handleClosePortions}
                        onOpen={handleOpenPortions}
                    >
                    {names.map((name) => (
                         <MenuItem value={name}>{name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </div>
            <div className="row mt-4">
                {
                    serviceData?.length !== undefined && serviceData?.length !== 0 && serviceData?.map((item, index) => {
                        return(
                            <div className="col-12 col-lg-4" key={index}>
                                <div class="overlap-container">
                                    <div class="bottom-div"></div>
                                    <div class="top-div text-center">
                                        <p className="serviceItemText">{item?.name}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>


            <div className="serviceForm">
                <div className="text-center">
                    <h1>درخواست خود را برای ما ارسال کنید</h1>
                    <p>تمامی خدمات توسط ما ارائه می شود</p>
                </div>

                <form onSubmit={sendRequest}>

                <div className="row container">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>نام و نام خانوادگی</label>
                            <input name="name" onChange={inputChange} value={formFields.name} disabled={context.isLoggedIn === true} className="w-100" type="text" />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>شماره تماس</label>
                            <input name="phone" onChange={inputChange} value={formFields.phone} disabled={context.isLoggedIn === true} className="w-100" type="text" />
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
                                value={serviceName}
                                onChange={handleChangeServiceName}
                                input={<OutlinedInput />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                                open={openServiceSelect}
                                onClose={handleCloseServiceSelect}
                                onOpen={handleOpenServiceSelect}
                            >
                            {serviceData?.length !== undefined && serviceData?.length !== 0 && serviceData?.map((item, index) => (
                                <MenuItem key={index} value={item?.name}>
                                    <Checkbox checked={serviceName.includes(item?.name)} />
                                    <ListItemText primary={item?.name} />
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {
                    serviceName.length !== 0 &&
                    <div className="container serviceNotifier">
                        <p>
                            شما &nbsp;<span className="badge">{serviceName.length}</span>&nbsp; نوع از خدمات را انتخاب کردید.
                        </p>
                    </div>
                }

                <div className="w-100 mb-4 btnWrapper">
                    <Button type="submit" className={`w-100 ${btnDisabled !== false && 'btnDisabled'}`} disabled={cooldown > 0}>
                        ثبت درخواست
                        {
                            loader === true && 
                            <CircularProgress
                                sx={() => ({
                                    color: '#000',
                                    marginRight: '15px',
                                })}
                                enableTrackSlot size="25px" 
                            />
                        }
                    </Button>
                </div>

                </form>

                {cooldown > 0 && (
                  <div className="col-12 mt-2 mx-4 mb-2">
                    <small className="text-muted">
                        برای ارسال دوباره، لطفاً {`${formatTime(cooldown)}`} ثانیه صبر کنید.
                    </small>
                  </div>
                )}
            </div>
        </div>
        </>
    ); 
}
 
export default Service;