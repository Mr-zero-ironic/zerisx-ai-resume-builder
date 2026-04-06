import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey || "" });

  // API Routes
  app.post("/api/enhance-summary", async (req, res) => {
    const { summary, tone, lengthInstruction, toneInstruction } = req.body;
    
    if (!summary) {
      return res.status(400).json({ error: "Summary is required" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Enhance this professional summary for a resume: "${summary}"`,
        config: {
          systemInstruction: `You are a professional resume writer. ${toneInstruction} ${lengthInstruction} Focus on achievements and skills.`,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          maxOutputTokens: 1000,
        },
      });
      res.json({ text: response.text || summary });
    } catch (error) {
      console.error("Gemini Error (Summary):", error);
      res.status(500).json({ error: "Failed to enhance summary" });
    }
  });

  app.post("/api/enhance-experience", async (req, res) => {
    const { description, tone, lengthInstruction, toneInstruction } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Rewrite these resume bullet points: "${description}"`,
        config: {
          systemInstruction: `You are a professional resume writer. ${toneInstruction} ${lengthInstruction} Use strong action verbs and quantify achievements where possible. Keep it in bullet point format.`,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          maxOutputTokens: 1000,
        },
      });
      res.json({ text: response.text || description });
    } catch (error) {
      console.error("Gemini Error (Experience):", error);
      res.status(500).json({ error: "Failed to enhance experience" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
