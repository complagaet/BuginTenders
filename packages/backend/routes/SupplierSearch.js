// routes/suppliersearch.js
import 'dotenv/config';
import express from 'express';
import axios from 'axios';

import { parseLotsHtml } from '../tools/lotsParser.js';
import { parseWinnersHtml } from '../tools/winnersParser.js';
import { parseProductsHtml } from '../tools/productsParser.js';
import { parseDocumentsHtml } from '../tools/documentsParser.js';
import { parseTechSpecFilesHtml } from '../tools/techspecParser.js';
import { fetchAndParseTechSpecPdf } from '../tools/pdfParser.js';
import { parseSuppliersHtml } from '../tools/suppliersParser.js';

const router = express.Router();
const GZ_BASE = 'https://goszakup.gov.kz';

// ====== helpers ======

function parseNumber(str) {
    if (!str) return null;
    const cleaned = String(str)
        .replace(/\s+/g, '')
        .replace(/\u00A0/g, '') // NBSP
        .replace(',', '.')
        .replace(/[^0-9.]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
}

// вытаскиваем 12-значный БИН/ИИН из строки
function extractBin(str) {
    if (!str) return null;
    const m = String(str).match(/(\d{12})/);
    return m ? m[1] : null;
}

// нормализация относительных ссылок типа "/files/download_file/123"
function normalizeUrl(href) {
    if (!href) return null;
    if (href.startsWith('http://') || href.startsWith('https://')) return href;
    return `${GZ_BASE}${href}`;
}

// ====== основной маршрут пайплайна ======
//
// GET /supplier-search/pipeline?q=утеплитель
//
router.get('/supplier-search/pipeline', async (req, res) => {
    const q = (req.query.q || req.query.name || '').trim();

    if (!q) {
        return res.status(400).json({
            status: 'error',
            message: 'Query parameter "q" (or "name") is required',
        });
    }

    try {
        // 1) Поиск лотов по названию
        const searchParams = new URLSearchParams();
        searchParams.append('filter[name]', q);
        searchParams.append('filter[more]', '6'); // завершённые/неактивные
        searchParams.append('smb', '');

        const searchUrl = `${GZ_BASE}/ru/search/lots?${searchParams.toString()}`;

        const { data: lotsHtml } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                Accept: 'text/html,application/xhtml+xml',
            },
            timeout: 15000,
        });

        const lots = parseLotsHtml(lotsHtml) || [];

        // можно ограничить количество лотов на один запрос, чтобы не DDOS-ить
        const lotsLimited = lots.slice(0, 50);

        // 2) Для каждого лота собираем победителей, товары, документы, техспеки
        const results = await Promise.all(
            lotsLimited.map(async (lot) => {
                const announceId = lot.announceId;
                if (!announceId) {
                    return null;
                }

                try {
                    // --- 2.1. Победители ---
                    const winnersUrl = `${GZ_BASE}/ru/announce/index/${announceId}?tab=winners`;
                    const { data: winnersHtml } = await axios.get(winnersUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0',
                            Accept: 'text/html,application/xhtml+xml',
                        },
                        timeout: 15000,
                    });
                    const winnersRows = parseWinnersHtml(winnersHtml) || [];

                    // пытаемся найти конкретный лот по номеру
                    let winnerRow =
                        winnersRows.find((w) => w.lotNumber === lot.lotNumber) ||
                        winnersRows[0] ||
                        null;

                    // --- 2.2. Товары / цены ---
                    const productsUrl = `${GZ_BASE}/ru/announce/index/${announceId}?tab=lots`;
                    const { data: productsHtml } = await axios.get(productsUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0',
                            Accept: 'text/html,application/xhtml+xml',
                        },
                        timeout: 15000,
                    });
                    const productsRows = parseProductsHtml(productsHtml) || [];

                    let relatedProducts = productsRows;
                    if (winnerRow && winnerRow.lotNumber) {
                        relatedProducts = productsRows.filter(
                            (p) => p.lotNumber === winnerRow.lotNumber
                        );
                    }

                    const items = relatedProducts.map((p) => {
                        const count = parseNumber(p.quantity);
                        const unitPrice = parseNumber(p.pricePerUnit);
                        let total = parseNumber(p.plannedAmount);

                        if (total == null && count != null && unitPrice != null) {
                            total = count * unitPrice;
                        }

                        return {
                            name: p.name || p.extra || null,
                            count,
                            unit: p.unit || null,
                            unit_price: unitPrice,
                            total_price: total,
                        };
                    });

                    // --- 2.3. Документы лота (ищем техспеку) ---
                    const docsUrl = `${GZ_BASE}/ru/announce/index/${announceId}?tab=documents`;
                    const { data: docsHtml } = await axios.get(docsUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0',
                            Accept: 'text/html,application/xhtml+xml',
                        },
                        timeout: 15000,
                    });
                    const documents = parseDocumentsHtml(docsHtml) || [];

                    const techDoc =
                        documents.find((d) =>
                            (d.name || '').toLowerCase().includes('техническая')
                        ) ||
                        documents.find((d) => (d.name || '').toLowerCase().includes('techspec')) ||
                        null;

                    let techSpecBlock = null;

                    if (techDoc && techDoc.documentTypeId) {
                        // --- 2.4. Файлы документа (actionAjaxModalShowFiles) ---
                        const filesUrl = `${GZ_BASE}/ru/announce/actionAjaxModalShowFiles/${announceId}/${techDoc.documentTypeId}`;
                        const { data: filesHtml } = await axios.get(filesUrl, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0',
                                Accept: 'text/html,application/xhtml+xml',
                            },
                            timeout: 15000,
                        });

                        const files = parseTechSpecFilesHtml(filesHtml) || [];
                        const techFile = files.find((f) => f.isTechSpec) || files[0] || null;

                        if (techFile && techFile.fileUrl) {
                            const fileUrl = normalizeUrl(techFile.fileUrl);

                            // --- 2.5. Парсим PDF техспеки ---
                            let parsedTitle = null;
                            let characteristics = null;
                            let lotDescription = null;
                            try {
                                const parsed = await fetchAndParseTechSpecPdf(fileUrl);
                                parsedTitle =
                                    parsed.lotName ||
                                    parsed.purchaseName ||
                                    parsed.lotDescription ||
                                    null;
                                characteristics = parsed.characteristics || null;
                                lotDescription = parsed.lotDescription || null;
                            } catch (e) {
                                console.error(
                                    `Error parsing techspec PDF for announce ${announceId}:`,
                                    e.message || e
                                );
                            }

                            techSpecBlock = {
                                document_id: Number(techDoc.documentTypeId),
                                file_url: fileUrl,
                                parsed_title: parsedTitle,
                                characteristics: characteristics,
                                lot_description: lotDescription,
                            };
                        }
                    }

                    // --- 2.6. Сборка результата по этому лоту ---
                    const customerName = lot.customer || null;
                    const customerBin = extractBin(customerName);

                    const winner = winnerRow?.winner || null;
                    const winnerName = winner?.name || null;
                    const winnerBin = winner?.bin || null;

                    return {
                        lot_id: Number(announceId),
                        lot_number: winnerRow?.lotNumber || lot.lotNumber || null,
                        status: winnerRow?.lotStatus || lot.status || null,

                        customer: {
                            name: customerName,
                            bin_iin_id: customerBin, // если BIN в тексте заказчика
                        },

                        winner: winner
                            ? {
                                  supplier_id: null, // можно потом добить из winner.url, если нужно
                                  name: winnerName,
                                  bin_iin_id: winnerBin,
                              }
                            : null,

                        items,
                        tech_spec: techSpecBlock,
                    };
                } catch (err) {
                    console.error(
                        `Error while aggregating lot announceId=${announceId}:`,
                        err.message || err
                    );
                    return null;
                }
            })
        );

        const filteredResults = results
            .filter(Boolean)
            .filter((r) => r.status === 'Закупка состоялась');

        return res.status(200).json({
            query: q,
            results: filteredResults,
        });
    } catch (e) {
        console.error('Error in /supplier-search/pipeline:', e.message || e);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

// GET /suppliers/search

router.get('/suppliers/search', async (req, res) => {
    try {
        const { name, kato, year, country, type, attribute, page = 1, perPage = 50 } = req.query;

        const params = new URLSearchParams();

        // ФИО/название/БИН/ИИН — то, что вводится в поле "Участник"
        if (name) {
            params.append('filter[name]', String(name));
            // на портале одновременно передаётся и search, и smb / reset
            params.append('search', '');
        }

        // Год регистрации (на портале: filter[year][])
        const yearsArr = Array.isArray(year)
            ? year
            : year
              ? String(year)
                    .split(',')
                    .map((y) => y.trim())
                    .filter(Boolean)
              : [];
        yearsArr.forEach((y) => params.append('filter[year][]', y));

        // Страна резидентства (filter[country][])
        const countriesArr = Array.isArray(country)
            ? country
            : country
              ? String(country)
                    .split(',')
                    .map((c) => c.trim())
                    .filter(Boolean)
              : [];
        countriesArr.forEach((c) => params.append('filter[country][]', c));

        // Регион участника (filter[kato])
        if (kato) {
            params.append('filter[kato]', String(kato));
        }

        // Признаки (Заказчик / Поставщик и т.д.) — filter[type][]
        const typesArr = Array.isArray(type)
            ? type
            : type
              ? String(type)
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
              : [];
        typesArr.forEach((t) => params.append('filter[type][]', t));

        // Признак субъекта заказчика — filter[attribute]
        if (attribute) {
            params.append('filter[attribute]', String(attribute));
        }

        // Пагинация
        params.append('count_record', String(perPage)); // 10/20/50/100 и т.д.
        params.append('page', String(page));

        const url = `${GZ_BASE}/ru/registry/supplierreg?${params.toString()}`;

        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                Accept: 'text/html,application/xhtml+xml',
            },
            timeout: 15000,
        });

        const { suppliers, total } = parseSuppliersHtml(html);

        return res.status(200).json({
            query: {
                name: name || null,
                kato: kato || null,
                year: yearsArr,
                country: countriesArr,
                type: typesArr,
                attribute: attribute || null,
                page: Number(page),
                perPage: Number(perPage),
            },
            total,
            results: suppliers,
        });
    } catch (e) {
        console.error('Error in /suppliers/search:', e?.message || e);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

export default router;
