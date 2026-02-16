import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FaGraduationCap } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";

const TabsHome = () => {

    const [courseData, setCourseDate] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/course').then((res) => {
                setCourseDate(res);
            })
    }, []);

    return (
        <>
        <div className="tabSectionHome">
            <div className="container">
                <div className="row">
                    <div className="col mx-3">
                        <div className="text-center">
                            {/*<span>{courseData?.length !== undefined ? courseData?.length : +37}+</span>*/}
                            <span>110+</span>
                            <h1>دوره آموزشی تخصصی</h1>
                            <LiaChalkboardTeacherSolid />
                        </div>
                    </div>
                    <div className="col mx-3">
                        <div className="text-center">
                            <span>4413+</span>
                            <h1>دانشجوی فارغ التحصیل</h1>
                            <FaGraduationCap />
                        </div>
                    </div>
                    <div className="col mx-3">
                       <div className="text-center">
                            <span>870+</span>
                            <h1>مدرک فنی و حرفه ای</h1>
                            <IoDocumentTextSharp />
                       </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
 
export default TabsHome;