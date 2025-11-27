import Button from '@/src/ui/Button';
import DropdownSelector from '@/src/ui/DropdownSelector';
import { useSearch } from '@/src/contexts/SearchContext';
import { useDictionary } from '@/src/contexts/DictionaryContext';

export default function SearchModeSelector() {
    const { t } = useDictionary();
    const { searchMode, setSearchMode, searchModes, searchModesIconsAndColors } = useSearch();

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
                <Button
                    key={item}
                    className={`max-w-fit`}
                    style={{ backgroundColor: searchModesIconsAndColors[item].color }}
                >
                    {searchModesIconsAndColors[item].icon}
                    <p>{t(`search.mode.${item}`)}</p>
                </Button>
            ))}
        </DropdownSelector>
    );
}
