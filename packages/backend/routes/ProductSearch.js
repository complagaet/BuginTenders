import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { normalizeName } from '../tools/Normalizer.js';

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const { q, limit = 48, offset = 0 } = req.query;

        // Простая валидация
        if (!q || typeof q !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Query parameter "q" is required',
            });
        }

        // Приводим limit/offset к числу
        const parsedLimit = Number(limit) || 48;
        const parsedOffset = Number(offset) || 0;

        const url = `https://e-catalog.gov.kz/api/core/products/search/?limit=${parsedLimit}&offset=${parsedOffset}`;

        const { data } = await axios.post(
            url,
            {
                dict_attrs: [],
                q,
                category_id: null,
                is_social: null,
                is_domestic: null,
            },
            {
                timeout: 10000, // чтобы не висеть вечно
            }
        );

        return res.status(200).json({
            status: 'ok',
            params: req.query,
            response: data,
        });
    } catch (e) {
        console.error('Error in /search:', e?.message || e);

        // Если это ошибка axios — можно вернуть чуть больше деталей
        if (e.response) {
            return res.status(e.response.status || 500).json({
                status: 'error',
                message: 'Upstream API error',
                upstreamStatus: e.response.status,
                upstreamData: e.response.data,
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

router.get('/normalize', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Missing query ?q=' });
    }

    try {
        const result = await normalizeName(q);

        return res.json({
            original: q,
            result,
        });
    } catch (err) {
        console.error('API Normalize error:', err.message || err);
        return res.status(500).json({
            error: 'AI normalization failed',
            details: err.message || 'Unknown Gemini API error',
        });
    }
});

export default router;
