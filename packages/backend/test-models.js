import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const pager = await ai.models.list({
      config: { pageSize: 50 }, // можно больше/меньше
    });

    console.log("Available models:");
    // ВАЖНО: именно for await, т.к. pager — async-итератор
    for await (const model of pager) {
      console.log(" -", model.name);
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

main();
