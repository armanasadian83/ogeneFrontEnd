import { useEffect, useState } from "react";

const OtpInput = ({length, onChange}) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));

    useEffect(() => {
        document?.getElementById('otp-input-0').focus();
    }, []);

    const handleChange = (element, index) => {
        const value = element.value;
        if(isNaN(value)) return; // Only Numbers allowed

        // update OTP value
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(""));

        // focus on next input
        if(value && index < length - 1){
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    }

    const handleKeyDown = (event, index) => {
        if(event.key === "Backspace" && !otp[index] && index > 0){
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    }

    return (
        <>
        <div style={{display: 'flex', gap: '5px', justifyContent: 'center', direction: 'ltr'}} className="optBox">
            {
                otp.map((data, index) => {
                    return(
                        <input key={index} id={`otp-input-${index}`} type="text" maxLength='1'
                        value={otp[index]}  onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}   
                        style={{
                            width: '45px',
                            height: '45px',
                            textAlign: 'center',
                            fontSize: '17px',
                            direction: 'ltr !important',
                            borderRadius: '15px'
                        }}
                    />
                    )
                })
            }
        </div>
        </>
    );
}
 
export default OtpInput;