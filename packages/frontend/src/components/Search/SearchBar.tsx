import BobatronContainer from '@/src/ui/BobatronContainer';
import { FormEvent } from 'react';
import IconButton, { IconButtonFrame } from '@/src/ui/IconButton';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { useSearch } from '@/src/contexts/SearchContext';
import usePerformSearch from '@/src/hooks/usePerformSearch';

export default function SearchBar() {
    const { t } = useDictionary();
    const { searchMode, searchQuery, setSearchQuery } = useSearch();

    const { performSearch } = usePerformSearch();

    return (
        <div className={`w-full relative`}>
            <BobatronContainer
                as={`input`}
                className={`w-full h-[64px] rounded-[16px] bg-white pl-[16px] font-bold text-[20px] focus:border-none`}
                placeholder={t(`placeholder.search.mode.${searchMode}`)}
                value={searchQuery}
                onInput={(e: FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
            />
            <IconButton
                onClick={() => performSearch()}
                className={`absolute top-[16px] right-[16px]`}
            >
                <IconButtonFrame className={`!h-[32px] !w-[32px]`}>
                    <img src={`/icons/magnifier.svg`} alt={`search`} />
                </IconButtonFrame>
            </IconButton>
        </div>
    );
}
