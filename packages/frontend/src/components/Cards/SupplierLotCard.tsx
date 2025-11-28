import Text from '@/src/ui/Text';
import Button from '@/src/ui/Button';
import { FileDown, Package, ShieldCheck } from 'lucide-react';
import BobatronContainer from '@/src/ui/BobatronContainer';
import { Lot } from '@/src/components/SupplierSearch/SupplierSearchResults';
import React from 'react';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import useRnuCheckModal from '@/src/hooks/useRnuCheckModal';

interface SupplierLotCard {
    lot: Lot;
}

export default function SupplierLotCard({ lot }: SupplierLotCard) {
    const { t } = useDictionary();
    const { showRnuCheckModal } = useRnuCheckModal();

    return (
        <BobatronContainer className="flex flex-col bg-white p-[16px] w-[400px] grow-1 gap-[16px] rounded-[30px]">
            <div className={`w-full flex items-center gap-[10px]`}>
                <BobatronContainer
                    className={`bg-[#9BE890] w-[40px] h-[40px] flex items-center justify-center rounded-[10px]`}
                >
                    <Package size={20} />
                </BobatronContainer>
                <Text as="h2">
                    {t('text.lot')} {lot.lot_number}
                </Text>
            </div>

            <div className={`flex flex-col gap-[10px] h-full`}>
                <Text as={`p`}>
                    <b>{t('text.customer')}:</b> {lot.customer?.name}
                </Text>
                <Text as={`p`}>
                    <b>{t('text.item')}:</b> {lot.items?.[0]?.name} ({lot.items?.[0]?.count} ×{' '}
                    {lot.items?.[0]?.unit})
                </Text>
                <Text as={`p`}>
                    <b>{t('text.unitPrice')}:</b> {lot.items?.[0]?.unit_price} ₸
                </Text>
            </div>

            <div className={`w-full flex flex-col gap-[10px]`}>
                <BobatronContainer
                    className={`flex flex-col gap-[4px] ${lot.winner?.name ? 'bg-[#9BE890]' : 'bg-[#ffc0b6]'} p-[10px] rounded-[10px]`}
                >
                    <Text as={`h2`}>{t('text.winner')}</Text>
                    <Text as={`p`}>{lot.winner?.name || t('text.error')}</Text>
                </BobatronContainer>

                {lot.winner?.bin_iin_id && (
                    <Button
                        variant={`custom`}
                        className={`bg-[#FFD47A] hover:bg-[#ffc449] w-full`}
                        onClick={() => showRnuCheckModal(lot.winner?.bin_iin_id)}
                    >
                        <ShieldCheck size={20} />
                        {t('rnu.checkSupplier')}
                    </Button>
                )}

                {lot.tech_spec?.file_url && (
                    <a href={lot.tech_spec.file_url} target="_blank">
                        <Button
                            variant={`custom`}
                            className={`bg-[#CED0FF] hover:bg-[#B0B4FF] w-full`}
                        >
                            <FileDown size={20} />
                            {t('text.downloadTechSpec')}
                        </Button>
                    </a>
                )}
            </div>
        </BobatronContainer>
    );
}
