import React from "react";
import { useNavigate } from "react-router";
import "./ReportCard.css"

const ReportCard = ({ report }) => {
    const navigate = useNavigate();

    return (
        <div
            className="report-card"
            onClick={() => navigate(`/interview/${report._id}`)}
        >
            <h2>Interview Report</h2>

            <p>
                <strong>Match Score:</strong> {report.matchScore}%
            </p>

            <p>
                <strong>Date:</strong>{" "}
                {new Date(report.createdAt).toLocaleDateString()}
            </p>

            <button>View Report</button>
        </div>
    );
};

export default ReportCard;