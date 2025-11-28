'use client';

import SearchScreen from '@/src/components/Search/SearchScreen';
import SearchResults from '@/src/components/SearchResults';
import { useEffect } from 'react';
import { useUI } from '@/src/contexts/UIContext';

export default function Home() {
    const { setShowOverlay, setOverlayLogo } = useUI();

    useEffect(() => {
        setOverlayLogo('bugintenders+ertensabaq');
        setTimeout(() => {
            setShowOverlay(false);
        }, 3000);

        setTimeout(() => {
            setOverlayLogo('bugintenders');
        }, 4000);
    }, []);

    return (
        <div className={`w-full h-full flex flex-col items-center`}>
            <SearchScreen />
            <SearchResults />
        </div>
    );
}
