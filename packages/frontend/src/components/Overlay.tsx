'use client';

import { useUI } from '@/src/contexts/UIContext';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';

export default function Overlay() {
    const { showOverlay, overlayLogo } = useUI();

    const [transitionClasses, setTransitionClasses] = useState<string>('');
    const [overlayTransition, setOverlayTransition] = useState<boolean>(false);

    const [isVisible, setIsVisible] = useState<boolean>(showOverlay);

    useEffect(() => {
        if (showOverlay) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTransitionClasses('opacity-0');
            setIsVisible(true);
            setTimeout(() => {
                requestAnimationFrame(() => setTransitionClasses('opacity-100'));
            }, 10);
        } else {
            requestAnimationFrame(() => setTransitionClasses('opacity-0'));
            setTimeout(() => {
                setIsVisible(false);
            }, 300);
        }
    }, [showOverlay]);

    useEffect(() => {
        if (overlayLogo !== 'bugintenders+ertensabaq') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOverlayTransition(false);
            return;
        }

        setTimeout(() => {
            setOverlayTransition(true);
        }, 1000);
    }, [overlayLogo]);

    return (
        <div
            className={`${isVisible ? 'flex' : 'hidden'} 
            fixed duration-300 flex-col items-center justify-center 
            top-0 left-0 w-full h-screen-fallback bg-[#EBE7E5] z-150 
            gap-16
            ${transitionClasses}`}
        >
            <div className={`${overlayTransition ? '-mt-16' : 'mt-0'} duration-500`}></div>

            {(overlayLogo === 'ertensabaq' || overlayLogo === 'bugintenders+ertensabaq') && (
                <img
                    src={`/ertensabaq.svg`}
                    alt={`ertensabaq...`}
                    className={`
                        w-[216px] h-[137px] duration-500 
                        ${overlayTransition ? 'min-w-[178px]! min-h-12! w-[178px]! h-12!' : ''}
                    `}
                />
            )}

            {overlayLogo === 'bugintenders' && (
                <img
                    src={`/bugin-tenders.svg`}
                    alt={`Bügın’ Tenders`}
                    className={`
                        min-w-[297px]! min-h-10! w-[297px] h-10 duration-500 
                        md:w-[calc(297px*1.5)] md:h-[calc(40px*1.5)]
                    `}
                />
            )}

            <div
                className={`${overlayTransition ? 'h-20' : 'h-0'} items-center duration-500 `}
            >
                <img
                    src={`/bugin-tenders.svg`}
                    alt={`Actomatic`}
                    className={`
                        min-w-[297px]! min-h-10! w-[297px] h-10 duration-500 
                        md:w-[calc(297px*1.5)] md:h-[calc(40px*1.5)]
                        ${overlayTransition ? '' : 'opacity-0'}
                    `}
                />
            </div>

            <div className={`${overlayTransition ? 'mt-0' : '-mt-16'} duration-300`}></div>
        </div>
    );
}
