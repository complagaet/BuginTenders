// tools/productsParser.js
import * as cheerio from 'cheerio';

/**
 * Парсер вкладки "Лоты" (?tab=lots) на странице объявления.
 * Возвращает список позиций с ценами.
 */
export function parseProductsHtml(html) {
    const $ = cheerio.load(html);

    const tables = $('table').toArray();
    let targetTable = null;

    // 1. Ищем нужную таблицу по заголовкам
    for (const table of tables) {
        const headers = $(table)
            .find('tr')
            .first()
            .find('th')
            .map((_, th) => $(th).text().trim())
            .get();

        const hasLotNumber = headers.some((h) => h.includes('Номер лота'));
        const hasName = headers.some((h) => h === 'Наименование' || h.includes('Наименование'));
        const hasPrice = headers.some((h) => h.includes('Цена за ед.'));
        const hasPlanned = headers.some((h) => h.includes('Плановая сумма'));

        if (hasLotNumber && hasName && hasPrice && hasPlanned) {
            targetTable = table;
            break;
        }
    }

    if (!targetTable) {
        return [];
    }

    const products = [];

    // 2. Разбираем строки (пропускаем заголовок)
    $(targetTable)
        .find('tr')
        .slice(1)
        .each((_, row) => {
            const tds = $(row).find('td');
            if (tds.length < 13) return; // защитимся от служебных строк

            // 0: № п/п
            const index = $(tds[0]).text().trim() || null;

            // 1: Номер лота (с ссылкой и data-lot-id)
            const lotCell = $(tds[1]);
            const lotLink = lotCell.find('a').first();
            const lotNumber =
                lotLink.text().replace(/\s+/g, ' ').trim() ||
                lotCell.text().replace(/\s+/g, ' ').trim() ||
                null;
            const lotId = lotLink.attr('data-lot-id') || null;

            // 2: Заказчик
            const customer = $(tds[2]).text().replace(/\s+/g, ' ').trim() || null;

            // 3: Наименование
            const name = $(tds[3]).text().replace(/\s+/g, ' ').trim() || null;

            // 4: Дополнительная характеристика
            const extra = $(tds[4]).text().replace(/\s+/g, ' ').trim() || null;

            // 5: Цена за ед.
            const pricePerUnit = $(tds[5]).text().replace(/\s+/g, ' ').trim() || null;

            // 6: Кол-во
            const quantity = $(tds[6]).text().replace(/\s+/g, ' ').trim() || null;

            // 7: Ед. изм.
            const unit = $(tds[7]).text().replace(/\s+/g, ' ').trim() || null;

            // 8: Плановая сумма
            const plannedAmount = $(tds[8]).text().replace(/\s+/g, ' ').trim() || null;

            // 9–11: суммы по годам
            const year1Amount = $(tds[9]).text().replace(/\s+/g, ' ').trim() || null;
            const year2Amount = $(tds[10]).text().replace(/\s+/g, ' ').trim() || null;
            const year3Amount = $(tds[11]).text().replace(/\s+/g, ' ').trim() || null;

            // 12: Статус лота
            const lotStatus = $(tds[12]).text().replace(/\s+/g, ' ').trim() || null;

            // 13: Пред. план (чекбокс)
            const prevPlanCell = $(tds[13]);
            const prevPlan = prevPlanCell.find('input[type="checkbox"][checked]').length > 0;

            products.push({
                index,
                lotId,
                lotNumber,
                customer,
                name,
                extra,
                pricePerUnit,
                quantity,
                unit,
                plannedAmount,
                year1Amount,
                year2Amount,
                year3Amount,
                lotStatus,
                prevPlan,
            });
        });

    return products;
}
