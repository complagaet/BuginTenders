'use client'

import DropdownSelector from '@/src/ui/DropdownSelector';
import IconButton, { IconButtonFrame, IconButtonLabel } from '@/src/ui/IconButton';
import { useDictionary } from '@/src/contexts/DictionaryContext';

export default function Header() {
    const {
        setAndSaveLang,
        lang,
        langList
    } = useDictionary()

    return <header className={`w-full h-[40px] flex justify-between items-center`}>
        <img src={`/bugintenders.svg`} alt={`Bügın’ Tenders`}/>

        <DropdownSelector
            setter={setAndSaveLang}
            selected={lang}
            list={langList}
        >
            {langList.map((item) => (
                <IconButton>
                    <IconButtonFrame color={'#000'}>
                        <img src={`/locales/${item}.webp`} alt={''} />
                    </IconButtonFrame>
                    <IconButtonLabel>{item}</IconButtonLabel>
                </IconButton>
            ))}
        </DropdownSelector>
    </header>
}