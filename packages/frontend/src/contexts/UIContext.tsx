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

export type logoTypes = 'bugintenders' | 'ertensabaq' | 'bugintenders+ertensabaq' | 'none';

interface UIContextType {
    page: string;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    showOverlay: boolean;
    setShowOverlay: Dispatch<SetStateAction<boolean>>;
    overlayLogo: logoTypes;
    setOverlayLogo: React.Dispatch<React.SetStateAction<logoTypes>>;
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
    const [page, setPage] = useState('loading');
    const [showOverlay, setShowOverlay] = useState<boolean>(true);
    const [overlayLogo, setOverlayLogo] = useState<logoTypes>('none');
    const [modal, setModal] = useState<ModalState>({});

    return (
        <UIContext.Provider
            value={{
                page,
                setPage,
                showOverlay,
                setShowOverlay,
                overlayLogo,
                setOverlayLogo,
                modal,
                setModal,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}
