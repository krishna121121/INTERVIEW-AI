import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../auth/auth.context.jsx";
import { logout } from "../../auth/Services/auth.api.jsx";
import { rewriteResume } from "../services/resume.api.js";
import "../style/ResumeRewriter.scss";

// ── Framework definitions ─────────────────────────────────────────────────────
const FRAMEWORKS = [
    {
        id: "STAR",
        name: "STAR",
        desc: "Situation → Task → Action → Result",
        color: "#818cf8"
    },
    {
        id: "PAR",
        name: "PAR",
        desc: "Problem → Action → Result",
        color: "#ff2d78"
    },
    {
        id: "CAR",
        name: "CAR",
        desc: "Challenge → Action → Result",
        color: "#f59e0b"
    },
    {
        id: "XYZ",
        name: "XYZ",
        desc: "Google's formula: Accomplished X measured by Y by doing Z",
        color: "#3fb950"
    },
    {
        id: "CARL",
        name: "CARL",
        desc: "Context → Action → Result → Learning",
        color: "#a78bfa"
    },
    {
        id: "SOAR",
        name: "SOAR",
        desc: "Situation → Obstacle → Action → Result",
        color: "#38bdf8"
    },
    {
        id: "BAB",
        name: "BAB",
        desc: "Before → After → Bridge",
        color: "#fb923c"
    },
    {
        id: "SCAR",
        name: "SCAR",
        desc: "Situation → Conflict → Action → Result",
        color: "#f43f5e"
    }
];

// ── Copy Button Component ─────────────────────────────────────────────────────
const CopyBtn = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            className={`copy-btn ${copied ? "copy-btn--copied" : ""}`}
            onClick={handleCopy}
        >
            {copied ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                </>
            )}
        </button>
    );
};

// ── Experience Card ───────────────────────────────────────────────────────────
const ExperienceCard = ({ exp, framework }) => (
    <div className="exp-card">
        <div className="exp-card__header">
            <div className="exp-card__meta">
                <p className="exp-card__role">{exp.role}</p>
                <p className="exp-card__company">{exp.company}</p>
                <p className="exp-card__period">{exp.period}</p>
            </div>
            <CopyBtn text={exp.rewritten} />
        </div>

        <div className="exp-card__body">
            <hr className="exp-card__divider" />

            <div className="exp-section">
                <span className="exp-section__tag exp-section__tag--original">Original</span>
                <p className="exp-section__text exp-section__text--muted">{exp.original}</p>
            </div>

            <div className="exp-section">
                <span className="exp-section__tag exp-section__tag--rewritten">Rewritten · {framework}</span>
                <p className="exp-section__text">{exp.rewritten}</p>
            </div>
        </div>
    </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const ResumeRewriter = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const resumeInputRef = useRef();

    const [resumeFile, setResumeFile] = useState(null);
    const [selectedFramework, setSelectedFramework] = useState("STAR");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    const handleRewrite = async () => {
        if (!resumeFile) {
            setError("Please upload your resume PDF first.");
            return;
        }
        setError("");
        setResult(null);
        setIsLoading(true);
        try {
            const data = await rewriteResume({ resumeFile, framework: selectedFramework });
            setResult(data.result);
        } catch (err) {
            const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError("");
        setResumeFile(null);
        if (resumeInputRef.current) resumeInputRef.current.value = "";
    };

    // ── Loading State ─────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <main className="rw-loading">
                <div className="rw-loading__content">
                    <div className="rw-loading__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.5" fill="none" />
                        </svg>
                    </div>
                    <p className="rw-loading__title">Rewriting with {selectedFramework} Framework</p>
                    <p className="rw-loading__sub">AI is restructuring your experiences...<br />This takes about 15–20 seconds.</p>
                    <div className="rw-dots">
                        <span /><span /><span />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <div className="rewriter-page">

            {/* Profile */}
            <div className="profile-container">
                <div className="profile" onClick={() => setShowProfile(!showProfile)}>
                    {(user?.name || user?.email)?.charAt(0).toUpperCase()}
                </div>
                {showProfile && (
                    <div className="profile-card">
                        <h3>User Profile</h3>
                        <div className="profile-item"><span>Name</span><p>{user?.username}</p></div>
                        <div className="profile-item"><span>Email</span><p>{user?.email}</p></div>
                        <button
                            className="logout-btn"
                            style={{ backgroundColor: "#ff4d4f", color: "white", padding: "5px 8px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", marginTop: "4px" }}
                            onClick={async () => { await logout(); navigate("/login"); }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate("/")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Home
            </button>

            {/* Header */}
            <header className="rewriter-header">
                <h1>Resume <span>Framework</span> Rewriter</h1>
                <p>Upload your resume, pick a framework, and get every work experience rewritten in a structured, interview-ready format — instantly.</p>
            </header>

            {/* Error */}
            {error && <div className="rw-error">{error}</div>}

            {/* Results View */}
            {result ? (
                <section className="results-section">
                    <div className="results-header">
                        <h2>
                            {result.experiences.length} Experience{result.experiences.length !== 1 ? "s" : ""} rewritten using <span>{result.framework}</span>
                        </h2>
                        <button className="try-again-btn" onClick={handleReset}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10" />
                                <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                            </svg>
                            Try Another Framework
                        </button>
                    </div>

                    {result.experiences.map((exp, i) => (
                        <ExperienceCard key={i} exp={exp} framework={result.framework} />
                    ))}
                </section>
            ) : (
                /* Input Card */
                <div className="rewriter-card">
                    <div className="rewriter-card__body">

                        {/* Upload */}
                        <div>
                            <span className="section-label">Step 1 — Upload Your Resume (PDF)</span>
                            <label
                                className={`rw-dropzone ${resumeFile ? "rw-dropzone--uploaded" : ""}`}
                                htmlFor="rw-resume"
                            >
                                <span className="rw-dropzone__icon">
                                    {resumeFile ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="12" y1="18" x2="12" y2="12" />
                                            <line x1="9" y1="15" x2="15" y2="15" />
                                        </svg>
                                    )}
                                </span>
                                <p className="rw-dropzone__title">
                                    {resumeFile ? "✅ Resume Uploaded" : "Click to upload your resume"}
                                </p>
                                <p className="rw-dropzone__sub">
                                    {resumeFile ? resumeFile.name : "PDF only · Max 3MB"}
                                </p>
                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    id="rw-resume"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        setResumeFile(e.target.files[0]);
                                        setError("");
                                    }}
                                />
                            </label>
                        </div>

                        {/* Framework Selector */}
                        <div>
                            <span className="section-label">Step 2 — Choose a Framework</span>
                            <div className="framework-grid">
                                {FRAMEWORKS.map((fw) => (
                                    <button
                                        key={fw.id}
                                        className={`framework-btn ${selectedFramework === fw.id ? "framework-btn--selected" : ""}`}
                                        onClick={() => setSelectedFramework(fw.id)}
                                        style={selectedFramework === fw.id ? { borderColor: fw.color, boxShadow: `0 0 0 3px ${fw.color}22` } : {}}
                                    >
                                        <span
                                            className="framework-btn__name"
                                            style={selectedFramework === fw.id ? { color: fw.color } : {}}
                                        >
                                            {fw.name}
                                        </span>
                                        <span className="framework-btn__desc">{fw.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="rewriter-card__footer">
                        <span className="footer-hint">
                            AI will rewrite each job experience using the <strong>{selectedFramework}</strong> format
                        </span>
                        <button
                            className="rewrite-btn"
                            onClick={handleRewrite}
                            disabled={!resumeFile}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                            Rewrite with {selectedFramework}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeRewriter;
