const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// ── Zod schema for one rewritten experience ──────────────────────────────────
const rewrittenExperienceSchema = z.object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    original: z.string(),
    rewritten: z.string()
});

const rewriteResponseSchema = z.object({
    framework: z.string(),
    experiences: z.array(rewrittenExperienceSchema)
});

// ── Framework descriptions sent to Gemini ────────────────────────────────────
const FRAMEWORK_DESCRIPTIONS = {
    STAR: "Situation → Task → Action → Result. Describe the situation, what the task was, what actions you took, and what the measurable result was.",
    PAR:  "Problem → Action → Result. Jump straight to the problem faced, the action taken, and the result achieved.",
    CAR:  "Challenge → Action → Result. Emphasize how difficult the challenge was before explaining what you did and the result.",
    XYZ:  "Google's formula: 'Accomplished X, as measured by Y, by doing Z'. Lead with the achievement, quantify it, then explain how.",
    CARL: "Context → Action → Result → Learning. Same as CAR but add what you learned — great for failure/growth questions.",
    SOAR: "Situation → Obstacle → Action → Result. Highlight the specific obstacle or resistance you overcame.",
    BAB:  "Before → After → Bridge. Describe the state before you joined, the state after your work, then bridge how you got there.",
    SCAR: "Situation → Conflict → Action → Result. Focus on interpersonal conflict, disagreement, or a difficult team dynamic."
};

/**
 * @description Rewrites every work experience in a resume using the selected framework.
 * @param {string} resumeText - Extracted plain text from the resume PDF
 * @param {string} framework  - One of: STAR, PAR, CAR, XYZ, CARL, SOAR, BAB, SCAR
 * @returns {Object} - { framework, experiences: [{ role, company, period, original, rewritten }] }
 */
async function rewriteResumeWithFramework({ resumeText, framework }) {
    const frameworkDesc = FRAMEWORK_DESCRIPTIONS[framework.toUpperCase()];

    if (!frameworkDesc) {
        throw new Error(`Unknown framework: ${framework}. Valid options: ${Object.keys(FRAMEWORK_DESCRIPTIONS).join(", ")}`);
    }

    const prompt = `You are an expert career coach and resume writer.

A candidate has shared their resume. Your task is to rewrite each of their work experiences using the **${framework} framework**.

**${framework} Framework:**
${frameworkDesc}

**Candidate's Resume:**
${resumeText}

**Instructions:**
1. Identify each distinct work experience (job/internship/project) from the resume
2. For each experience, rewrite the description using the ${framework} framework
3. Keep it concise, professional, and achievement-focused
4. Use strong action verbs
5. Include numbers/metrics wherever possible (infer reasonable ones if not stated)

**Return ONLY valid JSON. No markdown. No explanation. No extra text.**

Use this exact structure:
{
  "framework": "${framework}",
  "experiences": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "period": "Month Year – Month Year",
      "original": "Original description from resume (keep brief)",
      "rewritten": "Rewritten using ${framework} framework in 3-5 sentences"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        });

        const rawText = response.text?.trim();

        // Safely extract JSON
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : rawText;

        const parsedData = JSON.parse(jsonString);
        const validated = rewriteResponseSchema.parse(parsedData);

        return validated;

    } catch (error) {
        console.error("Error in rewriteResumeWithFramework:", error.message);
        throw error;
    }
}

module.exports = { rewriteResumeWithFramework };
