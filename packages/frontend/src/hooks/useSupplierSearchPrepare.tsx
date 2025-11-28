import { useUI } from '@/src/contexts/UIContext';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import Button from '@/src/ui/Button';
import Text from '@/src/ui/Text';
import React from 'react';
import { CircleX, PackageSearch } from 'lucide-react';
import BobatronContainer from '@/src/ui/BobatronContainer';
import SupplierSearchPrepare from '@/src/components/SupplierSearch/SupplierSearchPrepare';

export default function useSupplierSearchPrepare() {
    const { setModal } = useUI();
    const { t } = useDictionary();

    function showSupplierSearchPrepare(name: string) {
        setModal({
            visible: true,
            closable: false,
            content: (
                <div className="w-full h-full flex flex-col items-center gap-[16px]">
                    <div className={`w-full flex justify-between gap-[10px]`}>
                        <div className={`flex items-center gap-[10px]`}>
                            <BobatronContainer
                                className={`bg-[#9BE890] w-[40px] h-[40px] flex items-center justify-center rounded-[10px]`}
                            >
                                <PackageSearch size={20} />
                            </BobatronContainer>
                            <Text as={`h2`} className={`hidden md:block`}>
                                {t('search.findSuppliers')}
                            </Text>
                        </div>
                        <Button
                            variant={`destructive`}
                            className={`bg-[#CED0FF] hover:bg-[#B0B4FF]`}
                            onClick={() => {
                                setModal({});
                            }}
                        >
                            <CircleX size={20} />
                        </Button>
                    </div>
                    <SupplierSearchPrepare name={name} />
                </div>
            ),
        });
    }

    return { showSupplierSearchPrepare };
}
