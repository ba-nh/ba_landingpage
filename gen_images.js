import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function gen() {
  try {
    console.log("Generating accident image...");
    const res1 = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: 'A realistic photo of an elderly driver looking panicked and confused while driving a car, feeling like an accident is about to happen. High quality, dramatic lighting.',
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of res1.candidates[0].content.parts) {
      if (part.inlineData) {
        fs.writeFileSync('/public/accident.png', Buffer.from(part.inlineData.data, 'base64'));
        console.log("Accident image saved.");
        break;
      }
    }

    console.log("Generating bottleneck image...");
    const res2 = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: 'A realistic photo of a busy logistics warehouse where automated guided vehicles (AGVs), forklifts, and boxes are tangled and bottlenecked, causing a massive traffic jam. High quality, industrial setting.',
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of res2.candidates[0].content.parts) {
      if (part.inlineData) {
        fs.writeFileSync('/public/bottleneck.png', Buffer.from(part.inlineData.data, 'base64'));
        console.log("Bottleneck image saved.");
        break;
      }
    }
    console.log("Images generated successfully.");
  } catch (e) {
    console.error("Error generating images:", e);
  }
}
gen();
