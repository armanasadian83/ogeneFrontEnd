import { useContext } from "react";
import Logo from "./../../assets/baleLogo.png";
import { MyContext } from "../../App";

const BaleAlert = () => {

    const context = useContext(MyContext);

    return (
        <>
        <div className="baleAlert">
            <div className="logoWrapper">
                <div className="d-flex align-items-center">
                    <a href="https://ble.ir/ogenetech" target="_blank">
                        <img src={Logo} />
                    </a>
                    <div className="text d-flex align-items-center">
                        <p className="mb-0 text-nowrap">در چنل بله ما عضو شوید!</p>

                        <span className="svg" onClick={() => context.setIsBaleIconShown(false)}>&times;</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
 
export default BaleAlert;