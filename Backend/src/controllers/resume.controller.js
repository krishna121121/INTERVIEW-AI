const pdfParse = require("pdf-parse");
const { rewriteResumeWithFramework } = require("../services/resume.services");

/**
 * @description Controller to rewrite resume experiences using a chosen framework.
 * Expects: multipart/form-data with `resume` (PDF file) and `framework` (string)
 */
async function rewriteResumeController(req, res) {
    try {
        // Validate file
        if (!req.file) {
            return res.status(400).json({ message: "Resume PDF is required." });
        }

        // Validate framework
        const { framework } = req.body;
        if (!framework) {
            return res.status(400).json({ message: "Framework is required. E.g: STAR, PAR, CAR, XYZ" });
        }

        // Extract text from PDF
        const pdfData = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ message: "Could not extract text from PDF. Please upload a text-based PDF (not scanned image)." });
        }

        // Call AI service
        const result = await rewriteResumeWithFramework({ resumeText, framework });

        return res.status(200).json({
            message: "Resume rewritten successfully.",
            result
        });

    } catch (error) {
        console.error("rewriteResumeController error:", error.message);
        return res.status(500).json({ message: "Failed to rewrite resume. Please try again." });
    }
}

module.exports = { rewriteResumeController };
