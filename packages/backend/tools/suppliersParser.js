// tools/suppliersParser.js
import * as cheerio from 'cheerio';

const GZ_BASE = 'https://goszakup.gov.kz';

/**
 * Парсит HTML реестра участников ГЗ (supplierreg)
 */
export function parseSuppliersHtml(html) {
    const $ = cheerio.load(html);

    const suppliers = [];

    $('#search-result tbody tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length < 5) return;

        const participantIdText = $(tds[0]).text().trim();
        const participantId = participantIdText ? Number(participantIdText) : null;

        const nameAnchor = $(tds[1]).find('a').first();
        const rawName = nameAnchor.text().trim();
        const name = rawName.replace(/\s+/g, ' '); // нормализуем пробелы

        const href = nameAnchor.attr('href') || null;
        const profileUrl = href ? new URL(href, GZ_BASE).toString() : null;

        const bin = $(tds[2]).text().trim() || null;
        const iin = $(tds[3]).text().trim() || null;
        const rnn = $(tds[4]).text().trim() || null;

        suppliers.push({
            participant_id: participantId,
            name,
            bin_iin: bin,
            iin,
            rnn,
            profile_url: profileUrl,
        });
    });

    // Вверху есть строка "Показано c 1 по 50 из 2325 записей"
    const infoText = $('.dataTables_info').text() || '';
    let total = null;
    const match = infoText.match(/из\s+(\d+)\s+записей/i);
    if (match) {
        total = Number(match[1]);
    }

    return {
        total,
        suppliers,
    };
}
