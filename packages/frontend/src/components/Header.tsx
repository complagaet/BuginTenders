'use client';

import DropdownSelector from '@/src/ui/DropdownSelector';
import IconButton, { IconButtonFrame, IconButtonLabel } from '@/src/ui/IconButton';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { AnimatedRedirect } from '@/src/ui/AnimatedRedirect';

export default function Header() {
    const { setAndSaveLang, lang, langList } = useDictionary();

    return (
        <header
            className={`fixed top-[16px] left-[16px] w-[calc(100%-(16px*2))] h-[40px] flex justify-between items-center z-10`}
        >
            <AnimatedRedirect href={'/'}>
                <img
                    className={`hidden sm:block`}
                    src={`/bugin-tenders.svg`}
                    alt={`Bügın’ Tenders`}
                />
                <img
                    className={`block sm:hidden`}
                    src={`/bugin-tenders-small.svg`}
                    alt={`Bügın’ Tenders`}
                />
            </AnimatedRedirect>

            <DropdownSelector setter={setAndSaveLang} selected={lang} list={langList}>
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
    );
}
