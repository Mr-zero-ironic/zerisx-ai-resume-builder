export type AITone = 'formal' | 'casual' | 'confident' | 'creative' | 'professional' | 'persuasive' | 'concise';
export type AILength = 'short' | 'medium' | 'long';

export async function enhanceSummary(summary: string, tone: AITone = 'formal', length: AILength = 'medium') {
  if (!summary) return "";
  
  const lengthInstruction = {
    short: "Keep it very concise, exactly 1-2 sentences.",
    medium: "Keep it professional, around 2-3 sentences.",
    long: "Provide a detailed summary of 4-5 sentences."
  }[length];

  const toneInstruction = {
    formal: "Use a very professional, corporate tone.",
    casual: "Use a friendly, approachable, yet professional tone.",
    confident: "Use strong, assertive language that highlights leadership and expertise.",
    creative: "Use more expressive and unique language to stand out.",
    professional: "Use a balanced, industry-standard professional tone.",
    persuasive: "Use compelling language designed to sell your skills and convince recruiters.",
    concise: "Use extremely direct and punchy language, removing any fluff."
  }[tone];

  try {
    const response = await fetch("/api/enhance-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary, tone, lengthInstruction, toneInstruction }),
    });
    const data = await response.json();
    return data.text || summary;
  } catch (error) {
    console.error("API Error (Summary):", error);
    return summary;
  }
}

export async function enhanceExperience(description: string, tone: AITone = 'formal', length: AILength = 'medium') {
  if (!description) return "";

  const lengthInstruction = {
    short: "Provide 2-3 high-impact bullet points.",
    medium: "Provide 3-5 balanced bullet points.",
    long: "Provide 5-7 detailed bullet points."
  }[length];

  const toneInstruction = {
    formal: "Use standard corporate professional language.",
    casual: "Use modern, direct, and slightly less rigid language.",
    confident: "Focus heavily on results, metrics, and high-level impact.",
    creative: "Use dynamic and engaging language to describe tasks.",
    professional: "Use clear, balanced, and industry-standard professional language.",
    persuasive: "Focus on selling your impact and convincing the reader of your value.",
    concise: "Use very short, direct bullet points that get straight to the point."
  }[tone];

  try {
    const response = await fetch("/api/enhance-experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, tone, lengthInstruction, toneInstruction }),
    });
    const data = await response.json();
    return data.text || description;
  } catch (error) {
    console.error("API Error (Experience):", error);
    return description;
  }
}
