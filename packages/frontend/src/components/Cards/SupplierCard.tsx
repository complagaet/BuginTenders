import React from 'react';
import Text from '@/src/ui/Text';
import Button from '@/src/ui/Button';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import BobatronContainer from '@/src/ui/BobatronContainer';
import useRnuCheckModal from '@/src/hooks/useRnuCheckModal';
import { useDictionary } from '@/src/contexts/DictionaryContext';

interface SupplierCardProps {
    supplier: {
        participant_id: number;
        name: string;
        bin_iin: string | null;
        iin: string | null;
        rnn: string | null;
        profile_url: string;
    };
}

export default function SupplierCard({ supplier }: SupplierCardProps) {
    const { t } = useDictionary();
    const { showRnuCheckModal } = useRnuCheckModal();

    const identifier = supplier.bin_iin || supplier.iin;

    return (
        <BobatronContainer className="flex flex-col bg-white p-[16px] w-[400px] gap-[16px] rounded-[30px]">
            <div className="flex items-center gap-[10px]">
                <BobatronContainer className="bg-[#9BE890] min-w-[40px] h-[40px] flex items-center justify-center rounded-[10px]">
                    <ShieldCheck size={20} />
                </BobatronContainer>
                <Text as="h2">{supplier.name}</Text>
            </div>

            <div className="flex flex-col gap-[10px] h-full">
                {supplier.bin_iin && (
                    <Text as="p">
                        <b>{t('text.bin_iin')}:</b> {supplier.bin_iin}
                    </Text>
                )}
                {supplier.iin && (
                    <Text as="p">
                        <b>{t('text.iin')}:</b> {supplier.iin}
                    </Text>
                )}
                {supplier.rnn && (
                    <Text as="p">
                        <b>{t('text.rnn')}:</b> {supplier.rnn}
                    </Text>
                )}
            </div>

            <div className="flex flex-col gap-[10px]">
                {identifier && (
                    <Button
                        variant="custom"
                        className="bg-[#FFD47A] hover:bg-[#ffc449] w-full"
                        onClick={() => showRnuCheckModal(identifier)}
                    >
                        <ShieldCheck size={20} />
                        {t('rnu.checkSupplier')}
                    </Button>
                )}

                <a href={supplier.profile_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="custom" className="bg-[#CED0FF] hover:bg-[#B0B4FF] w-full">
                        <ExternalLink size={20} />
                        {t('text.viewProfile')}
                    </Button>
                </a>
            </div>
        </BobatronContainer>
    );
}
