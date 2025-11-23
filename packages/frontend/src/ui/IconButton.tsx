'use client'

import BobatronContainer from '@/src/ui/BobatronContainer';
import Text from '@/src/ui/Text';
import React, { useState } from 'react';

type IconButtonProps = {
    noOnClickReaction?: boolean
    onClick?: () => any
    noHover?: boolean
    className?: string
    children: React.ReactNode
}

function IconButton({ noOnClickReaction, onClick, noHover, className, children } : IconButtonProps) {
    const [onClickReaction, setOnClickReaction] = useState(false);

    function onClickFunction(callback: (() => any) | undefined) {
        if (callback) callback();

        if (noOnClickReaction) return;

        setOnClickReaction(true);
        setTimeout(() => {
            setOnClickReaction(false);
        }, 300);
    }

    return (
        <button
            className={`
                flex items-center gap-[8px] 
                ${!noHover ? 'duration-300 hover:scale-[1.1] hover:drop-shadow-xl' : ''} 
                ${onClickReaction ? '!scale-[0.9]' : ''}
                cursor-pointer ${className}
            `}
            onClick={() => onClickFunction(onClick)}
        >
            {children}
        </button>
    );
}

type IconButtonFrameProps = {
    className?: string
    children: React.ReactNode
    color?: string;
}

function IconButtonFrame({ className, children, color } : IconButtonFrameProps) {
    return (
        <BobatronContainer
            className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center ${className}`}
            style={{ backgroundColor: color ? color : '' }}
        >
            {children}
        </BobatronContainer>
    );
}

type IconButtonLabelProps = {
    className?: string
    children: React.ReactNode
}

function IconButtonLabel({ className, children }: IconButtonLabelProps) {
    return (
        <Text as={'h2'} className={`text-left ${className}`}>
            {children}
        </Text>
    );
}

export default IconButton;
export { IconButton, IconButtonFrame, IconButtonLabel };
