'use client';

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useLayoutEffect,
    ReactNode, JSX,
} from 'react';

import ru from '@/src/locales/ru.json';
import kk from '@/src/locales/kk.json';

const dictionaries = { ru, kk };

type Lang = keyof typeof dictionaries; // "ru" | "kk" | "en"

interface DictionaryContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    langList: Lang[];
    setAndSaveLang: (lang: Lang) => void;
    t: (key: string) => string | JSX.Element | JSX.Element[];
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

interface DictionaryProviderProps {
    children: ReactNode;
}

export default function DictionaryProvider({ children }: DictionaryProviderProps) {
    const [lang, setLang] = useState<Lang>('kk');

    const langList: Lang[] = ['kk', 'ru'];

    function setAndSaveLang(newLang: Lang) {
        setLang(newLang);
        localStorage.setItem('language', newLang);
    }

    useLayoutEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Lang | null;
        if (savedLanguage && langList.includes(savedLanguage)) {
            setLang(savedLanguage);
        } else {
            localStorage.setItem('language', lang);
        }
    }, []);

    const t = (key: string): string | JSX.Element | JSX.Element[] => {
        const parts = key.split('.');
        const raw = parts.reduce<any>(
            (obj, part) => obj?.[part],
            dictionaries[lang]
        );

        if (typeof raw !== 'string') return key;

        if (!raw.includes('\n')) return raw;

        const segments = raw.split('\n');
        return segments.map((seg, i) => (
            <React.Fragment key={i}>
                {seg}
                {i < segments.length - 1 && <br />}
            </React.Fragment>
        ));
    };

    const value = useMemo(
        () => ({ lang, setLang, langList, setAndSaveLang, t }),
        [lang]
    );

    return (
        <DictionaryContext.Provider value={value}>
            {children}
        </DictionaryContext.Provider>
    );
}

export function useDictionary(): DictionaryContextType {
    const ctx = useContext(DictionaryContext);
    if (!ctx) throw new Error('useDictionary must be used inside DictionaryProvider');
    return ctx;
}
