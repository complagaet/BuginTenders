import * as cheerio from 'cheerio';

export function parseLotsHtml(html) {
    const $ = cheerio.load(html);

    const tables = $('table').toArray();
    let targetTable = null;

    // Ищем таблицу по заголовкам
    for (const table of tables) {
        const headers = $(table)
            .find('thead th')
            .map((_, th) => $(th).text().trim())
            .get();

        const hasLotNo = headers.some(h => h.includes('№ лота'));
        const hasAnn   = headers.some(h => h.includes('Наименование объявления'));
        const hasLotNm = headers.some(h => h.includes('Наименование') && h.includes('лота'));

        if (hasLotNo && hasAnn && hasLotNm) {
            targetTable = table;
            break;
        }
    }

    // На всякий случай: если не нашли по заголовкам — берём вторую таблицу
    if (!targetTable && tables[1]) {
        targetTable = tables[1];
    }
    if (!targetTable) return [];

    const rows = [];

    $(targetTable)
        .find('tbody tr')
        .each((_, row) => {
            const tds = $(row).find('td');
            if (tds.length < 7) return;

            // 0: № лота
            const lotNumber = $(tds[0]).text().trim() || null;

            // 1: Наименование объявления (+ заказчик + ссылка)
            const announceCell = $(tds[1]);
            const announceLink = announceCell.find('a').first();
            const announceHref = announceLink.attr('href') || '';
            const announceTitle = announceLink.text().trim() || null;

            let announceId = null;
            const m = announceHref.match(/\/announce\/index\/(\d+)/);
            if (m) announceId = m[1];

            let customer = null;
            const small = announceCell.find('small').first();
            if (small.length) {
                const txt = small.text().replace(/\s+/g, ' ').trim();
                customer = txt.replace(/^Заказчик:\s*/i, '').trim() || null;
            }

            // 2: Наименование или описание лота
            const lotCell = $(tds[2]);
            const lotLink = lotCell.find('a').first();
            const lotName =
                (lotLink.text().trim() || lotCell.text().trim()) || null;

            // 3: Кол-во
            const quantity = $(tds[3]).text().replace(/\s+/g, ' ').trim() || null;

            // 4: Сумма, тг.
            const price = $(tds[4]).text().replace(/\s+/g, ' ').trim() || null;

            // 5: Способ закупки
            const method = $(tds[5]).text().replace(/\s+/g, ' ').trim() || null;

            // 6: Статус
            const status = $(tds[6]).text().replace(/\s+/g, ' ').trim() || null;

            rows.push({
                lotNumber,
                announceId,
                announceTitle,
                lotName,
                customer,
                quantity,
                price,
                method,
                status,
            });
        });

    return rows;
}

