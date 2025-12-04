import { useDictionary } from '@/src/contexts/DictionaryContext';
import BobatronContainer from '@/src/ui/BobatronContainer';
import { BadgeCheck, ThumbsDown } from 'lucide-react';
import Text from '@/src/ui/Text';
import TransitionSwitcher from '@/src/ui/TransitionSwitcher';
import { lora } from '@/src/app/fonts';
import useRnuCheck from '@/src/hooks/useRnuCheck';

interface ContentProps {
    query: string;
}

export default function RnuCheckModalContent({ query }: ContentProps) {
    const { t } = useDictionary();
    const { loading, data, isFraud } = useRnuCheck(query);

    return (
        <TransitionSwitcher
            className="w-full h-full flex flex-col items-center justify-center gap-4 max-w-[400px]"
            trigger={loading ? 'loading' : JSON.stringify(data)}
        >
            {loading && (
                <>
                    <Text as="h1" className={`${lora.className} text-center`}>
                        {t('rnu.checking')}
                    </Text>
                    <div className="circle-spin-1" />
                </>
            )}

            {!loading && data && (
                <div className="flex flex-col items-center gap-4 px-2 text-center">
                    <Text as="h1" className={`${lora.className}`}>
                        {isFraud ? t('rnu.fraudSupplier') : t('rnu.cleanSupplier')}
                    </Text>

                    <Text>
                        <b>{t('rnu.query')}:</b> {data.query}
                    </Text>

                    {data.company !== 'none' && (
                        <Text>
                            <b>{t('rnu.company')}:</b> {data.company}
                        </Text>
                    )}

                    <BobatronContainer
                        className={`
                                w-full h-fit flex items-center justify-center flex-col p-[16px] rounded-[16px] gap-[10px] max-w-[600px]
                                ${isFraud ? 'bg-[#ffc0b6]' : 'bg-green-300'}
                            `}
                    >
                        {isFraud ? <ThumbsDown /> : <BadgeCheck />}
                        {isFraud ? t('rnu.isFraudYes') : t('rnu.isFraudNo')}
                    </BobatronContainer>
                </div>
            )}
        </TransitionSwitcher>
    );
}
