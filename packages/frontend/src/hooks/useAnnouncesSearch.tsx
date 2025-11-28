import { get } from '@/src/lib/requests';

export type Announce = {
    announceId: number;
    announceNumber: string;
    lotsCount: number;
    name: string;
    organizer: string;
    method: string;
    startDate: string;
    endDate: string;
    amountRaw: string;
    amountValue: number;
    status: string;
    href: string;
};

export default function useAnnouncesSearch() {
    const findAnnounces = async (q: string): Promise<Announce[]> => {
        try {
            const response: any = await get(`/api/announce-search?name=${q}`);
            console.log('Server response:', response);

            if (response?.status === 'ok' && Array.isArray(response.announces)) {
                return response.announces.map((a: any) => ({
                    announceId: a.announceId,
                    announceNumber: a.announceNumber,
                    lotsCount: a.lotsCount,
                    name: a.name,
                    organizer: a.organizer,
                    method: a.method,
                    startDate: a.startDate,
                    endDate: a.endDate,
                    amountRaw: a.amountRaw,
                    amountValue: a.amountValue,
                    status: a.status,
                    href: a.href,
                }));
            }

            return [];
        } catch (err) {
            console.error('Error fetching announces:', err);
            return [];
        }
    };

    return { findAnnounces };
}
