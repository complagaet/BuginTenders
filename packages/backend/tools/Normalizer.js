import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function normalizeName(query) {
  try {
    const prompt = `
Ты — умный классификатор товаров.
Вход: "${query}"
Задача: вернуть КОРОТКОЕ обозначение категории товара на русском (1–2 слова, существительное).
Пример:
Вход: "MacBook Air 15 2025 m5"
Выход: "ноутбук"

Верни ТОЛЬКО одно короткое название категории без пояснений.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    // В новых SDK обычно есть уже готовое поле text
    let text = response.text;
    if (typeof text !== "string") {
      // запасной вариант, если структура другая
      const cand = response.candidates?.[0];
      const parts = cand?.content?.parts || [];
      text = parts.map((p) => p.text || "").join(" ");
    }

    return String(text || "").trim();
  } catch (err) {
    console.error("Gemini normalization error:", err);
    throw err;
  }
}
