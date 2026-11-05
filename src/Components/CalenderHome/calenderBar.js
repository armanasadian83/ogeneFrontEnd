import { useLanguage } from "../../i18n/LanguageContext";
import Button from "@mui/material/Button";


const CalenderBar = () => {
    const { t, dir } = useLanguage();

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/mehr1405.pdf"; // file path in public folder
        link.download = "/mehr1405.pdf";
        link.click();
    }

    return (
        <>
        <div className="w-100 calenderBar d-flex align-items-center justify-content-center" dir={dir}>
                <p>{t("تقویم مهرماه منتشر شد!", "The Mehr course calendar is now available!")}</p>
                <Button onClick={handleDownload}>{t("مشاهده تقویم", "View calendar")}</Button>
        </div>
        </>
    );
}
 
export default CalenderBar;