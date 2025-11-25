'use client';

import { useSearch } from '@/src/contexts/SearchContext';
import { useEffect, useRef, useState } from 'react';
import ProductCard from '@/src/components/ProductCard';
import TransitionSwitcher from '@/src/ui/TransitionSwitcher';
import Text from '@/src/ui/Text';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { lora } from '@/src/app/fonts';

export default function SearchResults() {
    const { searchActive, searchLoading, searchMode, resultProducts, searchQuery } = useSearch();
    const { t } = useDictionary();

    const [showResults, setShowResults] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const el = ref.current;

        if (searchActive) {
            setTimeout(() => {
                el.style.display = 'flex';
            }, 300);
            setTimeout(() => {
                setShowResults(true);
            }, 400);
        } else {
            el.style.display = 'none';
            setShowResults(false);
        }
    }, [searchActive]);

    return (
        <div
            ref={ref}
            className={`
                ${showResults ? 'opacity-100' : 'opacity-0'} 
                pt-[calc(228px)] w-full min-h-full justify-center
                duration-300
            `}
        >
            <TransitionSwitcher
                trigger={`${searchLoading}${searchActive}`}
                className={`w-full max-w-[1300px] h-full flex gap-[16px] flex-wrap`}
            >
                {searchLoading && (
                    <div className={`w-full h-full flex items-center justify-center`}>
                        <div className="circle-spin-1" />
                    </div>
                )}

                {searchQuery.length <= 2 && (
                    <div className={`w-full h-full flex items-center justify-center`}>
                        <Text as={`h1`} className={`${lora.className} text-center`}>
                            {t('search.shortQuery')}
                        </Text>
                    </div>
                )}

                {!searchLoading && searchQuery.length > 2 && searchMode === 'products' && (
                    <>
                        {resultProducts.length === 0 && (
                            <div className={`w-full h-full flex items-center justify-center`}>
                                <Text as={`h1`} className={`${lora.className}`}>
                                    {t('search.notFound')}
                                </Text>
                            </div>
                        )}

                        {resultProducts.map((item, i) => (
                            <ProductCard key={i} product={item} />
                        ))}
                    </>
                )}
            </TransitionSwitcher>
        </div>
    );
}
