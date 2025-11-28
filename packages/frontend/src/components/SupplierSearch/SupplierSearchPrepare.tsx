import React, { useEffect, useState } from 'react';
import TransitionSwitcher from '@/src/ui/TransitionSwitcher';
import Text from '@/src/ui/Text';
import { lora } from '@/src/app/fonts';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import Button from '@/src/ui/Button';
import { get } from '@/src/lib/requests';
import { PackageSearch } from 'lucide-react';
import { AnimatedRedirect } from '@/src/ui/AnimatedRedirect';

type SupplierSearchPrepareScreens = 'loading' | 'ready';

interface Props {
    name: string;
}

export default function SupplierSearchPrepare({ name }: Props) {
    const { t } = useDictionary();
    const [screen, setScreen] = useState<SupplierSearchPrepareScreens>('loading');
    const [original, setOriginal] = useState('');
    const [normalized, setNormalized] = useState('');

    useEffect(() => {
        async function fetchNormalize() {
            try {
                const response = await get(`/api/normalize?q=${encodeURIComponent(name)}`);
                setOriginal(response.original);
                setNormalized(response.result);
                setScreen('ready');
            } catch (e) {
                console.error(e);
                setScreen('ready');
            }
        }
        fetchNormalize();
    }, [name]);

    return (
        <div className="w-full h-full flex justify-center">
            <TransitionSwitcher
                className="w-full h-full flex flex-col items-center justify-center gap-[16px] max-w-[400px]"
                trigger={screen}
            >
                {screen === 'loading' && (
                    <>
                        <Text as="h1" className={`${lora.className} text-center`}>
                            {t('search.supplierSearchPreparing')}
                        </Text>
                        <div className="circle-spin-1" />
                    </>
                )}

                {screen === 'ready' && (
                    <div className="flex flex-col items-center gap-4">
                        <Text as="h1" className={`${lora.className} text-center`}>
                            {t('search.weFoundCategory')}
                        </Text>

                        <Text className={`text-center`}>
                            {t('search.originalQuery')}: <b>{original}</b>
                        </Text>
                        <Text className={`text-center`}>
                            {t('search.searchWillBeByCategory')}: <b>{normalized}</b>
                        </Text>

                        <AnimatedRedirect href={`/supplier?q=${name}&c=${normalized}`}>
                            <Button variant="custom" className={`bg-[#9BE890] hover:bg-[#80D674]`}>
                                <PackageSearch size={20} />
                                {t('search.startSearch')}
                            </Button>
                        </AnimatedRedirect>
                    </div>
                )}
            </TransitionSwitcher>
        </div>
    );
}
