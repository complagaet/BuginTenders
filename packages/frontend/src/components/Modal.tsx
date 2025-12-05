'use client';

import { useEffect, useRef, useState } from 'react';
import BobatronContainer from '@/src/ui/BobatronContainer';
import { useUI } from '@/src/contexts/UIContext';

export default function Modal() {
    const { modal, setModal } = useUI();
    const contentRef = useRef<HTMLDivElement | null>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (modal?.visible) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 50);
        } else if (isVisible) {
            setIsAnimating(false);
            const timeout = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isVisible, modal]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target as Node) &&
                modal?.closable
            ) {
                if (isVisible) setModal({});
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isVisible, modal?.closable, setModal]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-0 left-0 z-100 w-full h-screen-fallback bg-[#000000b5] flex items-center justify-center p-5 backdrop-blur-md duration-300 
                ${isAnimating ? 'opacity-100' : 'opacity-0'}
            `}
            style={{ zIndex: modal?.zIndex ?? 100 }}
        >
            <div
                ref={contentRef}
                className={`w-full h-full max-w-[800px] max-h-[600px] duration-300 transform 
                    ${isAnimating ? 'scale-100' : 'scale-110'}
                `}
            >
                <BobatronContainer className="bg-[#FBFBFB] flex flex-col w-full h-full rounded-[30px] p-4">
                    {modal?.content}
                </BobatronContainer>
            </div>
        </div>
    );
}
