'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UIContextType {
    showOverlay: boolean;
    setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>;
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

    return (
        <UIContext.Provider
            value={{
                showOverlay,
                setShowOverlay,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}
