
import { GoogleGenAI } from "@google/genai";
import { LoveLetterParams } from "../types";

// Helper to initialize AI with the current API key from environment
const getAIInstance = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const generateLoveLetter = async (params: LoveLetterParams): Promise<string> => {
  try {
    // Always create a new instance before generating content to use the most recent API key
    const ai = getAIInstance();
    const prompt = `Write a beautiful, deeply ${params.tone} love letter for Harini from her husband Sivasudhan. 
      Mention that he loves her ${params.trait1} and ${params.trait2}. 
      Incorporate their favorite memory together: "${params.favoriteMemory}". 
      The letter should be eloquent and heartfelt, written as if Sivasudhan is speaking directly to her.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        temperature: 0.9
      },
    });

    return response.text || "My dearest Harini, words fail me today, but my heart remains full of you...";
  } catch (error) {
    console.error("Error generating love letter:", error);
    return "My dearest Harini, words fail me today, but my heart remains full of you. Every moment with you is a treasure, and I am grateful for your love every single day. You are my everything. - Sivasudhan";
  }
};

export const generateRelationshipReport = async (husband: string, wife: string): Promise<string> => {
  try {
    // Create a fresh instance for each request
    const ai = getAIInstance();
    const prompt = `Generate a formal "Legal Declaration of Eternal Marriage" for ${husband} and ${wife}. 
      Structure it with sections like "The Foundations of the Bond", "The Decree of Infinite Love", and "Final Proclamation".
      The tone should be majestic, formal, and deeply romantic, as if issued by the Ministry of Fate.
      Keep it within 250 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        temperature: 0.8
      }
    });

    return response.text || "An eternal bond recognized by the stars themselves...";
  } catch (error) {
    console.error("Error generating relationship report:", error);
    return `THE FOUNDATIONS OF THE BOND\n\nBe it known across all realms that ${husband} and ${wife} have forged a connection transcending mortal understanding. Their souls, intertwined by destiny, have chosen each other across infinite possibilities.\n\nTHE DECREE OF INFINITE LOVE\n\nThis union is hereby declared eternal and unbreakable. Through joy and challenge, through seasons of change and moments of stillness, their love shall remain constant as the stars above.\n\nFINAL PROCLAMATION\n\nLet it be recorded in the annals of time that ${husband} and ${wife} are bound by a love that knows no end. May their journey together be filled with laughter, understanding, and endless devotion.`;
  }
};

export const generateRomanticArt = async (prompt: string): Promise<string> => {
  try {
    // Create a fresh instance for each request
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          { text: `A highly artistic, romantic illustration: ${prompt}. Cinematic lighting, soft pastels, oil painting style, ethereal and beautiful.` }
        ],
      },
      config: {
        temperature: 0.8
      },
    });

    // For now, return empty string as image generation might not be available
    // The app will fall back to using the user photos
    return "";
  } catch (error) {
    console.error("Error generating romantic art:", error);
    return "";
  }
};
