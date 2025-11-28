// tools/announcesParser.js
import * as cheerio from 'cheerio';

/**
 * Парсим страницу /search/announce
 * и достаём список объявлений из таблицы #search-result.
 */
export function parseAnnouncesHtml(html) {
    const $ = cheerio.load(html);
    const rows = [];

    const $table = $('#search-result');
    if (!$table.length) return rows;

    $table.find('tbody tr').each((_, tr) => {
        const $tr = $(tr);
        const tds = $tr.find('td');
        if (!tds.length) return;

        const $numCell = $(tds[0]);
        const $nameCell = $(tds[1]);

        // ----- № объявления + кол-во лотов -----
        const announceNumber =
            $numCell.find('strong').text().trim() || $numCell.text().trim() || null;

        let lotsCount = null;
        const lotsText = $numCell.find('small').text();
        const mLots = lotsText && lotsText.match(/Лотов:\s*(\d+)/i);
        if (mLots) {
            lotsCount = Number(mLots[1]);
        }

        // ----- Название объявления + организатор -----
        const $link = $nameCell.find('a').first();
        const href = $link.attr('href') || null;
        const name = $link.text().trim() || null;

        let announceId = null;
        if (href) {
            const mId = href.match(/\/announce\/index\/(\d+)/);
            if (mId) {
                announceId = Number(mId[1]);
            }
        }

        let organizer = null;
        const orgText = $nameCell.find('small').text().replace(/\s+/g, ' ').trim();
        if (orgText) {
            const mOrg = orgText.match(/Организатор:\s*(.+)$/i);
            organizer = mOrg && mOrg[1] ? mOrg[1].trim() : orgText;
        }

        // ----- Остальные колонки -----
        const method = $(tds[2]).text().replace(/\s+/g, ' ').trim() || null;

        const startDate = $(tds[3]).text().replace(/\s+/g, ' ').trim() || null;
        const endDate = $(tds[4]).text().replace(/\s+/g, ' ').trim() || null;

        const amountRaw = $(tds[5]).text().replace(/\s+/g, ' ').trim() || null;

        let amountValue = null;
        if (amountRaw) {
            const cleaned = amountRaw
                .replace(/\s+/g, '')
                .replace(/\u00A0/g, '')
                .replace(',', '.')
                .replace(/[^0-9.]/g, '');
            const num = Number(cleaned);
            if (Number.isFinite(num)) {
                amountValue = num;
            }
        }

        const status = $(tds[6]).text().replace(/\s+/g, ' ').trim() || null;

        rows.push({
            announceId, // 15758600
            announceNumber, // "15758600-1"
            lotsCount, // 2
            name, // текст ссылки
            organizer, // "ГУ \"...\""
            method, // "Запрос ценовых предложений" и т.п.
            startDate, // "20.02.2025 10:00"
            endDate, // "25.02.2025 18:00"
            amountRaw, // "1 234 567,00"
            amountValue, // 1234567.00 (number) или null
            status, // "Прием заявок" / "Закупка состоялась" и т.д.
            href, // относительная ссылка вида "/ru/announce/index/15758600"
        });
    });

    return rows;
}
