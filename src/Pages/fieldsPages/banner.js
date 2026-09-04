import Button from "@mui/material/Button";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const FieldsBanner = (props) => {
    const handleClick = () => {
        props.ref.current?.scrollIntoView({behavior: 'smooth'});

    };
    return (
        <>
        <div className="banner text-center w-100">
            <h1>{props.name}</h1>
            <p>دوره های آموزشی، مطالب آموزشی و خدمات</p>
                <Button onClick={handleClick}>
                    مشاهده &nbsp;&nbsp;&nbsp;&nbsp;
                    <IoIosArrowDown />
                </Button>
        </div>
        </>
    );
}
 
export default FieldsBanner;