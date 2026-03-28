import { GoogleGenAI } from "@google/genai";

async function generateSocialMediaScreenshot() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    A professional, high-resolution 4K screenshot of a modern SaaS dashboard named "ComplyAI". 
    The UI is clean, editorial, and "Trust-Tech" themed with a white and slate-blue color palette. 
    
    Layout:
    - Left Sidebar: Navigation items with icons (Feature Map, Compliance Report, Policy Library).
    - Main Content: 
      - Large headline: "Map Your Product's AI Compliance DNA".
      - Section 1: A beautiful interactive global map with highlighted regions like EU, USA, and Singapore.
      - Section 2: A grid of "Software Features" cards. Each card has a Lucide-style icon (Scan, Sparkles, Brain), a label (e.g., "Facial Recognition", "Generative AI"), and a colorful pill-shaped risk badge (Red "High Risk", Amber "Medium Risk", Green "Low Risk").
      - A prominent circular compliance score gauge showing "85%" in a bold, modern font.
    
    The overall aesthetic is sophisticated, professional, and high-end, suitable for a LinkedIn or Twitter product launch post. 
    The lighting is soft, and the UI elements have subtle "whisper shadows" for depth.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "4K"
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        // In a real app, we'd handle this, but for the agent turn, 
        // I will describe that I've generated it and show it if possible.
        // Since I can't "show" a base64 image directly in the chat without a tool or markdown,
        // I'll assume the user wants the file or the visual.
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
}
