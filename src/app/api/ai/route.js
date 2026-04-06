import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function buildSystemInstruction() {
  return [
    "You are Finflow SME's AI assistant.",
    "Be concise and practical. Use bullet points when helpful.",
    "Focus on SME finance workflows: invoices, bills, reconciliation, cash flow, basic accounting hygiene, KPIs, and operational advice.",
    "Do not invent data from the user's database. If numbers are needed, ask for them.",
    "If user asks for legal/tax advice, provide general guidance and suggest consulting a professional.",
  ].join("\n");
}

function toGeminiHistory(messages = []) {
  if (!Array.isArray(messages)) return [];

  // Gemini expects "user" and "model" roles.
  // We drop any unknown roles.
  return messages
    .filter((m) => m && typeof m.text === "string" && m.text.trim())
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));
}

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: body?.model || "gemini-1.5-flash",
      systemInstruction: buildSystemInstruction(),
    });

    const history = toGeminiHistory(messages);
    const lastUser = [...messages].reverse().find((m) => m?.role === "user" && String(m.text || "").trim());

    if (!lastUser) {
      return NextResponse.json(
        { success: false, error: "No user message provided." },
        { status: 400 }
      );
    }

    // Use chat() so we can pass prior turns as history.
    const chat = model.startChat({
      history: history.slice(0, -1), // exclude last user message, we'll send it as the prompt
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(String(lastUser.text));
    const text = result?.response?.text?.() || "";

    return NextResponse.json({ success: true, text });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "AI request failed." },
      { status: 500 }
    );
  }
}

