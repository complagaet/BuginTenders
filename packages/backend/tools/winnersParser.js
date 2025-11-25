import * as cheerio from 'cheerio';

/**
 * Парсит вкладку "Информация о победителях" на странице объявления.
 * Возвращает массив победителей по лотам.
 */
export function parseWinnersHtml(html) {
    const $ = cheerio.load(html);

    const tables = $('table').toArray();
    let targetTable = null;

    // 1) Ищем таблицу по заголовкам
    for (const table of tables) {
        const headers = $(table)
            .find('tr')
            .first()
            .find('th')
            .map((_, th) => $(th).text().trim())
            .get();

        const hasLotNumber = headers.some((h) => h.includes('Номер лота'));
        const hasLotName = headers.some((h) => h.includes('Наименование лота'));
        const hasWinner = headers.some((h) => h.includes('Победитель'));

        if (hasLotNumber && hasLotName && hasWinner) {
            targetTable = table;
            break;
        }
    }

    if (!targetTable) {
        return [];
    }

    const rows = [];

    // Вспомогательный парсер ячеек с поставщиком (BIN + имя + ссылка)
    const parseSupplierCell = (td) => {
        const $cell = $(td);
        const link = $cell.find('a').first();

        if (!link.length) {
            const raw = $cell.text().replace(/\s+/g, ' ').trim();
            return raw
                ? {
                      bin: null,
                      name: null,
                      url: null,
                      raw,
                  }
                : null;
        }

        const rawText = link.text().replace(/\s+/g, ' ').trim();
        const [bin, ...rest] = rawText.split(' ');
        const name = rest.join(' ').trim() || null;

        return {
            bin: bin || null,
            name,
            url: link.attr('href') || null,
            raw: rawText,
        };
    };

    // 2) Разбираем строки таблицы (пропускаем заголовок)
    $(targetTable)
        .find('tr')
        .slice(1)
        .each((_, row) => {
            const tds = $(row).find('td');

            // служебная строка с colspan="6" или пустые строки — пропускаем
            if (tds.length < 5) return;

            // 0: Номер лота (внутри ссылка .lot-links с data-id, data-anno)
            const lotCell = $(tds[0]);
            const lotLink = lotCell.find('a.lot-links').first();

            const lotNumber =
                lotLink.text().replace(/\s+/g, ' ').trim() ||
                lotCell.text().replace(/\s+/g, ' ').trim() ||
                null;

            const announceId = lotLink.data('anno') ? String(lotLink.data('anno')) : null;
            const lotId = lotLink.data('id') ? String(lotLink.data('id')) : null;

            // 1: Наименование лота
            const lotName = $(tds[1]).text().replace(/\s+/g, ' ').trim() || null;

            // 2: Плановая сумма лота, тенге
            const plannedAmount = $(tds[2]).text().replace(/\s+/g, ' ').trim() || null;

            // 3: Статус лота
            const lotStatus = $(tds[3]).text().replace(/\s+/g, ' ').trim() || null;

            // 4: Победитель
            const winner = parseSupplierCell(tds[4]);

            // 5: Поставщик, занявший второе место
            const secondPlace = tds[5] ? parseSupplierCell(tds[5]) : null;

            rows.push({
                announceId, // id объявления (15683567)
                lotId, // внутренний id лота (38683709)
                lotNumber, // текстовый номер лота (75547080-ОИ7)
                lotName, // наименование лота
                plannedAmount, // плановая сумма лота
                lotStatus, // статус лота ("Закупка состоялась")
                winner, // { bin, name, url, raw } | null
                secondPlace, // { bin, name, url, raw } | null
            });
        });
    // МОЖНО ДОБАВИТЬ В ПАРСЕР ЧТОБЫ УЧИТЫВАЛ ПАГИНАЦИЮ
    return rows;
}
