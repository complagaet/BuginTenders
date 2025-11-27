'use client';

import Text from '@/src/ui/Text';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { lora } from '@/src/app/fonts';
import Button from '@/src/ui/Button';
import { useSearch } from '@/src/contexts/SearchContext';
import SearchFilters from '@/src/components/Search/SearchFilters';
import SearchModeSelector from '@/src/components/Search/SearchModeSelector';
import SearchChips from '@/src/components/Search/SearchChips';
import { useEffect, useRef, useState } from 'react';
import SearchBar from '@/src/components/Search/SearchBar';
import { ArrowLeft, ArrowUp, Funnel } from 'lucide-react';
import TransitionSwitcher from '@/src/ui/TransitionSwitcher';

export default function SearchScreen() {
    const { t } = useDictionary();
    const { showFilters, setShowFilters, searchMode, searchActive, setSearchActive } = useSearch();

    const [scrolled, setScrolled] = useState<boolean>(false);

    const searchHeaderParkingRef = useRef<HTMLDivElement>(null);
    const searchCenterParkingRef = useRef<HTMLDivElement>(null);
    const searchBarContainerRef = useRef<HTMLDivElement>(null);
    const searchScreenContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const threshold = 120;

        const handleScroll = () => {
            const y = window.scrollY;

            if (y > threshold) {
                console.log('11');
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const targetRef = searchActive ? searchHeaderParkingRef : searchCenterParkingRef;

        if (!targetRef.current || !searchBarContainerRef.current) return;

        const el = searchBarContainerRef.current;

        el.style.transition = 'top 0.4s, left 0.4s, width 0.4s';

        const timeout = setTimeout(() => {
            el.style.transition = 'none';
        }, 400);

        let frame: number;

        const track = () => {
            if (targetRef.current) {
                const rect = targetRef.current.getBoundingClientRect();
                Object.assign(el.style, {
                    top: `${rect.top}px`,
                    left: `${rect.left}px`,
                    width: `${rect.width}px`,
                });
            }

            frame = requestAnimationFrame(track);
        };

        frame = requestAnimationFrame(track);

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timeout);
        };
    }, [searchActive]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;

        if (!searchActive) {
            if (!searchScreenContainerRef.current) return;
            searchScreenContainerRef.current.style.display = 'flex';
        } else {
            timeout = setTimeout(() => {
                if (!searchScreenContainerRef.current) return;
                searchScreenContainerRef.current.style.display = 'none';
            }, 300);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [searchActive]);

    return (
        <>
            <div
                className={`
                    ${searchActive ? 'opacity-100' : 'opacity-0'}
                    ${scrolled ? 'pt-[calc(20px)]' : 'pt-[calc(16px+40px+16px)]'} 
                    fixed top-0 left-0 w-full flex pl-[16px] pr-[16px] flex-col items-center gap-[16px] z-5
                    transition[opacity] h-fit duration-300 
                `}
                style={{
                    background:
                        'linear-gradient(0deg,rgba(235, 231, 229, 0) 0%, rgb(235, 231, 229) 100%)',
                }}
            >
                <div
                    className={`flex flex-col gap-[16px] w-full max-w-[620px] items-center transition-300`}
                >
                    <Text
                        as={`h1`}
                        className={`
                            ${lora.className} 
                            ${searchActive ? '' : 'translate-y-[-100px]'} 
                            ${scrolled ? '!translate-y-[-100px]' : ''} 
                            duration-300`}
                    >
                        {t(`search.mode.${searchMode}`)}
                    </Text>
                    <div className={`w-full flex flex-col gap-[10px]`}>
                        <div className={`flex gap-[10px] w-full items-end justify-between`}>
                            <Button variant={'outline'} onClick={() => setSearchActive(false)}>
                                <ArrowLeft size={20} />
                            </Button>
                            <SearchChips />
                        </div>
                        <div ref={searchHeaderParkingRef} className={`w-full h-[64px]`}></div>
                    </div>
                </div>
            </div>

            <div
                onClick={() => {
                    // HACK: Костыль для великолепной iOS
                    if (searchActive) return;

                    for (let i = 1; i <= 3; i++) {
                        setTimeout(() => {
                            window.scrollTo(0, 0);
                        }, 100 * i);
                    }
                }}
                ref={searchBarContainerRef}
                className={`fixed z-50`}
            >
                <SearchBar />
            </div>

            <div
                ref={searchScreenContainerRef}
                className={`w-full h-full flex flex-col items-center justify-center`}
            >
                <div
                    className={`
                    ${searchActive ? 'opacity-0' : 'opacity-100'}
                    flex flex-col gap-[16px] w-full max-w-[620px] items-center duration-300
                `}
                >
                    <Text as={`h1`} className={`${lora.className}`}>
                        {t('text.welcome')}
                    </Text>
                    <Text
                        as={`p`}
                        className={`text-center duration-300 ${showFilters ? 'max-h-0 opacity-0 scale-95 mt-[-16px]' : 'max-h-[200px] opacity-100 scale-100'}`}
                    >
                        {t('text.description')}
                    </Text>

                    <div className={`w-full flex flex-col gap-[10px]`}>
                        <SearchChips />
                        <div ref={searchCenterParkingRef} className={`w-full h-[64px]`}></div>
                    </div>

                    <div className={`flex w-full justify-between pl-[16px] pr-[16px]`}>
                        <SearchModeSelector />

                        <div
                            className={`${searchMode === 'products' ? 'scale-75 opacity-0' : ''} duration-300`}
                        >
                            <Button
                                variant={`custom`}
                                className={`text-white bg-[#2E2E2E] hover:bg-[#000000]`}
                                onClick={() => setShowFilters((prev: boolean) => !prev)}
                            >
                                <TransitionSwitcher trigger={showFilters}>
                                    {showFilters ? <ArrowUp size={20} /> : <Funnel size={20} />}
                                </TransitionSwitcher>
                                <p className={`hidden sm:block`}>{t('text.filters')}</p>
                            </Button>
                        </div>
                    </div>

                    <SearchFilters />
                </div>
            </div>
        </>
    );
}
