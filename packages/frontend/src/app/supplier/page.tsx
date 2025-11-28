'use client';

import { useEffect } from 'react';
import { useUI } from '@/src/contexts/UIContext';
import { useSearchParams } from 'next/navigation';
import SupplierSearchResults from '@/src/components/SupplierSearch/SupplierSearchResults';

export default function Home() {
    const { setShowOverlay, setOverlayLogo } = useUI();

    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const c = searchParams.get('c') || '';

    useEffect(() => {
        if (!q || !c) {
            setOverlayLogo('bugintenders+ertensabaq');
            setTimeout(() => {
                window.location.href = '/';
            }, 400);
            return;
        }

        setOverlayLogo('bugintenders');
        setTimeout(() => {
            setShowOverlay(false);
        }, 1000);

        setTimeout(() => {
            setOverlayLogo('bugintenders+ertensabaq');
        }, 2000);
    }, []);

    return (
        <div className={`w-full h-full flex flex-col items-center pt-[calc(40px+16px)]`}>
            <SupplierSearchResults name={q} category={c} />
        </div>
    );
}
