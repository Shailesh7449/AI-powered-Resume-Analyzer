import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface AiEnhancementResult {
  executiveSummaryAnalysis: string;
  bulletPointRewrites: {
    original: string;
    improved: string;
    rationale: string;
  }[];
  tailoringAdvice: string[];
}

/**
 * Uses Gemini 3.8 Flash strictly for semantic explanation and bullet point rewriting,
 * never for fabricating scores or entities.
 */
export async function generateAiEnhancement(
  resumeText: string,
  targetJobDescription?: string
): Promise<AiEnhancementResult | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const prompt = `You are a principal technical recruiter and resume strategist. Analyze the provided resume text ${
      targetJobDescription ? 'and target job description' : ''
    }.
Provide:
1. A concise, realistic executive summary analysis (2-3 sentences assessing market readiness).
2. Exactly 3 high-impact bullet point rewrites of the weakest or least quantified bullets in the resume. Each rewrite must follow the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]" using strong action verbs.
3. 3 specific tailoring recommendations.

Resume text:
${resumeText.slice(0, 3000)}

${targetJobDescription ? `Target Job Description:\n${targetJobDescription.slice(0, 2000)}` : ''}

Respond in strictly valid JSON format with keys:
{
  "executiveSummaryAnalysis": "...",
  "bulletPointRewrites": [
    { "original": "...", "improved": "...", "rationale": "..." }
  ],
  "tailoringAdvice": ["...", "...", "..."]
}`;

    const apiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    // 5-second timeout safeguard so analysis never delays
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI timeout')), 5000)
    );

    const response = await Promise.race([apiPromise, timeoutPromise]);
    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    return {
      executiveSummaryAnalysis: parsed.executiveSummaryAnalysis || '',
      bulletPointRewrites: Array.isArray(parsed.bulletPointRewrites) ? parsed.bulletPointRewrites : [],
      tailoringAdvice: Array.isArray(parsed.tailoringAdvice) ? parsed.tailoringAdvice : [],
    };
  } catch (err: any) {
    console.warn('Gemini enhancement warning (using local NLP rewrite fallback):', err?.message || err);
    return null;
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResumeContext {
  candidateName?: string;
  summary?: string;
  skills?: string[];
  atsScore?: number;
  atsBreakdown?: Record<string, { score: number; maxScore: number; feedback: string }>;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  experience?: { role: string; company: string; duration: string; highlights: string[] }[];
  education?: { degree: string; institution: string; year: string }[];
  projects?: { name: string; description: string; technologies: string[] }[];
  jobMatch?: {
    overallMatchScore: number;
    detectedJobRole: string;
    matchingSkills: string[];
    missingSkills: string[];
  } | null;
  jobRecommendations?: { roleTitle: string; matchPercentage: number; whyFits: string }[];
}

export async function chatWithCareerAssistant(
  messages: ChatMessage[],
  context: ChatResumeContext
): Promise<{ reply: string; provider: 'gemini' | 'nlp_rule_engine' }> {
  const ai = getGeminiClient();

  if (ai) {
    try {
      const systemInstruction = `You are the ResumeAI Career Assistant, an expert technical recruiter, hiring manager, and resume strategist.
Your task is to provide personalized, rigorous, and actionable career and resume advice grounded STRICTLY in the candidate's actual resume data and ATS analysis.

GROUND-TRUTH CONTEXT PROVIDED:
- Candidate Name: ${context.candidateName || 'Candidate'}
- Professional Summary: ${context.summary || 'None provided'}
- Extracted Skills: ${(context.skills || []).slice(0, 35).join(', ')}
- ATS Overall Score: ${context.atsScore ?? 'N/A'}/100
- ATS Strengths: ${(context.strengths || []).join('; ')}
- ATS Weaknesses: ${(context.weaknesses || []).join('; ')}
- ATS Recommendations: ${(context.recommendations || []).join('; ')}
- Work Experience (${(context.experience || []).length} roles): ${
        (context.experience || [])
          .map(e => `${e.role} at ${e.company} (${e.duration}): ${(e.highlights || []).slice(0, 2).join(' | ')}`)
          .join('\n  ')
      }
- Education: ${(context.education || []).map(e => `${e.degree} from ${e.institution} (${e.year})`).join(', ')}
- Projects: ${(context.projects || []).map(p => `${p.name}: ${p.description}`).join('; ')}
${
  context.jobMatch
    ? `- Job Match Score: ${context.jobMatch.overallMatchScore}% against "${context.jobMatch.detectedJobRole}"\n- Matching Skills: ${(context.jobMatch.matchingSkills || []).join(', ')}\n- Missing Skills: ${(context.jobMatch.missingSkills || []).join(', ')}`
    : '- No specific Job Description matched yet.'
}
- Top Recommended Roles: ${(context.jobRecommendations || []).slice(0, 3).map(r => `${r.roleTitle} (${r.matchPercentage}%)`).join(', ')}

STRICT OPERATIONAL RULES:
1. TRUTHFULNESS: Never fabricate degrees, employers, certifications, metrics, or technologies that are not in the candidate's profile.
2. DISTINCTION: Clearly distinguish between verified facts from the resume and your suggestions/assumptions.
3. CONCRETE ADVICE: When asked to improve bullets, use the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
4. FORMATTING: Use structured markdown, bold key terms, concise paragraphs, and bullet points.
5. ATS EXPLANATION: Explain ATS scores mathematically based on the 8 factors (structure, keywords, skills match, experience, achievements, formatting, contact info, job alignment).`;

      // Build conversation history
      const promptContents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const apiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContents as any,
        config: {
          systemInstruction,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timeout')), 10000)
      );

      const response = await Promise.race([apiPromise, timeoutPromise]);
      const reply = response.text?.trim();
      if (reply) {
        return { reply, provider: 'gemini' };
      }
    } catch (err: any) {
      console.warn('Gemini chat error, falling back to local NLP assistant:', err?.message || err);
    }
  }

  // High-fidelity NLP rule-grounded assistant fallback
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';
  const candidateName = context.candidateName || 'there';
  const atsScore = context.atsScore ?? 75;
  const skillsList = context.skills || [];
  const weaknesses = context.weaknesses || [];
  const strengths = context.strengths || [];
  const recommendations = context.recommendations || [];
  const jobMatch = context.jobMatch;

  let reply = '';

  if (lastUserMessage.includes('score') || lastUserMessage.includes('ats') || lastUserMessage.includes('breakdown')) {
    reply = `### ATS Compatibility Analysis for **${candidateName}**\n\n` +
      `Your current **ATS Score is ${atsScore}/100**.\n\n` +
      `**Key Strengths Observed:**\n` +
      (strengths.length > 0 ? strengths.map(s => `- ✅ ${s}`).join('\n') : '- Structured section headers and contact information detected.') +
      `\n\n**Areas for Immediate Improvement:**\n` +
      (weaknesses.length > 0 ? weaknesses.map(w => `- ⚠️ ${w}`).join('\n') : '- Quantify bullet points with metrics and percentages.') +
      `\n\n**Top ATS Recommendations:**\n` +
      (recommendations.length > 0 ? recommendations.map(r => `1. ${r}`).join('\n') : '1. Incorporate specific industry keywords throughout your experience bullets.\n2. Ensure chronological dates and clear role titles.');
  } else if (lastUserMessage.includes('skill') || lastUserMessage.includes('gap') || lastUserMessage.includes('missing')) {
    if (jobMatch && jobMatch.missingSkills && jobMatch.missingSkills.length > 0) {
      reply = `### Skill Gap Breakdown for **${jobMatch.detectedJobRole || 'Target Role'}**\n\n` +
        `Based on our semantic comparison against the target job requirements:\n\n` +
        `**Matched Skills (${jobMatch.matchingSkills.length}):**\n` +
        `- ${jobMatch.matchingSkills.join(', ')}\n\n` +
        `**Missing / High-Priority Gaps (${jobMatch.missingSkills.length}):**\n` +
        `- ❌ ${jobMatch.missingSkills.join('\n- ❌ ')}\n\n` +
        `**Suggested Action:** If you have practical project or coursework experience in any of these missing areas, add relevant evidence under your Projects or Technical Skills section.`;
    } else {
      reply = `### Extracted Skills Catalog\n\n` +
        `We identified **${skillsList.length} canonical technical skills** in your profile:\n\n` +
        `**Current Core Skills:**\n` +
        `${skillsList.slice(0, 15).map(s => `• \`${s}\``).join(' ')}\n\n` +
        `To run a targeted skill-gap analysis, compare your resume against a specific job description in the **Job Match** tab!`;
    }
  } else if (lastUserMessage.includes('bullet') || lastUserMessage.includes('rewrite') || lastUserMessage.includes('experience')) {
    const firstRole = context.experience?.[0];
    const sampleHighlight = firstRole?.highlights?.[0] || 'Managed project tasks and coordinated with cross-functional teams.';
    reply = `### Bullet Point Optimization (Google XYZ Formula)\n\n` +
      `Strong resume bullets follow the formula: **"Accomplished [X] as measured by [Y], by doing [Z]"**.\n\n` +
      `**Current Example from your experience:**\n` +
      `> *"${sampleHighlight}"*\n\n` +
      `**Recommended XYZ Rewrite Pattern:**\n` +
      `> *"Architected [System/Feature], improving deployment velocity by **35%** and reducing downtime by **40%**, by implementing automated CI/CD and containerized microservices."*\n\n` +
      `**3 Rules to apply across all your bullets:**\n` +
      `1. **Start with high-impact verbs** (e.g., *Spearheaded, Engineered, Orchestrated, Optimized*).\n` +
      `2. **Include numerical proof** (percentages, latency reduction, dollar savings, user scale).\n` +
      `3. **Name technologies explicitly** (mention the specific stack used for that accomplishment).`;
  } else if (lastUserMessage.includes('role') || lastUserMessage.includes('job') || lastUserMessage.includes('recommend')) {
    const roles = context.jobRecommendations || [];
    reply = `### Recommended Career Paths\n\n` +
      `Based on your canonical skill profile and experience breadth, here are top matching market roles:\n\n` +
      (roles.length > 0
        ? roles.slice(0, 3).map(r => `* **${r.roleTitle}** (${r.matchPercentage}% match)\n  *Why it fits:* ${r.whyFits}`).join('\n\n')
        : `* **Full Stack Software Engineer** — Strong match with your languages and frontend/backend experience.\n* **Backend Systems Engineer** — Matches your API and database capabilities.`) +
      `\n\nHead to the **Find Jobs** tab to explore real live opportunities for these titles!`;
  } else {
    reply = `### Hello ${candidateName}! 👋\n\n` +
      `I am your **ResumeAI Career Assistant**. I've analyzed your resume and ATS evaluation results:\n\n` +
      `- **ATS Score:** **${atsScore}/100**\n` +
      `- **Skills Identified:** **${skillsList.length} entities**\n` +
      `- **Roles Parsed:** **${(context.experience || []).length} past positions**\n\n` +
      `Here are questions you can ask me:\n` +
      `1. *"Why is my ATS score ${atsScore} and how can I reach 90+?"*\n` +
      `2. *"What are my biggest skill gaps for high-paying roles?"*\n` +
      `3. *"How can I improve my work experience bullets?"*\n` +
      `4. *"Which job titles best match my background?"*\n` +
      `5. *"How do I tailor this resume for a specific job posting?"*`;
  }

  const notice = ai
    ? ''
    : '\n\n---\n*💡 Note: Connected to local NLP rule engine. Set GEMINI_API_KEY in your environment for conversational AI powered by Gemini 3.8 Flash.*';

  return {
    reply: reply + notice,
    provider: 'nlp_rule_engine',
  };
}

