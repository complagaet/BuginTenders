// tools/documentsParser.js
import * as cheerio from 'cheerio';

/**
 * Парсер вкладки "Документация" (?tab=documents) на странице объявления.
 * Возвращает список документов, включая "Техническая спецификация".
 *
 * Структура строки таблицы:
 *  <tr>
 *    <td>Наименование документа</td>
 *    <td>Признак (Да/Нет)</td>
 *    <td>
 *      <button onclick="actionModalShowFiles(15683567,266);">Перейти</button>
 *    </td>
 *  </tr>
 */
export function parseDocumentsHtml(html) {
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

        const hasName = headers.some((h) => h.includes('Наименование документа'));
        const hasFlag = headers.some((h) => h.includes('Признак'));

        if (hasName && hasFlag) {
            targetTable = table;
            break;
        }
    }

    if (!targetTable) {
        return [];
    }

    const docs = [];

    // 2. Разбираем строки (пропускаем заголовок)
    $(targetTable)
        .find('tr')
        .slice(1)
        .each((_, row) => {
            const tds = $(row).find('td');
            if (tds.length < 2) return;

            // 0: Наименование документа
            const name = $(tds[0]).text().replace(/\s+/g, ' ').trim() || null;

            // 1: Признак (Да/Нет)
            const flagText = $(tds[1]).text().replace(/\s+/g, ' ').trim() || null;
            const flag = flagText === 'Да';

            // 2: Кнопка "Перейти" с actionModalShowFiles(announceId, documentTypeId)
            let hasAction = false;
            let announceId = null;
            let documentTypeId = null;

            if (tds[2]) {
                const btn = $(tds[2]).find('button[onclick]').first();
                if (btn.length) {
                    hasAction = true;
                    const onclick = btn.attr('onclick') || '';
                    const m = onclick.match(/actionModalShowFiles\((\d+),\s*(\d+)\)/);
                    if (m) {
                        announceId = m[1];
                        documentTypeId = m[2];
                    }
                }
            }

            docs.push({
                name, // "Техническая спецификация", "Перечень лотов" и т.п.
                flagText, // "Да" / "Нет"
                flag, // true/false
                hasAction, // есть ли кнопка "Перейти"
                announceId, // ID объявления (15683567)
                documentTypeId, // тип документа (263, 281, 266 ...), нужен для actionModalShowFiles
            });
        });

    return docs;
}
