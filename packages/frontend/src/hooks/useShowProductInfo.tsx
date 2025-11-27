import { useUI } from '@/src/contexts/UIContext';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import Button from '@/src/ui/Button';
import Text from '@/src/ui/Text';
import React from 'react';
import AttributesTable from '@/src/components/AttributesTable';
import { Info } from 'lucide-react';
import BobatronContainer from '@/src/ui/BobatronContainer';
import HeightWrapper from '@/src/ui/HeightWrapper';

export default function useShowProductInfo() {
    const { setModal } = useUI();
    const { t, lang } = useDictionary();

    function showProductInfo(attributesDict: any) {
        setModal({
            visible: true,
            closable: true,
            content: (
                <div className="w-full h-full flex flex-col items-center gap-[16px]">
                    <div className={`w-full flex items-center gap-[10px]`}>
                        <BobatronContainer
                            className={`bg-[#CED0FF] w-[40px] h-[40px] flex items-center justify-center rounded-[10px]`}
                        >
                            <Info size={20} />
                        </BobatronContainer>
                        <Text as={`p`}>{t('text.productInfo')}</Text>
                    </div>
                    <HeightWrapper>
                        <AttributesTable attributes={attributesDict} lang={lang} />
                    </HeightWrapper>
                    <div className="flex gap-[10px] w-full justify-end">
                        <Button
                            variant={`secondary`}
                            onClick={() => {
                                setModal({});
                            }}
                        >
                            {t('text.close')}
                        </Button>
                    </div>
                </div>
            ),
        });
    }

    return { showProductInfo };
}
