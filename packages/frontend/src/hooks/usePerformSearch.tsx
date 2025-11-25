import { useSearch } from '@/src/contexts/SearchContext';
import useProductsSearch from '@/src/hooks/useProductsSearch';

export default function usePerformSearch() {
    const { setSearchLoading, setSearchActive, searchMode, searchQuery, setResultProducts } =
        useSearch();
    const { findProducts } = useProductsSearch();

    const performSearch = async () => {
        setSearchLoading(true);
        setSearchActive(true);

        setResultProducts([]);

        if (searchQuery.length <= 2) {
            setSearchLoading(false);
            return;
        }

        if (searchMode === 'products') {
            try {
                const result = await findProducts(searchQuery);
                setResultProducts(result.response.result);
                setSearchLoading(false);
            } catch {
                console.log('3425');
            }
        }
    };

    return { performSearch };
}
