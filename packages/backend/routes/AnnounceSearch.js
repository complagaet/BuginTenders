import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { parseAnnouncesHtml } from '../tools/announcesParser.js';

const router = express.Router();
const GZ_BASE = 'https://goszakup.gov.kz';

/* -------------------------------
   ЛОКАЛЬНАЯ ДОФИЛЬТРАЦИЯ
-------------------------------- */
function filterAnnouncesLocally(announces, query) {
    const {
        announceId,
        announceNumber,
        organizer,
        status,
        startDate,
        endDate,
        amountValue,
        amountMin,
        amountMax,
    } = query;

    return announces.filter((a) => {
        if (announceId && a.announceId !== Number(announceId)) return false;
        if (announceNumber && a.announceNumber !== announceNumber) return false;

        if (organizer && !a.organizer?.toLowerCase().includes(String(organizer).toLowerCase()))
            return false;

        if (status && !a.status?.toLowerCase().includes(String(status).toLowerCase())) return false;

        if (startDate && a.startDate !== startDate) return false;
        if (endDate && a.endDate !== endDate) return false;

        if (amountValue && a.amountValue !== Number(amountValue)) return false;

        if (amountMin && a.amountValue < Number(amountMin)) return false;
        if (amountMax && a.amountValue > Number(amountMax)) return false;

        return true;
    });
}

/* -------------------------------
   /announce-search
-------------------------------- */
router.get('/announce-search', async (req, res) => {
    try {
        const {
            name,
            customer,
            number,
            year,
            amount_from,
            amount_to,
            trade_type,
            type,
            method,
            start_date_from,
            start_date_to,
            end_date_from,
            end_date_to,
            itog_date_from,
            itog_date_to,
        } = req.query;

        const params = new URLSearchParams();

        // основные фильтры госзакупа
        if (name) params.append('filter[name]', name.trim());
        if (customer) params.append('filter[customer]', customer.trim());
        if (number) params.append('filter[number]', number.trim());
        if (year) params.append('filter[year]', year.trim());
        if (amount_from) params.append('filter[amount_from]', amount_from);
        if (amount_to) params.append('filter[amount_to]', amount_to);
        if (trade_type) params.append('filter[trade_type]', trade_type);
        if (type) params.append('filter[type]', type);

        // способ закупки — массив
        if (method) {
            const arr = Array.isArray(method)
                ? method
                : String(method)
                      .split(',')
                      .map((v) => v.trim())
                      .filter(Boolean);

            arr.forEach((m) => params.append('filter[method][]', m));
        }

        if (start_date_from) params.append('filter[start_date_from]', start_date_from);
        if (start_date_to) params.append('filter[start_date_to]', start_date_to);
        if (end_date_from) params.append('filter[end_date_from]', end_date_from);
        if (end_date_to) params.append('filter[end_date_to]', end_date_to);
        if (itog_date_from) params.append('filter[itog_date_from]', itog_date_from);
        if (itog_date_to) params.append('filter[itog_date_to]', itog_date_to);

        // как на сайте — пустой search
        params.append('search', '');

        const url = `${GZ_BASE}/ru/search/announce?${params.toString()}`;

        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                Accept: 'text/html,application/xhtml+xml',
            },
            timeout: 18000,
        });

        const announces = parseAnnouncesHtml(html) || [];

        // локальная фильтрация, чтобы можно было фильтровать по ID, номеру, статусу и т.д.
        const filtered = filterAnnouncesLocally(announces, req.query);

        return res.status(200).json({
            status: 'ok',
            params: req.query,
            count: filtered.length,
            announces: filtered,
        });
    } catch (err) {
        console.error('Error in /announce-search:', err.message || err);

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

export default router;
