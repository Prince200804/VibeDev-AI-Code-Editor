"use node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";
import { action } from "./_generated/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getAIAssistance = action({
  args: {
    userPrompt: v.string(),
    currentCode: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are an expert coding assistant. The user is working with ${args.language} code.

Current Code:
\`\`\`${args.language}
${args.currentCode}
\`\`\`

User Request: ${args.userPrompt}

Please provide the corrected or improved code. Return ONLY the code without any explanations, markdown formatting, or code block markers. Just the raw code that can be directly inserted into the editor.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const generatedCode = response.text();

      // Remove markdown code blocks if present
      let cleanedCode = generatedCode
        .replace(/```[\w]*\n/g, "")
        .replace(/```/g, "")
        .trim();

      return {
        success: true,
        code: cleanedCode,
      };
    } catch (error) {
      console.error("AI Assistant Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get AI assistance",
      };
    }
  },
});
