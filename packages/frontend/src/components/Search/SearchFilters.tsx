import Input from '@/src/ui/Input';
import Text from '@/src/ui/Text';
import { useSearch } from '@/src/contexts/SearchContext';
import { useEffect, useRef } from 'react';
import BobatronContainer from '@/src/ui/BobatronContainer';
import { lora } from '@/src/app/fonts';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import { HeartCrack } from 'lucide-react';

export default function SearchFilters() {
    const { showFilters } = useSearch();
    const { t } = useDictionary();

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;

        if (showFilters) {
            el.style.display = 'flex';
            el.style.opacity = '0';

            el.style.height = '0px';

            requestAnimationFrame(() => {
                const height = el.scrollHeight;
                el.style.marginTop = '0px';
                el.style.height = `${height}px`;
                el.style.opacity = '1';
            });
        } else {
            const height = el.scrollHeight;
            el.style.height = `${height}px`;
            el.style.opacity = '1';

            requestAnimationFrame(() => {
                el.style.height = '0px';
                el.style.opacity = '0';
                el.style.marginTop = '-16px';
            });

            setTimeout(() => {
                if (!showFilters) el.style.display = 'none';
            }, 300);
        }
    }, [showFilters]);

    return (
        <div
            ref={ref}
            style={{
                display: 'none',
                overflow: 'hidden',
                transition: 'height 0.3s, opacity 0.3s, gap 0.3s, margin 0.3s',
            }}
            className="w-full gap-[16px] flex-col pl-[16px] pr-[16px]"
        >
            <div className="w-full min-h-[2px] bg-[#C6BDB4]"></div>

            <BobatronContainer className="w-full h-fit flex items-center justify-center flex-col p-[16px] rounded-[16px] gap-[10px] bg-[#ffc0b6]">
                <HeartCrack />
                <Text as={`h2`} className={`${lora.className} text-center`}>
                    {t('text.filtersUnavailable')}
                </Text>
            </BobatronContainer>

            {/*
            <div className="w-full flex flex-col md:flex-row gap-[10px]">
                <div className={`w-full  flex flex-col gap-[8px]`}>
                    <Text as={`p`}>Регион участника</Text>
                    <Input className="w-full" />
                </div>
                <div className={`w-full  flex flex-col gap-[8px]`}>
                    <Text as={`p`}>Год регистрации</Text>
                    <Input className="w-full" />
                </div>
            </div>
            */}
        </div>
    );
}
