import { useDictionary } from '@/src/contexts/DictionaryContext';
import { useUI } from '@/src/contexts/UIContext';
import RnuCheckModalContent from '@/src/components/RnuCheckModalContent';
import BobatronContainer from '@/src/ui/BobatronContainer';
import { CircleX, ShieldCheck } from 'lucide-react';
import Text from '@/src/ui/Text';
import Button from '@/src/ui/Button';

export default function useRnuCheckModal() {
    const { setModal } = useUI();
    const { t } = useDictionary();

    function showRnuCheckModal(query: string) {
        setModal({
            visible: true,
            closable: true,
            content: (
                <div className="w-full h-full flex flex-col items-center gap-[16px]">
                    <div className="w-full flex justify-between gap-[10px]">
                        <div className="flex items-center gap-[10px]">
                            <BobatronContainer className="bg-[#FFD47A] w-[40px] h-[40px] flex items-center justify-center rounded-[10px]">
                                <ShieldCheck size={20} />
                            </BobatronContainer>

                            <Text as="h2" className="hidden md:block">
                                {t('rnu.checkingSupplier')}
                            </Text>
                        </div>

                        <Button
                            variant="destructive"
                            className="bg-[#CED0FF] hover:bg-[#B0B4FF]"
                            onClick={() => setModal({})}
                        >
                            <CircleX size={20} />
                        </Button>
                    </div>

                    <RnuCheckModalContent query={query} />
                </div>
            ),
        });
    }

    return { showRnuCheckModal };
}
