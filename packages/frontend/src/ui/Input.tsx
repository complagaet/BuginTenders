import React, { InputHTMLAttributes } from 'react';
import BobatronContainer from '@/src/ui/BobatronContainer';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
    return (
        <BobatronContainer
            {...props}
            as="input"
            className={`
                flex items-center min-w-[250px] min-h-[40px] h-[40px] gap-[8px] pl-[10px] pr-[10px] bg-[#FFFFFF] rounded-[10px]
                transition-[background-color] duration-300 -hover:bg-[#D9D9D9] -focus:bg-[#D9D9D9] cursor-pointer 
                ${props.className || ''}
            `}
        />
    );
};

export default Input;
