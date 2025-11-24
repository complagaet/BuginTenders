import Button from '@/src/ui/Button';
import DropdownSelector from '@/src/ui/DropdownSelector';
import { useSearch } from '@/src/contexts/SearchContext';
import { useDictionary } from '@/src/contexts/DictionaryContext';

export default function SearchModeSelector() {
    const { t } = useDictionary();
    const { searchMode, setSearchMode, searchModes } = useSearch();

    return (
        <DropdownSelector
            setter={setSearchMode}
            noPushingDown={true}
            noUnderlay={true}
            selected={searchMode}
            list={searchModes}
            chevronPosition={'hidden'}
        >
            {searchModes.map((item) => (
                <Button key={item} className={`max-w-fit`}>
                    {t(`search.mode.${item}`)}
                </Button>
            ))}
        </DropdownSelector>
    );
}
