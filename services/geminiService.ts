
import { GoogleGenAI } from "@google/genai";
import { ToneType, Settings } from "../types";

const API_KEY = process.env.API_KEY || "";

export async function humanizeText(text: string, settings: Settings): Promise<string> {
  if (!text.trim()) return "";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are an elite linguistic expert and professional editor. Your goal is to "humanize" AI-generated text.
    
    CRITICAL RULES:
    1. Do not change the core meaning or facts.
    2. Vary sentence length and structure (human writing is "bursty").
    3. Use idiomatic expressions and natural transitions.
    4. Remove common AI markers (e.g., "In conclusion," "It is important to note," excessive hedging, perfectly balanced lists).
    5. Maintain the requested Tone: ${settings.tone}.
    6. Humanization Intensity Level (1-100): ${settings.intensity}. Higher means more significant stylistic changes.
    
    Output ONLY the humanized text. Do not include any headers, footers, or meta-comments.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Text to humanize: \n\n ${text}`,
      config: {
        systemInstruction,
        temperature: 0.8 + (settings.intensity / 500), // Slightly increase randomness for higher intensity
        topP: 0.95,
      }
    });

    return response.text || "Failed to process text. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("An error occurred while humanizing the text. Please check your connection or API status.");
  }
}
