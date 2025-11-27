import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

router.get('/check', async (req, res) => {
  const bin = (req.query.bin || req.query.query || '').trim();

  if (!/^\d{12}$/.test(bin)) {
    return res.status(400).json({
      query: bin,
      error: 'Invalid BIN format. Expected 12 digits',
    });
  }

  try {
    // Формируем URL с БИН в filter[biin]
    const url = `https://goszakup.gov.kz/ru/registry/rnu?filter[name]=&search=&filter[biin]=${bin}&filter[innunp]=&filter[head_biin]=&filter[start_date_from]=&filter[start_date_to]=&filter[head_innunp]=&filter[head_snils]=&filter[kopf]=&filter[end_date_from]=&filter[end_date_to]=`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    
    // Ищем в таблице строку с нашим БИН
    let foundCompany = null;

    $('table tr').each((i, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      // Проверяем каждую ячейку
      cells.each((j, cell) => {
        const cellText = $(cell).text().trim().replace(/\s+/g, '');
        
        if (cellText === bin) {
          // Нашли БИН! Берём название из 2-й колонки (index 1)
          foundCompany = cells.eq(1).text().trim();
          return false; // break
        }
      });
      
      if (foundCompany) return false; // break outer loop
    });

    if (foundCompany) {
      return res.json({
        query: bin,
        result: true,
        company: foundCompany,
      });
    } else {
      return res.json({
        query: bin,
        result: false,
        company: 'none',
      });
    }

  } catch (err) {
    return res.status(500).json({
      query: bin,
      result: null,
      company: 'none',
      error: 'RNU check failed',
      details: err.message,
    });
  }
});

export default router;