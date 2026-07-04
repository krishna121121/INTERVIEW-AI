
import React, { useState, useEffect ,useContext} from "react";
import "../style/Interview.scss";
import { useInterview } from "../hook/useInterview";
import { Navigate, useNavigate, useParams } from "react-router";
import {AuthContext} from "../../auth/auth.context.jsx"
import { logout } from "../../auth/Services/auth.api.jsx";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Question",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "behavioral",
    label: "Behavioral Question",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="q-card">
      
      <div className="q-card__header" onClick={() => setOpen(!open)}>
        <span className="q-card__index">Q{index + 1}</span>

        {/* Fixed */}
        <p className="q-card__question">{item.question}</p>

        <span className={`q-card__chevron ${open ? "q-card__chevron--open" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {open && (
        <div className="q-card__body">
          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--intention">
              Intention
            </span>
            <p>{item.intention}</p>
          </div>

          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--answer">
              Model Answer
            </span>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="roadmap-day">
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day.day}</span>
      <h3 className="roadmap-day__focus">{day.focus}</h3>
    </div>

    <ul className="roadmap-day__tasks">
      {(day.tasks || []).map((task, i) => (
        <li key={i}>
          <span className="roadmap-day__bullet" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");

  const { report, getReportById, loading, getResumePdf } = useInterview();

  const { interviewId } = useParams();
  const context = useContext(AuthContext)

    const {user}=context;
    const [showProfile, setShowProfile] = useState(false);
    const navigate=useNavigate();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  const scoreColor =
    report.matchScore >= 80
      ? "score--high"
      : report.matchScore >= 60
      ? "score--mid"
      : "score--low";

  return (
    <div className="interview-page">
      <div className="profile-container">
        <div
            className="profile"
            onClick={() => setShowProfile(!showProfile)}
        >
            {(user?.name || user?.email)?.charAt(0).toUpperCase()}
        </div>

        {showProfile && (
            <div className="profile-card">
                <h3>User Profile</h3>

                <div className="profile-item">
                    <span>ID</span>
                    <p>{user?.id}</p>
                </div>

                <div className="profile-item">
                    <span>Name</span>
                    <p>{user?.username}</p>
                </div>

                <div className="profile-item">
                    <span>Email</span>
                    <p>{user?.email}</p>
                </div>
                <button
                  className="logout-btn"
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    padding: "5px 8px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px"
                  }}
                  onClick={async (e)=>{
                    await logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
            </div>
            )}
        </div>
      <div className="interview-layout">

      <nav className="interview-nav">
  <div className="nav-content">
    <p className="interview-nav__label">Sections</p>

    {NAV_ITEMS.map((item) => (
      <button
        key={item.id}
        className={`interview-nav__item ${
          activeNav === item.id ? "interview-nav__item--active" : ""
        }`}
        onClick={() => setActiveNav(item.id)}
      >
        <span className="interview-nav__icon">
          {item.icon}
        </span>
        {item.label}
      </button>
    ))}
  </div>

  
</nav>

<div className="interview-divider" />

        <main className="interview-content">
          {activeNav === "technical" && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>

                <span className="content-header__count">
                  {report.technicalQuestion?.length || 0} Questions
                </span>
              </div>

              <div className="q-list">
                {(report.technicalQuestion || []).map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <div className="content-header">
                <h2>Behavioral Questions</h2>

                <span className="content-header__count">
                  {report.behavioralQuestion?.length || 0} Questions
                </span>
              </div>

              <div className="q-list">
                {(report.behavioralQuestion || []).map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>

                <span className="content-header__count">
                  {report.preparationPlan?.length || 0}-Day Plan
                </span>
              </div>

              <div className="roadmap-list">
                {(report.preparationPlan || []).map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="interview-sidebar">
          <div className="match-score">
            <p className="match-score__label">Match Score</p>

            <div className={`match-score__ring ${scoreColor}`}>
              <span className="match-score__value">
                {report.matchScore}
              </span>

              <span className="match-score__pct">%</span>
            </div>

            <p className="match-score__sub">
              Strong match for this role
            </p>
          </div>

          <div className="sidebar-divider" />

          <div className="skill-gaps">
            <p className="skill-gaps__label">Skill Gaps</p>

            <div className="skill-gaps__list">
              {(report.skillGaps || []).map((gap, i) => (
                <span
                  key={i}
                  className={`skill-tag skill-tag--${gap.severity}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;