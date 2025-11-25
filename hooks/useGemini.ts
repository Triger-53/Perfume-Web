
import { useState, useMemo } from 'react';
// FIX: Import ChatSession, which is the correct type for a chat instance.
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';

// IMPORTANT: The user has provided a specific API key to be used directly.
const API_KEY = 'AIzaSyAg4JiidziPAnP5V3ewp6TQTSmlgvxLqUg';
// FIX: Switched to a more standard and robust model to avoid resource exhaustion errors.
const GEMINI_MODEL = 'gemini-2.5-flash';

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastError = e;
      if (e?.response?.status >= 400 && e?.response?.status < 500) {
        throw e;
      }
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export const useGemini = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isAvailable = useMemo(() => {
    console.log(`[DEBUG] Gemini API Key available: ${!!API_KEY}`);
    return !!API_KEY;
  }, []);

  const ai = useMemo(() => {
    if (!isAvailable) {
      console.error("[DEBUG] Gemini API key not found. AI client not initialized.");
      return null;
    }
    console.log("[DEBUG] Initializing Gemini AI client for Google AI endpoint...");
    const client = new GoogleGenerativeAI(API_KEY);
    console.log('[DEBUG] Gemini AI client initialized:', client);
    return client;
  }, [isAvailable]);

  const createChat = (systemInstruction: string): ChatSession | null => {
    console.log(`[DEBUG] useGemini: createChat called with model: ${GEMINI_MODEL}`);
    if (!ai) return null;
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction });
    console.log('[DEBUG] Gemini model created for chat:', model);
    const chatSession = model.startChat({
      history: [],
    });
    console.log('[DEBUG] Chat session started:', chatSession);
    return chatSession;
  };

  const analyzeImage = async (prompt: string, base64Image: string, mimeType: string): Promise<string> => {
    console.log(`[DEBUG] useGemini: analyzeImage called with model: ${GEMINI_MODEL} and prompt:`, prompt);
    if (!ai) {
      const err = "AI client is not initialized because the API key is missing.";
      console.error(`[DEBUG] ${err}`);
      setError(err);
      return Promise.reject(err);
    }
    setLoading(true);
    setError(null);
    try {
      const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
      console.log('[DEBUG] Gemini model for image analysis created:', model);
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      };

      const result = await withRetry(async () => {
        console.log("[DEBUG] Sending request to Gemini for image analysis...");
        const res = await model.generateContent([prompt, imagePart]);
        return res.response;
      });

      const textResponse = result.text();
      console.log("[DEBUG] Gemini image analysis successful. Response:", textResponse);
      return textResponse;
    } catch (e: any) {
      console.error("[DEBUG] Full Gemini API Error in analyzeImage:", e);
      const errorMessage = e.message || "An unknown error occurred while analyzing the image.";
      setError(errorMessage);
      return `Error: ${errorMessage}`;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createChat, analyzeImage, isAvailable };
};
