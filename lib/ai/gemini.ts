import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const schema = {
  description: "Legal statutory details",
  type: SchemaType.OBJECT,
  properties: {
    actName: { type: SchemaType.STRING, description: "Short name of Act (IPC, BNS, etc)" },
    section: { type: SchemaType.STRING, description: "Section number/code" },
    description: { type: SchemaType.STRING, description: "Technical legal summary" },
    penalty: { type: SchemaType.STRING, description: "Punishment details" },
  },
  required: ["actName", "section", "description", "penalty"],
};

export async function fetchGeminiLegalResearch(query: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema as any,
    },
  });

  const prompt = `Provide accurate Indian legal statutory details for: ${query}. 
  Ensure the description is technical and the penalty is specific.`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini Extraction Failed:", error);
    return null;
  }
}