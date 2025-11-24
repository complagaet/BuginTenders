import React, { forwardRef } from 'react';

type TextProps = {
    as?: 'h1' | 'h2' | 'p';
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

const textStyles = {
    h1: 'text-[24px] leading-[26px] font-bold mx-[5px]',
    h2: 'font-bold text-[16px] leading-[18px]',
    p: 'text-[16px] leading-[18px]',
};

const Text = forwardRef<HTMLElement, TextProps>(
    ({ as = 'p', className = '', style, children }, ref) => {
        const Component = as;
        const baseStyle = textStyles[as];

        return (
            <Component ref={ref as never} style={style} className={`${baseStyle} ${className}`}>
                {children}
            </Component>
        );
    }
);

Text.displayName = 'Text';
export default Text;
