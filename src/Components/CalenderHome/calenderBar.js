import Button from "@mui/material/Button";


const CalenderBar = () => {

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/WinterCalender.pdf"; // file path in public folder
        link.download = "/WinterCalender.pdf";
        link.click();
    }

    return (
        <>
        <div className="w-100 calenderBar d-flex align-items-center justify-content-center">
                <p>تقویم تابستان منتشر شد!</p>
                <Button onClick={handleDownload}>مشاهده تقویم</Button>
        </div>
        </>
    );
}
 
export default CalenderBar;