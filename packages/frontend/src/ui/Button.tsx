import { ReactElement, HTMLAttributes } from 'react';

import BobatronContainer from '@/src/ui/BobatronContainer';

type ButtonProps = HTMLAttributes<HTMLDivElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'custom';
};

export default function Button({
    variant = 'outline',
    className,
    children,
    ...rest
}: ButtonProps): ReactElement {
    return (
        <BobatronContainer
            {...rest}
            as={`button`}
            className={`
                w-min-[300px] min-h-[40px] p-[10px] rounded-[10px]
                text-[16px] leading-[18px]
                transition-[background-color] duration-300 cursor-pointer
                ${variant === 'outline' ? 'bg-white hover:bg-gray-100' : ''}
                ${variant === 'primary' ? 'bg-blue-500 text-white' : ''}
                ${variant === 'secondary' ? 'bg-gray-500 text-white' : ''}
                ${variant === 'destructive' ? 'bg-red-200 hover:bg-red-400' : ''}
                ${className}
            `}
        >
            {children}
        </BobatronContainer>
    );
}
