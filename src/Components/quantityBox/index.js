import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";


const QuantityBox = (props) => {
    const [inputVal, setinputVal] = useState(props?.value ? props?.value : 1);

    /*useEffect(() => {
        if(props?.value !== undefined && props?.value !== null && props?.value !== ''){
            setinputVal(parseInt(props?.value));
        }
        else{
            setinputVal(1);
        }
    }, [props?.value]);*/

    const minus = () =>{
        if(inputVal > 1){
            setinputVal(inputVal - 1);
        }
    }

    const plus = () =>{
        setinputVal(inputVal + 1);
    }


    // vid 43 : add to cart
    useEffect(() => {
        props.quantity(inputVal);
        props.selectedItem(props.item, inputVal);
    }, [inputVal])

    return (
        <>
            <div className='quantityDrop d-flex align-items-center'>
                <Button disabled={props?.btnDisabled} onClick={minus} className={`${props?.btnDisabled !== false && 'btnDisabled'}`}><FaMinus /></Button>
                <input type='text' value={inputVal} />
                <Button disabled={props?.btnDisabled} onClick={plus} className={`${props?.btnDisabled !== false && 'btnDisabled'}`}><FaPlus /></Button>
            </div>
        </>
    );
}
 
export default QuantityBox;