'use client';

import BobatronContainer from '@/src/ui/BobatronContainer';
import Text from '@/src/ui/Text';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { lora } from '@/src/app/fonts';
import Chip from '@/src/ui/Chip';
import Button from '@/src/ui/Button';
import { useSearch } from '@/src/contexts/SearchContext';
import SearchFilters from '@/src/components/SearchFilters';
import IconButton, { IconButtonFrame, IconButtonLabel } from '@/src/ui/IconButton';
import SearchModeSelector from '@/src/components/SearchModeSelector';
import { FormEvent, useEffect, useRef } from 'react';

export default function SearchPanel() {
    const { t } = useDictionary();
    const {
        showFilters,
        setShowFilters,
        searchMode,
        setSearchQuery,
        searchQuery,
        searchActive,
        setSearchActive,
    } = useSearch();


    return (
        <div className={`flex flex-col gap-[16px] w-full max-w-[620px] items-center transition-300`}>
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
                <div className={`flex w-full gap-[5px]`}>
                    <Chip label={String(t(`search.mode.${searchMode}`))} />
                    <Chip label={`ого`} />
                    <Chip label={`вот так могу да`} />
                </div>

                <div className={`w-full relative`}>
                    <BobatronContainer
                        as={`input`}
                        className={`w-full h-[64px] rounded-[16px] bg-white pl-[16px] font-bold text-[20px] focus:border-none`}
                        placeholder={t(`placeholder.search.mode.${searchMode}`)}
                        value={searchQuery}
                        onInput={(e: FormEvent<HTMLInputElement>) =>
                            setSearchQuery(e.currentTarget.value)
                        }
                    />
                    <IconButton
                        onClick={() => setSearchActive((prev: boolean) => !prev)}
                        className={`absolute top-[16px] right-[16px]`}
                    >
                        <IconButtonFrame className={`!h-[32px] !w-[32px]`}>
                            <img src={`/magnifier.svg`} alt={`search`} />
                        </IconButtonFrame>
                    </IconButton>
                </div>
            </div>

            <div className={`flex w-full justify-between pl-[16px] pr-[16px]`}>
                <SearchModeSelector />

                <div
                    className={`${searchMode === 'products' ? 'scale-75 opacity-0' : ''} duration-300`}
                >
                    <Button
                        variant={`custom`}
                        className={` text-white bg-[#2E2E2E] hover:bg-[#000000]`}
                        onClick={() => setShowFilters((prev: boolean) => !prev)}
                    >
                        {t('text.filters')}
                    </Button>
                </div>
            </div>

            <SearchFilters />
        </div>
    );
}
