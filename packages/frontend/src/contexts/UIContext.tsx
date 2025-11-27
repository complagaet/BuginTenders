'use client';

import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    Dispatch,
    SetStateAction,
} from 'react';

export interface ModalState {
    visible?: boolean;
    closable?: boolean;
    zIndex?: number;
    content?: React.ReactNode;
}

interface UIContextType {
    showOverlay: boolean;
    setShowOverlay: Dispatch<SetStateAction<boolean>>;

    modal: ModalState;
    setModal: Dispatch<SetStateAction<ModalState>>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}

interface UIProviderProps {
    children: ReactNode;
}

export default function UIProvider({ children }: UIProviderProps) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [modal, setModal] = useState<ModalState>({});

    return (
        <UIContext.Provider
            value={{
                showOverlay,
                setShowOverlay,

                modal,
                setModal,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}
