// tools/pdfParser.js
import axios from 'axios';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// pdf-parse может вернуться либо как функция, либо как { default: fn }
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;

if (typeof pdfParse !== 'function') {
    // чтобы сразу увидеть, если что-то совсем не так
    console.error('pdf-parse module shape:', pdfParseModule);
    throw new Error('pdf-parse module does not export a function');
}

/**
 * Вспомогательная функция: ищет поле по нескольким регуляркам
 */
function extractField(text, patterns) {
    for (const pattern of patterns) {
        const m = text.match(pattern);
        if (m && m[1]) {
            return m[1].trim();
        }
    }
    return null;
}

/**
 * Разбор текста техспеки (рус + казах варианты)
 */
export function extractTechSpecFields(text) {
    const purchaseNumber = extractField(text, [
        /Номер закупки:\s*№?\s*([^\n]+)/i,
        /Сатып алудың нөмірі:\s*№?\s*([^\n]+)/i,
    ]);

    const purchaseName = extractField(text, [
        /Наименование\s+закупки:\s*([^\n]+)/i,
        /Сатып алудың атауы:\s*([^\n]+)/i,
    ]);

    const lotNumber = extractField(text, [
        /Номер лота:\s*№?\s*([^\n]+)/i,
        /Лоттың нөмірі:\s*№?\s*([^\n]+)/i,
    ]);

    const lotName = extractField(text, [
        /Наименование лота:\s*([^\n]+)/i,
        /Лоттың атауы\s*:?\s*([^\n]+)/i,
    ]);

    const lotDescription = extractField(text, [
        /Описание лота:\s*([^\n]+)/i,
        /Лоттың сипаттауы:\s*([^\n]+)/i,
    ]);

    const lotExtraDescription = extractField(text, [
        /Дополнительное\s+описание лота:\s*([^\n]+)/i,
        /Лоттың қысқаша\s*сипаттауы:\s*([^\n]+)/i,
    ]);

    const quantityRaw = extractField(text, [
        /Количество:\s*([^\n]+)/i,
        /Саны,\s*көлемі:\s*([^\n]+)/i,
    ]);

    const quantity = quantityRaw ? Number(quantityRaw.replace(',', '.')) || quantityRaw : null;

    const unit = extractField(text, [
        /Единица измерения:\s*([^\n]+)/i,
        /Өлшем бірлігі:\s*([^\n]+)/i,
    ]);

    const deliveryPlace = extractField(text, [
        /Места поставки:\s*([^\n]+)/i,
        /Жеткізу орны:\s*([^\n]+)/i,
    ]);

    const deliveryTerm = extractField(text, [
        /Срок поставки:\s*([^\n]+)/i,
        /Жеткізу мерзімі:\s*([^\n]+)/i,
    ]);

    let characteristics = extractField(text, [
        /Описание и требуемые[\s\S]*?характеристики[^:]*:\s*([\s\S]+)/i,
        /Функционалдық,[\s\S]*?мінездемесін\s*сипаттау:\s*([\s\S]+)/i,
    ]);

    if (characteristics) {
        characteristics = characteristics.trim();
    }

    return {
        purchaseNumber,
        purchaseName,
        lotNumber,
        lotName,
        lotDescription,
        lotExtraDescription,
        quantity,
        unit,
        deliveryPlace,
        deliveryTerm,
        characteristics,
        rawText: text,
    };
}

/**
 * Скачивает PDF по прямой ссылке и возвращает разобранные поля техспеки
 */
export async function fetchAndParseTechSpecPdf(fileUrl) {
    const { data: pdfBuffer } = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': 'Mozilla/5.0',
            Accept: 'application/pdf',
        },
        timeout: 20000,
    });

    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text || '';

    return extractTechSpecFields(text);
}
