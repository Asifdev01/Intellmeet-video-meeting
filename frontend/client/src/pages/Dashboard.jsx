import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting, getMeetings, generateMeetingSummary } from "../services/meetingService";
import { logout } from "../services/authService";

const Dashboard = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joinLink, setJoinLink] = useState("");
    const [sidebarActive, setSidebarActive] = useState("Home");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [activeAiMeeting, setActiveAiMeeting] = useState(null);
    const [aiTranscript, setAiTranscript] = useState("");
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiError, setAiError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    let user = {};
    try { user = JSON.parse(userString || "{}"); } catch (e) {  }

    const fetchMeetings = async () => {
        try {
            const data = await getMeetings(token);
            setMeetings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) navigate("/login");
        else fetchMeetings();


        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [token, navigate]);

    const handleCreateMeeting = async () => {
        try {
            const data = await createMeeting(token);
            navigate(`/meeting/${data.roomId}`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAiClick = (meeting) => {
        setActiveAiMeeting(meeting);
        setAiTranscript(meeting.transcript || "");
        setAiError("");
        setAiModalOpen(true);
    };

    const handleGenerateSummary = async () => {
        if (!aiTranscript.trim()) {
            setAiError("Please provide meeting notes or a transcript.");
            return;
        }

        setAiGenerating(true);
        setAiError("");

        try {
            const data = await generateMeetingSummary(activeAiMeeting.roomId, aiTranscript, token);

            setMeetings(prev => prev.map(m =>
                m.roomId === activeAiMeeting.roomId
                    ? { ...m, summary: data.summary, actionItems: data.actionItems, transcript: aiTranscript }
                    : m
            ));

            setActiveAiMeeting(prev => ({
                ...prev,
                summary: data.summary,
                actionItems: data.actionItems,
                transcript: aiTranscript
            }));

        } catch (error) {
            console.error("AI Generation failed:", error);
            setAiError(error.response?.data?.message || "Failed to generate AI summary.");
        } finally {
            setAiGenerating(false);
        }
    };

    const handleJoinMeeting = () => {
        const id = joinLink.trim();
        if (!id) return;
        const roomId = id.includes("/meeting/") ? id.split("/meeting/").pop() : id;
        navigate(`/meeting/${roomId}`);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const sidebarItems = [
        { name: "Home", icon: <IconHome /> },
        { name: "Document", icon: <IconDoc /> },
        { name: "Chat Room", icon: <IconChat /> },
        { name: "Schedule Meeting", icon: <IconCalendar /> },
        { name: "Settings", icon: <IconSettings /> },
    ];

    return (
        <div style={css.root}>
            <style>{DashboardStyles}</style>

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`sidebar-aside ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={css.sidebar(sidebarOpen)}>
                <div style={css.logoSection}>
                    <div style={css.logoBox}>
                        <IconBrand />
                    </div>
                    {sidebarOpen && <span style={css.logoText}>IntellMeet</span>}
                </div>

                <nav style={css.navSection}>
                    {sidebarItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setSidebarActive(item.name)}
                            className="sidebar-btn"
                            style={css.navItem(sidebarActive === item.name, sidebarOpen)}
                            title={!sidebarOpen ? item.name : undefined}
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.name}</span>}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: sidebarOpen ? "0 16px" : "0 10px", paddingBottom: 24 }}>
                    <button onClick={handleLogout} className="sidebar-btn" style={css.navItem(false, sidebarOpen)} title={!sidebarOpen ? "Logout" : undefined}>
                        <IconLogout />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>

                <button
                    onClick={() => setSidebarOpen(prev => !prev)}
                    className="sidebar-toggle-btn"
                    style={css.sidebarToggle}
                    title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s ease' }}>
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            </aside>

            <div style={css.main}>
                <header style={css.header}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setSidebarOpen(prev => !prev)}
                            style={css.mobileMenuBtn}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                            <span style={css.welcomeText}>WELCOME BACK</span>
                            <h2 style={css.headerTitle}>{user.name || "User Dashboard"}</h2>
                        </div>
                    </div>

                    <div style={css.userBox}>
                        <button className="icon-hover" style={{ background: "transparent", border: "none", color: "#8B94B1", cursor: "pointer", flexShrink: 0 }}>
                            <IconBell />
                        </button>
                        <div style={{ width: 1, height: 24, background: "#EEEFFD", flexShrink: 0 }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#5B65DC", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                                {(user.name || "U")[0].toUpperCase()}
                            </div>
                            <span className="username-text" style={{ fontSize: 14, fontWeight: 700, color: "#122056", whiteSpace: "nowrap" }}>{user.name || "User"}</span>
                        </div>
                    </div>
                </header>

                <div style={css.scrollArea}>
                    <div style={css.hero}>
                        <div style={css.actionCard}>
                            <div style={css.actionIcon}>
                                <IconVideo />
                            </div>
                            <div style={css.actionInfo}>
                                <h3 style={css.actionTitle}>New Meeting</h3>
                                <p style={css.actionDesc}>Start an instant secure video meeting with your team.</p>
                            </div>
                            <button onClick={handleCreateMeeting} style={css.primaryBtn}>
                                Start Meeting
                            </button>
                        </div>

                        <div style={css.actionCard}>
                            <div style={css.actionIcon}>
                                <IconDoc />
                            </div>
                            <div style={css.actionInfo}>
                                <h3 style={css.actionTitle}>Join Meeting</h3>
                                <p style={css.actionDesc}>Enter a meeting ID or link to join an existing session.</p>
                            </div>
                            <div style={css.inputRow}>
                                <input
                                    type="text"
                                    placeholder="Meeting ID"
                                    value={joinLink}
                                    onChange={(e) => setJoinLink(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
                                    style={css.joinInput}
                                />
                                <button onClick={handleJoinMeeting} style={css.secondaryBtn}>
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={css.historySection}>
                        <h2 style={css.historyTitle}>Recent Consultations</h2>

                        {loading ? (
                            <div style={css.loadingWrap}>
                                <div className="spinner" />
                            </div>
                        ) : meetings.length === 0 ? (
                            <div style={css.emptyState}>
                                <p style={css.emptyText}>No recent meetings found. Start your first consultation above.</p>
                            </div>
                        ) : (
                            <div style={css.meetingGrid}>
                                {meetings.map((meeting) => (
                                    <div key={meeting._id} className="meeting-card" style={css.meetingCard}>
                                        <div style={css.cardTop}>
                                            <div style={css.cardIcon}>
                                                <IconVideo />
                                            </div>
                                            <span style={css.cardBadge}>
                                                COMPLETED
                                            </span>
                                        </div>
                                        <h3 style={css.cardTitle}>{meeting.title || "Medical Consultation"}</h3>
                                        <p style={css.cardRoomId}>ID: {meeting.roomId}</p>
                                        <p style={css.cardDate}>
                                            {new Date(meeting.createdAt).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric", year: "numeric",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                        <div style={css.cardActions}>
                                            <button
                                                onClick={() => navigate(`/meeting/${meeting.roomId}`)}
                                                style={css.cardJoinBtn}
                                            >
                                                Rejoin
                                            </button>
                                            <button
                                                onClick={() => handleAiClick(meeting)}
                                                style={css.cardAiBtn}
                                            >
                                                <IconSparkles />
                                                AI Summary
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {aiModalOpen && activeAiMeeting && (
                <div style={css.modalOverlay} onClick={() => setAiModalOpen(false)}>
                    <div style={css.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={css.modalHeader}>
                            <h2 style={css.modalTitle}>
                                <IconSparkles /> Meeting Intelligence
                            </h2>
                            <button style={css.closeBtn} onClick={() => setAiModalOpen(false)}>✕</button>
                        </div>

                        <div style={css.modalBody}>
                            {(!activeAiMeeting.summary && !activeAiMeeting.actionItems?.length) || aiGenerating ? (
                                <div style={css.aiInputSection}>
                                    <p style={css.aiHelperText}>
                                        Paste meeting notes or a transcript below to generate clinical summaries and action items.
                                    </p>
                                    <textarea
                                        style={css.aiTextarea}
                                        placeholder="Paste transcript here..."
                                        value={aiTranscript}
                                        onChange={(e) => setAiTranscript(e.target.value)}
                                        disabled={aiGenerating}
                                    />
                                    {aiError && <p style={css.errorText}>{aiError}</p>}
                                    <button
                                        style={css.generateBtn}
                                        onClick={handleGenerateSummary}
                                        disabled={aiGenerating || !aiTranscript.trim()}
                                    >
                                        {aiGenerating ? "Processing..." : "Generate AI Analysis ✨"}
                                    </button>
                                </div>
                            ) : (
                                <div style={css.aiResultSection}>
                                    <div style={css.resultCard}>
                                        <h3 style={css.resultHeader}>Summary</h3>
                                        <p style={css.summaryText}>{activeAiMeeting.summary}</p>
                                    </div>

                                    {activeAiMeeting.actionItems?.length > 0 && (
                                        <div style={css.resultCard}>
                                            <h3 style={css.resultHeader}>Action Items</h3>
                                            <ul style={css.actionList}>
                                                {activeAiMeeting.actionItems.map((item, idx) => (
                                                    <li key={idx} style={css.actionItem}>
                                                        <div style={css.actionTask}>{item.task}</div>
                                                        <div style={css.actionMeta}>
                                                            <span style={css.assigneeTag}>@{item.assignee || "Unassigned"}</span>
                                                            {item.deadline && <span style={css.deadlineTag}>{item.deadline}</span>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        style={{ ...css.generateBtn, marginTop: 20, background: "#FAFAFD", color: "#5B65DC", border: "1px solid #EEEFFD", boxShadow: "none" }}
                                        onClick={() => {
                                            activeAiMeeting.summary = null;
                                            setAiTranscript(activeAiMeeting.transcript || "");
                                            setActiveAiMeeting({ ...activeAiMeeting });
                                        }}
                                    >
                                        Re-run Analysis
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const IconBrand = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
);
const IconHome = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const IconDoc = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
);
const IconChat = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const IconCalendar = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);
const IconSettings = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
const IconLogout = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
const IconBell = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
);
const IconVideo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
);
const IconSparkles = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5.0 1-.963 0z" /></svg>
);


const DashboardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #FAFAFD;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #122056;
  }

  .sidebar-aside {
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: visible;
    position: relative;
    z-index: 40;
  }

  .sidebar-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
    font-family: inherit;
    white-space: nowrap;
  }
  .sidebar-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }

  .sidebar-closed .sidebar-btn {
    justify-content: center;
    padding: 12px;
  }

  .sidebar-toggle-btn {
    position: absolute;
    top: 50%;
    right: -14px;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #5B65DC;
    color: #fff;
    border: 3px solid #FAFAFD;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 50;
    transition: all 0.2s;
    padding: 0;
  }
  .sidebar-toggle-btn:hover {
    background: #4A54C5;
    transform: translateY(-50%) scale(1.1);
  }

  .sidebar-overlay {
    display: none;
  }

  .mobile-menu-btn {
    display: none;
    background: transparent;
    border: none;
    color: #8B94B1;
    cursor: pointer;
    padding: 8px;
    border-radius: 10px;
    transition: all 0.2s;
  }
  .mobile-menu-btn:hover {
    background: #EEEFFD;
    color: #5B65DC;
  }

  .meeting-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .meeting-card:hover {
    transform: translateY(-4px);
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px, 0 10px 30px rgba(18,32,86,0.08);
    border-color: #5B65DC !important;
  }

  .icon-hover:hover { background: #FAFAFD !important; color: #5B65DC !important; }

  .spinner {
    width: 40px; height: 40px;
    border: 4px solid #EEEFFD;
    border-top-color: #5B65DC;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .sidebar-aside {
      position: fixed !important;
      top: 0;
      left: 0;
      height: 100vh !important;
      z-index: 100 !important;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sidebar-aside.sidebar-open {
      transform: translateX(0);
      width: 260px !important;
    }
    .sidebar-aside.sidebar-closed {
      transform: translateX(-100%);
    }
    .sidebar-toggle-btn {
      display: none !important;
    }
    .sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(18, 32, 86, 0.4);
      backdrop-filter: blur(4px);
      z-index: 90;
    }
    .mobile-menu-btn {
      display: flex;
    }
    .hero { grid-template-columns: 1fr !important; padding: 24px !important; }
    .header { padding: 0 24px !important; }
    .historySection { padding: 0 24px 48px !important; }
  }
`;

const css = {
    root: {
        display: "flex",
        height: "100vh",
        background: "#FAFAFD",
    },


    sidebar: (isOpen) => ({
        width: isOpen ? 260 : 72,
        background: "#122056",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        padding: "32px 0",
    }),
    sidebarToggle: {

    },
    mobileMenuBtn: {

    },
    logoSection: {
        padding: "0 20px",
        marginBottom: 48,
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "center",
    },
    logoBox: {
        width: 36, height: 36,
        borderRadius: 10,
        background: "#5B65DC",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
    },
    logoText: { fontSize: 20, fontWeight: 800, letterSpacing: "-1px" },

    navSection: { flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 8 },
    navItem: (active, isOpen = true) => ({
        background: active ? "rgba(91, 101, 220, 0.2)" : "transparent",
        color: active ? "#FFFFFF" : "rgba(255,255,255,0.5)",
        justifyContent: isOpen ? "flex-start" : "center",
        padding: isOpen ? "12px 16px" : "12px",
    }),


    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    header: {
        minHeight: 72,
        padding: "0 24px",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        gap: 12,
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
    },
    welcomeText: { fontSize: 10, color: "#8B94B1", fontWeight: 800, letterSpacing: "1px", whiteSpace: "nowrap" },
    headerTitle: { fontSize: 18, fontWeight: 800, color: "#122056", letterSpacing: "-0.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 },

    userBox: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px",
        borderRadius: 16,
        background: "#FFFFFF",
        flexShrink: 0,
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
    },

    scrollArea: {
        flex: 1,
        overflowY: "auto",
    },

    hero: {
        padding: "24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
    },
    actionCard: {
        background: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minWidth: 0,
    },
    actionIcon: {
        width: 52, height: 52,
        borderRadius: 16,
        background: "#EEEFFD",
        color: "#5B65DC",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    actionInfo: { display: "flex", flexDirection: "column", gap: 6 },
    actionTitle: { fontSize: 18, fontWeight: 800, color: "#122056" },
    actionDesc: { fontSize: 14, color: "#8B94B1", lineHeight: 1.6, fontWeight: 500 },

    inputRow: { display: "flex", gap: 10 },
    joinInput: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        border: "1px solid #EEEFFD",
        background: "#FAFAFD",
        padding: "0 20px",
        fontSize: 14,
        outline: "none",
        color: "#122056",
        fontWeight: 600,
    },
    primaryBtn: {
        height: 52,
        padding: "0 24px",
        borderRadius: 16,
        background: "#5B65DC",
        color: "#FFFFFF",
        border: "none",
        fontSize: 15,
        fontWeight: 800,
        cursor: "pointer",
        transition: "all 0.2s",
        width: "100%",
        boxShadow: "0 10px 20px rgba(91, 101, 220, 0.2)",
    },
    secondaryBtn: {
        height: 52,
        padding: "0 24px",
        borderRadius: 16,
        background: "#122056",
        color: "#FFFFFF",
        border: "none",
        fontSize: 14,
        fontWeight: 800,
        cursor: "pointer",
    },

    historySection: {
        padding: "0 24px 48px",
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 800,
        color: "#122056",
        marginBottom: 20,
        letterSpacing: "-0.5px",
    },
    loadingWrap: {
        display: "flex",
        justifyContent: "center",
        padding: 80,
    },
    emptyState: {
        background: "#FFFFFF",
        border: "1px solid #EEEFFD",
        borderRadius: 24,
        padding: "80px 24px",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(18, 32, 86, 0.02)",
    },
    emptyText: {
        color: "#8B94B1",
        fontSize: 15,
        fontWeight: 600,
    },
    meetingGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20,
    },
    meetingCard: {
        background: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        cursor: "pointer",
        position: "relative",
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
    },
    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    cardIcon: {
        width: 44, height: 44,
        borderRadius: 12,
        background: "#EEEFFD",
        color: "#5B65DC",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    cardBadge: {
        fontSize: 10,
        fontWeight: 800,
        color: "#10B981",
        background: "rgba(16, 185, 129, 0.1)",
        padding: "6px 12px",
        borderRadius: 20,
        letterSpacing: "0.5px",
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 800,
        color: "#122056",
        marginBottom: 6,
    },
    cardRoomId: {
        fontSize: 12,
        color: "#8B94B1",
        fontFamily: "monospace",
        marginBottom: 8,
        fontWeight: 600,
    },
    cardDate: {
        fontSize: 12,
        color: "#8B94B1",
        marginBottom: 24,
        fontWeight: 500,
    },
    cardActions: {
        display: "flex",
        gap: 12,
    },
    cardJoinBtn: {
        flex: 1,
        padding: "14px",
        background: "#FAFAFD",
        color: "#122056",
        border: "1px solid #EEEFFD",
        borderRadius: 14,
        fontSize: 13,
        fontWeight: 800,
        cursor: "pointer",
        transition: "all 0.2s",
    },
    cardAiBtn: {
        flex: 1,
        padding: "14px",
        background: "#5B65DC",
        color: "#FFFFFF",
        border: "none",
        borderRadius: 14,
        fontSize: 13,
        fontWeight: 800,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: "0 6px 15px rgba(91, 101, 220, 0.2)",
    },


    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(18, 32, 86, 0.4)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
    },
    modalContent: {
        background: "#FFFFFF",
        borderRadius: 32,
        width: "100%",
        maxWidth: 680,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px, 0 30px 60px rgba(18, 32, 86, 0.15)",
        overflow: "hidden",
    },
    modalHeader: {
        padding: "32px",
        borderBottom: "1px solid #FAFAFD",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    modalTitle: {
        margin: 0,
        fontSize: 22,
        fontWeight: 800,
        color: "#122056",
        display: "flex",
        alignItems: "center",
        gap: 12,
        letterSpacing: "-0.5px",
    },
    closeBtn: {
        background: "#FAFAFD",
        border: "1px solid #EEEFFD",
        color: "#122056",
        borderRadius: "50%",
        width: 36, height: 36,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        fontSize: 14,
    },
    modalBody: {
        padding: "32px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
    },
    aiInputSection: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    aiHelperText: {
        fontSize: 14,
        color: "#8B94B1",
        lineHeight: 1.6,
        fontWeight: 500,
    },
    aiTextarea: {
        width: "100%",
        height: 220,
        background: "#FAFAFD",
        border: "1px solid #EEEFFD",
        borderRadius: 20,
        padding: 24,
        color: "#122056",
        fontFamily: "inherit",
        fontSize: 14,
        resize: "none",
        outline: "none",
        lineHeight: 1.6,
    },
    generateBtn: {
        background: "#5B65DC",
        color: "#FFFFFF",
        border: "none",
        padding: "18px",
        borderRadius: 20,
        fontSize: 16,
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 10px 20px rgba(91, 101, 220, 0.2)",
    },
    errorText: {
        color: "#FF4D4E",
        fontSize: 13,
        fontWeight: 700,
        textAlign: "center",
    },
    aiResultSection: {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    },
    resultCard: {
        background: "#FAFAFD",
        border: "1px solid #EEEFFD",
        borderRadius: 24,
        padding: 28,
    },
    resultHeader: {
        fontSize: 11,
        fontWeight: 800,
        color: "#5B65DC",
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        marginBottom: 16,
    },
    summaryText: {
        fontSize: 15,
        color: "#122056",
        lineHeight: 1.7,
        fontWeight: 500,
    },
    actionList: {
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: 14,
    },
    actionItem: {
        background: "#FFFFFF",
        padding: "18px 24px",
        borderRadius: 18,
        border: "1px solid #EEEFFD",
        borderLeft: "5px solid #5B65DC",
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    actionTask: {
        fontSize: 15,
        fontWeight: 800,
        color: "#122056",
    },
    actionMeta: {
        display: "flex",
        gap: 12,
        fontSize: 12,
    },
    assigneeTag: {
        color: "#5B65DC",
        background: "#EEEFFD",
        padding: "4px 12px",
        borderRadius: 10,
        fontWeight: 700,
    },
    deadlineTag: {
        color: "#FF4D4E",
        background: "rgba(255, 77, 78, 0.05)",
        padding: "4px 12px",
        borderRadius: 10,
        fontWeight: 700,
    },
};

export default Dashboard;