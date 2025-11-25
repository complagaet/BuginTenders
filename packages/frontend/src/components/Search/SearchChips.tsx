import Chip from '@/src/ui/Chip';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { useSearch } from '@/src/contexts/SearchContext';

export default function SearchChips() {
    const { t } = useDictionary();
    const { searchMode, searchModesIconsAndColors } = useSearch();

    return (
        <div className={`flex gap-[5px]`}>
            <Chip
                color={searchModesIconsAndColors[searchMode].color}
                label={String(t(`search.mode.${searchMode}`))}
            />
        </div>
    );
}
