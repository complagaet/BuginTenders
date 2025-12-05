import { FormEvent, KeyboardEvent } from 'react';
import IconButton, { IconButtonFrame } from '@/src/ui/IconButton';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { useSearch } from '@/src/contexts/SearchContext';
import usePerformSearch from '@/src/hooks/usePerformSearch';
import BTUnderlayContainer from '@/src/ui/BTUnderlayContainer';

export default function SearchBar() {
    const { t } = useDictionary();
    const { searchMode, searchQuery, setSearchQuery, searchLoading } = useSearch();

    const { performSearch } = usePerformSearch();

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (searchLoading) return;
            e.preventDefault();
            performSearch();
        }
    };

    return (
        <div className="w-full relative">
            <BTUnderlayContainer className="w-full h-16 rounded-2xl bg-white border">
                <input 
                    className={`
                        h-full w-full pl-4 z-0
                        font-bold text-[20px] text-black
                        focus:outline-none focus:ring-0 focus:border-none
                    `}
                    placeholder={String(t(`placeholder.search.mode.${searchMode}`))}
                    value={searchQuery}
                    onInput={(e: FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                />
            </BTUnderlayContainer>
            <IconButton
                onClick={() => performSearch()}
                className="absolute top-4 right-4 z-1"
            >
                <IconButtonFrame className="h-8! w-8!">
                    <img src="/icons/magnifier.svg" alt="search" />
                </IconButtonFrame>
            </IconButton>
        </div>
    );
}
