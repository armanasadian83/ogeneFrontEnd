import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { IoArrowBackOutline } from "react-icons/io5";

import { MyContext } from "../../App";

const CourseCard = (props) => {

    const context = useContext(MyContext);

    const [courseData, setCourseDate] = useState();

    useEffect(() => {
        if (props?.id) {
            context.setProgress(30);
            fetchDataFromApi(`/api/course/${props?.id}`).then((res) => {
                if (res !== undefined && res !== null && res !== '') {
                    setCourseDate(res);
                }
                context.setProgress(100);
            })
        }
    }, [props?.id]);

    // normalize data source: either passed directly via props.item, or fetched via props.id
    const data = props?.id ? courseData : props?.item;

    if (props?.id && !courseData?.images) {
        return null; // matches original behavior: render nothing until fetched data with images arrives
    }

    return (
        <div className="courseCard">
            <div className="courseImgWrapper">
                <img src={data?.images && data.images[0]} />
                <span className="courseBadge">دوره آموزشی</span>
            </div>
            <div className="courseCardBody">
                <p className="courseTitle">{data?.name && data.name.substring(0, 62)}</p>
                <Link to={`/course/${data?.id}`} className="courseCardLink">
                    <Button className="courseCardBtn">
                        مشاهده جزئیات دوره
                        <IoArrowBackOutline className="courseCardBtnIcon" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default CourseCard;