import { useUI } from '@/src/contexts/UIContext';
import { useDictionary } from '@/src/contexts/DictionaryContext';
import Button from '@/src/ui/Button';
import React from 'react';

interface ShowPromptProps {
    content: React.ReactNode;
    onAccept?: () => void;
    onCancel?: () => void;
    variant?: 'helpful' | 'destructive';
    acceptText?: string;
}

export default function usePrompt() {
    const { setModal } = useUI();
    const { t } = useDictionary();

    function showPrompt({
        content,
        onAccept = () => {},
        onCancel = () => {},
        variant = 'helpful',
        acceptText = String(t('text.accept')),
    }: ShowPromptProps) {
        const handleCancel = () => {
            try {
                onCancel();
            } finally {
                setModal({});
            }
        };

        const handleAccept = () => {
            try {
                onAccept();
            } finally {
                setModal({});
            }
        };

        setModal({
            visible: true,
            closable: true,
            content: (
                <div className="w-full h-full flex flex-col items-center gap-[16px]">
                    <div className="w-full h-full flex flex-col gap-[10px]">{content}</div>
                    <div className="flex gap-[10px] w-full">
                        <Button className="w-full" onClick={handleCancel}>
                            {t('text.cancel')}
                        </Button>
                        <Button
                            variant={variant === 'destructive' ? 'destructive' : 'primary'}
                            className="w-full"
                            onClick={handleAccept}
                        >
                            {acceptText}
                        </Button>
                    </div>
                </div>
            ),
        });
    }

    return { showPrompt };
}
