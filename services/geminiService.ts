
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getDesignAdvice(userVibe: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert interior designer. A customer is looking for furniture advice for their home. They described their vibe as: "${userVibe}". 
        Give them 3-4 specific styling tips and suggest what kind of furniture colors and materials (e.g. velvet, oak, industrial metal) would suit them best. Keep it encouraging and professional. Limit to 150 words.`,
        config: {
          temperature: 0.7,
          topP: 0.95,
        }
      });
      return response.text || "I'm having trouble visualizing that right now, but I bet it will look great! Try searching our Living Room collection for inspiration.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to get design advice at the moment. Please try again later.";
    }
  }

  async getLocationInfo(latitude?: number, longitude?: number): Promise<{ text: string; links: any[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Find and describe the Lumina Home flagship furniture showroom area in San Francisco Design District. Provide details about the vibe of the neighborhood and why it's a great place to visit for furniture enthusiasts.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: latitude && longitude ? { latitude, longitude } : undefined
            }
          }
        },
      });

      const text = response.text || "Our flagship showroom is located in the heart of the San Francisco Design District.";
      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return { text, links };
    } catch (error) {
      console.error("Gemini Maps Error:", error);
      return { 
        text: "Our flagship showroom is located in the heart of the San Francisco Design District, surrounded by the city's most prestigious galleries and design studios.",
        links: []
      };
    }
  }
}

export const geminiService = new GeminiService();
