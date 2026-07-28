const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// ── Framework descriptions ────────────────────────────────────────────────────
const FRAMEWORK_DESCRIPTIONS = {
    STAR: "Situation → Task → Action → Result. Describe the situation you were in, the task assigned, specific actions you took, and the measurable result.",
    PAR:  "Problem → Action → Result. Jump straight to the problem faced, the specific action you took to solve it, and the result achieved.",
    CAR:  "Challenge → Action → Result. Emphasize how difficult the challenge was, then what you did, then the result.",
    XYZ:  "Google's formula: Accomplished [X] as measured by [Y] by doing [Z]. Lead with the achievement, quantify it, then explain how you did it.",
    CARL: "Context → Action → Result → Learning. Like CAR but end with what you personally learned — great for growth stories.",
    SOAR: "Situation → Obstacle → Action → Result. Highlight the specific obstacle or resistance you had to overcome.",
    BAB:  "Before → After → Bridge. Describe the state before you joined/acted, the improved state after, then explain how you bridged the gap.",
    SCAR: "Situation → Conflict → Action → Result. Focus on a specific conflict or disagreement and how you resolved it."
};

/**
 * @description Rewrites every work experience from a resume using the selected framework.
 * @param {string} resumeText - Extracted plain text from the resume PDF
 * @param {string} framework  - One of: STAR, PAR, CAR, XYZ, CARL, SOAR, BAB, SCAR
 */
async function rewriteResumeWithFramework({ resumeText, framework }) {
    const fw = framework.toUpperCase();
    const frameworkDesc = FRAMEWORK_DESCRIPTIONS[fw];

    if (!frameworkDesc) {
        throw new Error(`Unknown framework: ${framework}. Valid: ${Object.keys(FRAMEWORK_DESCRIPTIONS).join(", ")}`);
    }

    const prompt = `You are an expert career coach and resume writer.

A candidate has shared their resume. Rewrite each of their work experiences using the **${fw} framework**.

**${fw} Framework:**
${frameworkDesc}

**Candidate's Resume:**
${resumeText}

**Instructions:**
1. Identify each distinct work experience (job, internship, or significant project) from the resume
2. For each experience, rewrite the description using the ${fw} framework in 3-5 clear sentences
3. Be specific and professional — use strong action verbs
4. Include numbers or metrics wherever possible
5. If a field is unknown, make a reasonable inference based on the role

**Return ONLY valid JSON. No markdown fences. No explanation. No extra text.**

Exact structure required:
{
  "framework": "${fw}",
  "experiences": [
    {
      "role": "Job Title Here",
      "company": "Company Name Here",
      "period": "Month Year - Month Year",
      "original": "Brief original description from resume (1-2 sentences max)",
      "rewritten": "Full rewritten experience using ${fw} framework (3-5 sentences)"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        });

        const rawText = response.text?.trim();
        if (!rawText) throw new Error("Empty response from AI");

        // Safely extract JSON — remove markdown fences if present
        let jsonString = rawText;
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) jsonString = jsonMatch[0];

        const parsed = JSON.parse(jsonString);

        // Basic validation without Zod (compatible with all Zod versions)
        if (!parsed.framework || !Array.isArray(parsed.experiences)) {
            throw new Error("AI returned invalid structure");
        }

        // Sanitise each experience — fill missing fields with fallback
        parsed.experiences = parsed.experiences.map(exp => ({
            role:      exp.role      || "Unknown Role",
            company:   exp.company   || "Unknown Company",
            period:    exp.period    || "",
            original:  exp.original  || "",
            rewritten: exp.rewritten || ""
        }));

        return parsed;

    } catch (error) {
        console.error("rewriteResumeWithFramework error:", error.message);
        throw error;
    }
}

module.exports = { rewriteResumeWithFramework };
