import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useInterview } from "../../features/ai/hook/useInterview";
import { useTheme } from "../../context/ThemeContext";
import "./Sidebar.scss";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { reports, getReports } = useInterview();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        getReports();
    }, []);

    const isActive = (path) => location.pathname === path;
    const isReportActive = (id) => location.pathname.includes(`/interview/${id}`);

    return (
        <aside className={`app-sidebar ${isOpen ? "open" : "closed"}`}>
            {/* Header / Logo */}
            <div className="sidebar-header">
                <div className="logo" onClick={() => navigate("/")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                    <span>InterviewAI</span>
                </div>
                <button className="close-btn" onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div className="sidebar-content">
                {/* Features Section */}
                <div className="sidebar-section">
                    <h3 className="section-title">Features</h3>
                    <ul className="nav-list">
                        <li 
                            className={`nav-item ${isActive("/") ? "active" : ""}`}
                            onClick={() => { navigate("/"); toggleSidebar(); }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Generate Interview
                        </li>
                        <li 
                            className={`nav-item ${isActive("/resume-rewriter") ? "active" : ""}`}
                            onClick={() => { navigate("/resume-rewriter"); toggleSidebar(); }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            Resume Rewriter
                        </li>
                    </ul>
                </div>

                {/* Recent Reports Section */}
                <div className="sidebar-section">
                    <h3 className="section-title">Recent Plans</h3>
                    {reports && reports.length > 0 ? (
                        <ul className="reports-list-side">
                            {reports.map((report) => (
                                <li 
                                    key={report._id} 
                                    className={`report-item ${isReportActive(report._id) ? "active" : ""}`}
                                    onClick={() => { navigate(`/interview/${report._id}`); toggleSidebar(); }}
                                >
                                    <div className="report-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                        </svg>
                                    </div>
                                    <div className="report-details">
                                        <span className="report-title">
                                            {report.jobDescription 
                                                ? (report.jobDescription.length > 25 ? report.jobDescription.substring(0, 25) + '...' : report.jobDescription)
                                                : "Interview Plan"}
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span className="report-date">{new Date(report.createdAt).toLocaleDateString()}</span>
                                            {report.matchScore !== undefined && (
                                                <span style={{ fontSize: '10px', background: 'var(--bg-accent-trans)', color: 'var(--text-accent)', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>
                                                    {report.matchScore}% Match
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-reports">No plans generated yet.</p>
                    )}
                </div>
            </div>

            {/* Theme Toggle Footer */}
            <div className="sidebar-footer">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'dark' ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            <span>Light Mode</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            <span>Dark Mode</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
