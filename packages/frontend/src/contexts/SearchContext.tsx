'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const searchModes = ['products', 'suppliers', 'announces'] as const;
type searchMode = (typeof searchModes)[number];

interface SearchContextType {
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    searchMode: searchMode;
    setSearchMode: React.Dispatch<React.SetStateAction<searchMode>>;
    searchModes: readonly searchMode[];
    searchActive: boolean;
    setSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
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
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [searchMode, setSearchMode] = useState<searchMode>('products');
    const [searchActive, setSearchActive] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (searchMode === 'products') setShowFilters(false);
    }, [searchMode]);

    return (
        <SearchContext.Provider
            value={{
                showFilters,
                setShowFilters,
                searchMode,
                setSearchMode,
                searchModes,
                searchActive,
                setSearchActive,
                searchQuery,
                setSearchQuery,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}
