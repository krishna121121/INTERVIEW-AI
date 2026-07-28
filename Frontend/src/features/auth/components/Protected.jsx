import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import Sidebar from "../../../components/layout/Sidebar";
import "./Protected.css";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="splash-screen">
                <div className="splash-content">
                    <div className="splash-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
                        </svg>
                    </div>
                    <h1 className="splash-title">Interview<span>AI</span></h1>
                    <p className="splash-subtitle">Preparing your workspace...</p>
                    <div className="splash-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring spinner-ring--delay"></div>
                    </div>
                    <p className="splash-hint">Connecting to server — this may take a moment on first load.</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="app-layout-wrapper">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
            
            <div className={`app-main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
                {/* Mobile Header Toggle */}
                <div className="mobile-header">
                    <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <span className="mobile-logo">InterviewAI</span>
                </div>

                {/* Overlay for mobile when sidebar is open */}
                {isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
                )}

                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Protected;