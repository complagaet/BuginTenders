import { useEffect, useState } from 'react';
import { get } from '@/src/lib/requests';

interface RnuCheckResponse {
    query: string;
    result: boolean;
    company?: string;
}

export default function useRnuCheck(query: string) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<RnuCheckResponse | null>(null);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        async function fetchRnu() {
            setLoading(true);
            setError(null);

            try {
                const response = await get(`/api/rnu/check?query=${encodeURIComponent(query)}`);

                setData(response);
            } catch (e) {
                console.error(e);
                setError('request_failed');
                setData(null);
            } finally {
                setLoading(false);
            }
        }

        if (query) fetchRnu();
    }, [query]);

    return {
        loading,
        data,
        error,
        // удобный флаг:
        isFraud: data?.result === true,
    };
}
