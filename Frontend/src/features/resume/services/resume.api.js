import axios from "axios";

const api = axios.create({
    baseURL: "https://interview-ai-xo9l.onrender.com/",
    withCredentials: true,
});

/**
 * @description Sends resume PDF + framework to backend and returns rewritten experiences.
 * @param {File}   resumeFile - PDF file object
 * @param {string} framework  - e.g. "STAR", "PAR", "XYZ"
 */
export const rewriteResume = async ({ resumeFile, framework }) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("framework", framework);

    const response = await api.post("/api/resume/rewrite", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    return response.data;
};
