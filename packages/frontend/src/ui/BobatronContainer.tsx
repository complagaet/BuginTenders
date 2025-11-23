'use client';

import React, { useEffect, useRef } from 'react';
import bobatron from '@/src/lib/bobatron';

export default function BobatronContainer(props: any) {
    const ref = useRef<HTMLElement | null>(null);
    const Tag = props.as || 'div';

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (ref.current) bobatron.apply(ref.current);
        });

        if (ref.current) observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <Tag
            ref={ref}
            className={`bobatron flex ${props.className}`}
            style={{ ...props.style }}
            onClick={props.onClick}
            {...props}
        >
            {props.children}
        </Tag>
    );
}
