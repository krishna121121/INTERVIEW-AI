import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from "react";
import "./Protected.css";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

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
    return children;
};

export default Protected;