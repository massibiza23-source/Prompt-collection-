import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing. AI generation will not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export interface GeneratedPrompt {
  title: string;
  content: string;
  tags: string[];
}

export async function generateAIPrompt(userInput: string): Promise<GeneratedPrompt> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userInput,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: `You are an expert AI Studio Prompt Engineer. 
Your task is to take a simple idea or title and turn it into a high-quality, professional prompt optimized for Google AI Studio.
Rules:
1. Use clear, imperative language.
2. Use variables in {{variable_name}} format for parts that the user should fill in.
3. Keep it concise to save tokens but structured well.
4. Output ONLY a valid JSON object in this format:
   {
     "title": "A precise, professional title",
     "content": "The full prompt content with {{variables}}",
     "tags": ["Tag1", "Tag2"]
   }
No conversational filler.`,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as GeneratedPrompt;
}
