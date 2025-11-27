import { ReactElement, HTMLAttributes, useState } from 'react';

import BobatronContainer from '@/src/ui/BobatronContainer';

type ButtonProps = HTMLAttributes<HTMLDivElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'custom';
    onClick?: () => any;
};

export default function Button({
    variant = 'outline',
    onClick,
    className,
    children,
    ...rest
}: ButtonProps): ReactElement {
    const [onClickReaction, setOnClickReaction] = useState(false);

    function onClickFunction(callback: (() => any) | undefined) {
        if (callback) callback();

        setOnClickReaction(true);
        setTimeout(() => {
            setOnClickReaction(false);
        }, 300);
    }

    return (
        <BobatronContainer
            {...rest}
            onClick={() => onClickFunction(onClick)}
            as={`button`}
            className={`
                min-w-[40px] min-h-[40px] pl-[10px] pr-[10px] rounded-[10px]
                flex items-center
                text-[16px] leading-[18px]
                transition-[background-color,height] duration-300 cursor-pointer
                ${variant === 'outline' ? 'bg-white hover:bg-gray-100' : ''}
                ${variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                ${variant === 'secondary' ? 'bg-gray-500 hover:bg-gray-600 text-white' : ''}
                ${variant === 'destructive' ? 'bg-red-200 hover:bg-red-400' : ''}
                ${className}
            `}
        >
            <div
                className={`
                    flex w-fit h-fit gap-[8px] 
                    transition-[scale] duration-300
                    ${onClickReaction ? 'scale-90' : ''}
                `}
            >
                {children}
            </div>
        </BobatronContainer>
    );
}
