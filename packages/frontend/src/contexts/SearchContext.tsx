'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SearchContextType {
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}

interface SearchProviderProps {
    children: ReactNode;
}

export default function SearchProvider({ children }: SearchProviderProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <SearchContext.Provider
            value={{
                showFilters,
                setShowFilters,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}
