'use client';

import Text from '@/src/ui/Text';
import Button from '@/src/ui/Button';
import { SquareStar, ExternalLink } from 'lucide-react';
import BobatronContainer from '@/src/ui/BobatronContainer';
import React from 'react';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import useRnuCheckModal from '@/src/hooks/useRnuCheckModal';

interface Announce {
    announceId: number;
    announceNumber: string;
    lotsCount: number;
    name: string;
    organizer: string;
    method: string;
    startDate: string;
    endDate: string;
    amountRaw: string;
    amountValue: number;
    status: string;
    href: string;
}

interface SupplierAnnounceCardProps {
    announce: Announce;
}

function formatServerDate(dateStr: string) {
    const fixed = dateStr.replace(/^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/, '$1 $2');
    const date = new Date(fixed);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export default function AnnounceCard({ announce }: SupplierAnnounceCardProps) {
    const { t } = useDictionary();

    return (
        <BobatronContainer className="flex flex-col bg-white p-[16px] w-[400px] grow-1 gap-[16px] rounded-[30px]">
            <div className={`w-full flex items-center gap-[10px]`}>
                <div className={`h-full`}>
                    <BobatronContainer
                        className={`bg-[#F4ABFF] min-w-[40px] h-[40px] flex items-center justify-center rounded-[10px]`}
                    >
                        <SquareStar size={20} />
                    </BobatronContainer>
                </div>
                <Text as="h2">
                    {announce.announceNumber} — {announce.name}
                </Text>
            </div>

            <div className={`flex flex-col gap-[10px] h-full`}>
                <Text as="p">
                    <b>{t('text.customer')}:</b> {announce.organizer}
                </Text>
                <Text as="p">
                    <b>{t('text.method')}:</b> {announce.method}
                </Text>
                <Text as="p">
                    <b>{t('text.amount')}:</b> {announce.amountRaw} ₸
                </Text>
                <Text as="p">
                    <b>{t('text.status')}:</b> {announce.status}
                </Text>
                <Text as="p">
                    <b>{t('text.dates')}:</b> {formatServerDate(announce.startDate)} —{' '}
                    {formatServerDate(announce.endDate)}
                </Text>
            </div>

            <div className={`flex flex-col gap-[10px]`}>
                <a href={`https://goszakup.gov.kz${announce.href}`} target="_blank">
                    <Button variant="custom" className="bg-[#CED0FF] hover:bg-[#B0B4FF] w-full">
                        <ExternalLink size={20} />
                        {t('text.openAnnounce')}
                    </Button>
                </a>
            </div>
        </BobatronContainer>
    );
}
