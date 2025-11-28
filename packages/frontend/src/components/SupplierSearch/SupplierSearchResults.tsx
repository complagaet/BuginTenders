'use client';

import { useEffect, useState } from 'react';
import Text from '@/src/ui/Text';
import { lora } from '@/src/app/fonts';
import Button from '@/src/ui/Button';
import { HeartCrack } from 'lucide-react';
import { get } from '@/src/lib/requests';
import BobatronContainer from '@/src/ui/BobatronContainer';
import SupplierLotCard from '@/src/components/Cards/SupplierLotCard';
import { AnimatedRedirect } from '@/src/ui/AnimatedRedirect';
import { useDictionary } from '@/src/contexts/DictionaryContext';

interface SupplierSearchResultsType {
    name: string;
    category: string;
}

export interface Lot {
    lot_id: number;
    lot_number: string;
    status: string;
    customer: { name: string };
    winner: { name: string; bin_iin_id: string };
    items: { name: string; count: number; unit: string; unit_price: number; total_price: number }[];
    tech_spec: { file_url: string };
}

export default function SupplierSearchResults({ name, category }: SupplierSearchResultsType) {
    const { t } = useDictionary();

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<Lot[]>([]);

    const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);

    useEffect(() => {
        async function fetchPipeline() {
            setLoading(true);
            try {
                const data = await get(
                    `/api/supplier-search/pipeline?q=${encodeURIComponent(category)}`
                );

                setResults(data.results || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPipeline();
    }, [category, updateTrigger]);

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <Text as="h1" className={`${lora.className} text-center`}>
                    {t('search.searching')}
                </Text>
                <div className="circle-spin-1" />
            </div>
        );
    }

    if (!results.length) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <Text as="h1" className={`${lora.className} text-center`}>
                    {t('search.noResultsForCategory')}
                </Text>
                <Text as="p" className={`text-center`}>
                    &#171;{category}&#187;
                </Text>
                <div className={`flex gap-[10px]`}>
                    <AnimatedRedirect href={'/'}>
                        <Button>{t('text.home')}</Button>
                    </AnimatedRedirect>
                    <Button
                        variant={`primary`}
                        onClick={() => {
                            setUpdateTrigger((prev) => !prev);
                        }}
                    >
                        {t('text.tryAgain')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1300px] h-full flex justify-center gap-[16px] flex-wrap">
            <div className={`w-full flex flex-col items-center gap-[16px]`}>
                <Text as={`h1`} className={`${lora.className} text-center`}>
                    {name}
                </Text>
                <Text as={`p`} className={`text-center`}>
                    ({category})
                </Text>
                <BobatronContainer className="w-full h-fit flex items-center justify-center flex-col p-[16px] rounded-[16px] gap-[10px] bg-[#ffc0b6] max-w-[600px]">
                    <HeartCrack />
                    <Text as={`h2`} className={`${lora.className} text-center`}>
                        {t('text.onlyCategorySupplierSearch')}
                    </Text>
                </BobatronContainer>
            </div>

            {results.map((lot, i) => (
                <SupplierLotCard lot={lot} key={i} />
            ))}
        </div>
    );
}
