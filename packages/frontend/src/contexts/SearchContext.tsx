'use client';

import React, { createContext, JSX, ReactNode, useContext, useEffect, useState } from 'react';
import { Container, Megaphone, ShoppingCart } from 'lucide-react';
import { Product } from '@/src/hooks/useProductsSearch';

const searchModes = ['products', 'suppliers', 'announces'] as const;
type searchMode = (typeof searchModes)[number];

const searchModesIconsAndColors = {
    products: {
        color: '#CED0FF',
        icon: <ShoppingCart size={20} />,
    },
    suppliers: {
        color: '#9BE890',
        icon: <Container size={20} />,
    },
    announces: {
        color: '#F4ABFF',
        icon: <Megaphone size={20} />,
    },
} satisfies Record<
    searchMode,
    {
        color: string;
        icon: JSX.Element;
    }
>;

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
    searchModesIconsAndColors: Record<searchMode, { color: string; icon: JSX.Element }>;
    searchLoading: boolean;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;

    resultProducts: Product[];
    setResultProducts: React.Dispatch<React.SetStateAction<Product[]>>;
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
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [resultProducts, setResultProducts] = useState<Product[]>([]);

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
                searchModesIconsAndColors,
                searchLoading,
                setSearchLoading,
                resultProducts,
                setResultProducts,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}
