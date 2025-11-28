import { useSearch } from '@/src/contexts/SearchContext';
import useProductsSearch from '@/src/hooks/useProductsSearch';
import usePrompt from '@/src/hooks/usePrompt';
import useAnnouncesSearch from '@/src/hooks/useAnnouncesSearch';
import useSuppliersSearch from '@/src/hooks/useSuppliersSearch';

export default function usePerformSearch() {
    const {
        setSearchLoading,
        setSearchActive,
        searchMode,
        searchQuery,
        setResultProducts,
        setResultAnnounces,
        setResultSuppliers,
    } = useSearch();

    const { findProducts } = useProductsSearch();
    const { findAnnounces } = useAnnouncesSearch();
    const { findSuppliers } = useSuppliersSearch();

    const { showPrompt } = usePrompt();

    const performSearch = async () => {
        setSearchLoading(true);
        setSearchActive(true);

        setResultProducts([]);
        setResultAnnounces([]);

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
                console.log('products error');
            }
        }

        if (searchMode === 'announces') {
            try {
                const result = await findAnnounces(searchQuery);
                setResultAnnounces(result);
                setSearchLoading(false);
            } catch {
                console.log('announces error');
            }
        }

        if (searchMode === 'suppliers') {
            try {
                const result = await findSuppliers(searchQuery);
                setResultSuppliers(result.results);
                setSearchLoading(false);
            } catch {
                console.log('suppliers error');
            }
        }
    };

    return { performSearch };
}
