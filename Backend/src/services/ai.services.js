const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");
const { raw } = require("express");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// ==================== INTERVIEW REPORT ====================
const interviewReportSchema = z.object({
    title: z.string(),
    matchScore: z.number().min(0).max(100),
    technicalQuestion: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestion: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    }))
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert technical interviewer and career coach.

Generate a detailed interview preparation report for the candidate.

**Resume:**
${resume}

**Self Description:**
${selfDescription}

**Job Description:**
${jobDescription}

**Return ONLY valid JSON**. No extra text, no markdown, no explanation.

Use this exact structure:
{
  "title": "Job Title",
  "matchScore": 75,
  "technicalQuestion": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "behavioralQuestion": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "skillGaps": [
    { "skill": "...", "severity": "medium" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "...", "tasks": ["task1", "task2"] }
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
        console.log(rawText);

        // Extract JSON safely
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : rawText;

        const parsedData = JSON.parse(jsonString);
        const validatedReport = interviewReportSchema.parse(parsedData);
        console.log(validatedReport);

        return validatedReport;

    } catch (error) {
        console.error("Error in generateInterviewReport:", error.message);
        throw error;
    }
}

// ==================== RESUME PDF ====================
async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    
    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        },
        printBackground: true
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string()
    });

    const prompt = `Generate a professional resume in HTML format for the candidate.

**Resume:**
${resume}

**Self Description:**
${selfDescription}

**Job Description:**
${jobDescription}

Return ONLY a valid JSON object with a single field "html" containing clean, well-structured, ATS-friendly HTML.
The resume should look professional, simple, and human-written. Keep it 1-2 pages long.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        });

        const rawText = response.text?.trim();

        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : rawText;

        const parsedData = JSON.parse(jsonString);
        const validated = resumePdfSchema.parse(parsedData);

        const pdfBuffer = await generatePdfFromHtml(validated.html);
        return pdfBuffer;

    } catch (error) {
        console.error("Error in generateResumePdf:", error.message);
        throw error;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };