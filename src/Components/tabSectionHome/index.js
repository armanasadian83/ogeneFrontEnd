import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FaGraduationCap } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { useEffect, useState, useRef } from "react";
import { fetchDataFromApi } from "../../utils/api";

/* Reusable count-up hook — animates from 0 to target when the card scrolls into view */
const useCountUp = (target, duration = 1500) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const startTime = performance.now();

                    const step = (now) => {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(step);
                        else setCount(target);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return [count, ref];
};

const StatCard = ({ icon, value, label, variant }) => {
    const [count, ref] = useCountUp(value);

    return (
        <div className={`statCard ${variant}`} ref={ref}>
            <span className="ghostIcon">{icon}</span>
            <div className="statIconWrapper">{icon}</div>
            <span className="statNumber">+{count.toLocaleString('fa-IR')}</span>
            <h3 className="statLabel">{label}</h3>
        </div>
    );
};

const TabsHome = () => {

    /*const [courseData, setCourseDate] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/course').then((res) => {
            setCourseDate(res);
        })
    }, []);*/

    const stats = [
        {
            icon: <LiaChalkboardTeacherSolid />,
            value: 110,
            label: 'دوره آموزشی تخصصی',
            variant: 'variant1'
        },
        {
            icon: <FaGraduationCap />,
            value: 4413,
            label: 'دانشجوی فارغ التحصیل',
            variant: 'variant2'
        },
        {
            icon: <IoDocumentTextSharp />,
            value: 870,
            label: 'مدرک فنی و حرفه ای',
            variant: 'variant3'
        },
    ];

    return (
        <>
            <div className="tabSectionHome">
                <div className="container">
                    <div className="statsRow">
                        {stats.map((stat, i) => (
                            <StatCard key={i} icon={stat.icon} value={stat.value} label={stat.label} variant={stat.variant} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TabsHome;