'use client';

import { useEffect, useId, useRef, useState } from 'react';
import bobatron from '@/src/lib/bobatron';

export default function BTUnderlayContainer(props: any) {
    const ref = useRef<HTMLElement | null>(null);
    const Tag = props.as || 'div';

    const [path, setPath] = useState<string>('');
    const [rect, setRect] = useState<number[]>([0, 0]);

    const [styles, setStyles] = useState({
        borderWidth: '0px',
        borderColor: 'transparent',
        backgroundColor: 'transparent',
    });

    const maskId = useId();

    const updateSVG = () => {
        if (!ref.current) return;
        const el = ref.current;

        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const cm = bobatron.calculateCornerMultiplier(el);
        setRect([w, h]);
        setPath(bobatron.makeClipPath(w, h, cm));

        if (!el.dataset.btInitialized) {
            el.style.border = 'none';
            el.style.backgroundColor = 'transparent';
            el.dataset.btInitialized = '1';
        }
    };

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            // if (ref.current) bobatron.apply(ref.current);
            updateSVG();
        });

        if (!ref.current) return;
        const el = ref.current;

        const computed = getComputedStyle(el);
        setStyles({
            borderWidth: computed.borderWidth,
            borderColor: computed.borderColor,
            backgroundColor: computed.backgroundColor,
        });
        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <Tag
            ref={ref}
            onClick={props.onClick}
            {...props}
            className={`${props.className} relative`}
        >
            <svg
                className="absolute inset-0 pointer-events-none z-[-1]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${rect[0]} ${rect[1]}`}
            >
                <defs>
                    <mask id={`bobatronUnderlayMask-${maskId}`}>
                        <rect width={rect[0]} height={rect[1]} fill="black" />
                        <path d={path} fill="white" />
                    </mask>
                </defs>

                <rect
                    width={rect[0]}
                    height={rect[1]}
                    fill={styles.backgroundColor}
                    mask={`url(#bobatronUnderlayMask-${maskId})`}
                />

                <path
                    d={path}
                    fill="none"
                    stroke={styles.borderColor}
                    strokeWidth={parseFloat(styles.borderWidth) * 2}
                    mask={`url(#bobatronUnderlayMask-${maskId})`}
                />
            </svg>
            {props.children}
        </Tag>
    );
}
