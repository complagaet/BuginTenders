// tools/techspecParser.js
import * as cheerio from 'cheerio';

/**
 * Парсит HTML с actionAjaxModalShowFiles (вкладка файлов документа),
 * вытаскивает все документы (в т.ч. техспеку).
 *
 * Возвращает массив объектов:
 * {
 *   lotNumber,
 *   fileName,
 *   fileUrl,
 *   author,
 *   organization,
 *   createdAt,
 *   signature,
 *   isTechSpec
 * }
 */
export function parseTechSpecFilesHtml(html) {
    const $ = cheerio.load(html);

    const tables = $('table').toArray();
    let targetTable = null;

    // Ищем таблицу по заголовкам: "Номер лота", "Документ", "Автор" и т.д.
    for (const table of tables) {
        const headers = $(table)
            .find('tr')
            .first()
            .find('th')
            .map((_, th) => $(th).text().trim())
            .get();

        const hasLotNumber = headers.some(h => h.includes('Номер лота'));
        const hasDocument = headers.some(h => h.includes('Документ'));
        const hasAuthor = headers.some(h => h.includes('Автор'));

        if (hasLotNumber && hasDocument && hasAuthor) {
            targetTable = table;
            break;
        }
    }

    if (!targetTable) {
        return [];
    }

    const docs = [];

    $(targetTable)
        .find('tr')
        .slice(1) // пропускаем заголовок
        .each((_, row) => {
            const tds = $(row).find('td');
            if (tds.length < 5) return;

            // 0: Номер лота
            const lotNumber = $(tds[0]).text().replace(/\s+/g, ' ').trim() || null;

            // 1: Документ (ссылка)
            const docCell = $(tds[1]);
            const link = docCell.find('a').first();
            const fileUrl = link.attr('href') || null;
            const fileName = link.text().replace(/\s+/g, ' ').trim() || null;

            // 2: Автор
            const author = $(tds[2]).text().replace(/\s+/g, ' ').trim() || null;

            // 3: Организация
            const organization = $(tds[3]).text().replace(/\s+/g, ' ').trim() || null;

            // 4: Дата создания
            const createdAt =
                (tds[4] && $(tds[4]).text().replace(/\s+/g, ' ').trim()) || null;

            // 5: Подпись (если есть колонка)
            const signature =
                (tds[5] && $(tds[5]).text().replace(/\s+/g, ' ').trim()) || null;

            const isTechSpec =
                (fileName && fileName.toLowerCase().includes('techspec')) ||
                (fileName && fileName.toLowerCase().includes('техн') && fileName.toLowerCase().includes('спец'));

            docs.push({
                lotNumber,
                fileName,
                fileUrl,
                author,
                organization,
                createdAt,
                signature,
                isTechSpec,
            });
        });

    return docs;
}

/**
 * Утилита: вернуть первую техспецификацию (если она есть).
 */
export function findFirstTechSpecFile(html) {
    const docs = parseTechSpecFilesHtml(html);
    return docs.find(d => d.isTechSpec) || null;
}
