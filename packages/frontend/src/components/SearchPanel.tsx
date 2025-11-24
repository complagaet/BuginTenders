'use client';

import BobatronContainer from '@/src/ui/BobatronContainer';
import Text from '@/src/ui/Text';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { lora } from '@/src/app/fonts';
import Chip from '@/src/ui/Chip';
import Button from '@/src/ui/Button';
import { useSearch } from '@/src/contexts/SearchContext';
import SearchFilters from '@/src/components/SearchFilters';

export default function SearchPanel() {
    const { t } = useDictionary();
    const { showFilters, setShowFilters } = useSearch();

    return (
        <div className={`flex flex-col gap-[16px] w-full max-w-[620px] items-center`}>
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
                    <Chip label={String(t('search.mode.products'))} />
                    <Chip label={`ого`} />
                    <Chip label={`вот так могу да`} />
                </div>
                <BobatronContainer
                    as={`input`}
                    className={`w-full h-[64px] rounded-[16px] bg-white pl-[16px] font-bold text-[20px]`}
                    placeholder={t('placeholder.product')}
                />
            </div>

            <div className={`flex w-full justify-between pl-[16px] pr-[16px]`}>
                <Button>{t('search.mode.products')}</Button>
                <Button
                    variant={`custom`}
                    className={`text-white bg-[#2E2E2E] hover:bg-[#000000]`}
                    onClick={() => setShowFilters((prev: boolean) => !prev)}
                >
                    {t('text.filters')}
                </Button>
            </div>

            <SearchFilters />
        </div>
    );
}
