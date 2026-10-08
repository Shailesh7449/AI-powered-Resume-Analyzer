import { getGeminiClient } from './gemini.js';

export async function editSectionWithAi(
  textToEdit: string,
  mode: 'ats' | 'clarity' | 'verbs' | 'concise' | 'grammar' | 'jd_match',
  context?: { jobDescription?: string; sectionName?: string }
): Promise<string> {
  const ai = getGeminiClient();
  if (!ai) {
    // Fallback if no API key
    return `[Mock AI Edit] ${textToEdit} (Improved for ${mode})`;
  }

  let promptInstruction = "";
  switch (mode) {
    case 'ats':
      promptInstruction = "Rewrite to improve ATS compatibility by incorporating industry-standard keywords organically while maintaining truthfulness.";
      break;
    case 'clarity':
      promptInstruction = "Rewrite for maximum clarity and professional impact.";
      break;
    case 'verbs':
      promptInstruction = "Rewrite to start with strong, active professional verbs and use the Google XYZ formula if it is an accomplishment.";
      break;
    case 'concise':
      promptInstruction = "Make the text more concise and remove fluff/filler words without losing key information.";
      break;
    case 'grammar':
      promptInstruction = "Fix any grammatical errors and ensure perfect professional English.";
      break;
    case 'jd_match':
      promptInstruction = `Tailor the text to better align with the provided Job Description. Highlight the most relevant skills organically. Job Description: ${context?.jobDescription || 'None'}`;
      break;
  }

  const prompt = `You are a professional resume editor. Your task is to edit the following text from a resume's "${context?.sectionName || 'section'}".
Instruction: ${promptInstruction}

IMPORTANT RULES:
1. NEVER invent companies, job titles, degrees, certifications, technologies, achievements, metrics, or experience.
2. Only output the final improved text. Do NOT include explanations, quotes, or conversational filler.
3. Keep the same format (e.g., if it's a single bullet point, return a single bullet point. If it's a paragraph, return a paragraph).

Original Text:
${textToEdit}
`;

  try {
    const apiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI timeout')), 8000)
    );

    const response = await Promise.race([apiPromise, timeoutPromise]);
    const resultText = response.text?.trim() || textToEdit;
    
    // Strip markdown formatting like ```text if Gemini included it
    return resultText.replace(/^```[\s\S]*?\n/g, '').replace(/```$/g, '').trim();
  } catch (err: any) {
    console.warn('Gemini edit warning:', err?.message || err);
    throw new Error('AI edit failed. Please try again.');
  }
}
