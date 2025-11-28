import { get } from '@/src/lib/requests';

export type Supplier = {
    participant_id: number;
    name: string;
    bin_iin: string | null;
    iin: string | null;
    rnn: string | null;
    profile_url: string;
};

export default function useSuppliersSearch() {
    const findSuppliers = async (name: string, page: number = 1, perPage: number = 50) => {
        const response = await get(
            `/api/suppliers/search?name=${encodeURIComponent(name)}&page=${page}&perPage=${perPage}`
        );
        console.log(response);
        return response as { total: number; results: Supplier[] };
    };

    return { findSuppliers };
}
