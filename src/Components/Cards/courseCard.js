import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

import { MyContext } from "../../App";

const CourseCard = (props) => {

    const context = useContext(MyContext);

    const [courseData, setCourseDate] = useState();
    useEffect(() => {
        if(props?.id){
            context.setProgress(30);
            fetchDataFromApi(`/api/course/${props?.id}`).then((res) => {
                if(res !== undefined && res !== null && res !== ''){
                    setCourseDate(res);
                }
                context.setProgress(100);
            })
        }
    }, [props?.id]);

    return ( 
        <>
        {
            !props?.id ? 
            <>
            <div className="courseCard"> 
                <div className='item'>
                    <div className="text-center cardInfo">
                        <img src={props?.item?.images[0]} />
                        <p className='mt-3'>{props?.item?.name.substring(0, 62)}</p>
                    </div>
                </div>
                <div className='cardBtn text-center'>
                    <Button>
                        <Link to={`/course/${props?.item?.id}`}>مشاهده جزئیات دوره</Link>
                    </Button>
                </div>
            </div>
            </>

            :

            courseData?.images && 

            <div className="courseCard"> 
                <div className='item'>
                    <div className="text-center cardInfo">
                        <img src={courseData?.images && courseData?.images[0]} />
                        <p className='mt-3'>{courseData?.name && courseData?.name.substring(0, 62)}</p>
                    </div>
                </div>
                <div className='cardBtn text-center'>
                    <Link to={`/course/${courseData?.id && courseData?.id}`}>
                        <Button>
                            مشاهده جزئیات دوره
                        </Button>
                    </Link>
                </div>
            </div>
        }
        </>
    );
}
 
export default CourseCard;