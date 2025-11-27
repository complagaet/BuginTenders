'use client';

import React, { useEffect, useRef, useState } from 'react';

type HeightWrapperProps = {
    children: React.ReactNode;
    className?: string;
};

export default function HeightWrapper({ children, className = '' }: HeightWrapperProps) {
    const [ready, setReady] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        el.style.height = `${ref.current.offsetHeight}px`;
        el.style.maxHeight = `${ref.current.offsetHeight}px`;
        setReady(true);
    }, []);

    return (
        <div
            ref={ref}
            className={`w-full h-full flex flex-col gap-[10px] overflow-auto ${className}`}
        >
            <div className={`w-full h-full ${ready ? 'flex' : 'hidden'}`}>{children}</div>
        </div>
    );
}
