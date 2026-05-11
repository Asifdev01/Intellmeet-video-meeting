import React from 'react';

const ScheduleMeetingTab = () => {
    return (
        <div style={css.container}>
            <div style={css.card}>
                <div style={css.header}>
                    <div style={css.iconBox}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <div>
                        <h2 style={css.title}>Schedule Meeting</h2>
                        <p style={css.subtitle}>Plan ahead and generate links for your future consultations.</p>
                    </div>
                </div>

                <div style={css.formArea}>
                    <div style={css.formGroup}>
                        <label style={css.label}>Meeting Title</label>
                        <input type="text" placeholder="e.g., Weekly Team Sync" style={css.input} />
                    </div>
                    
                    <div style={css.rowGroup}>
                        <div style={css.formGroup}>
                            <label style={css.label}>Date</label>
                            <input type="date" style={css.input} />
                        </div>
                        <div style={css.formGroup}>
                            <label style={css.label}>Time</label>
                            <input type="time" style={css.input} />
                        </div>
                    </div>
                    
                    <div style={css.formGroup}>
                        <label style={css.label}>Participants (Emails)</label>
                        <input type="text" placeholder="user@example.com, user2@example.com" style={css.input} />
                    </div>

                    <button style={css.primaryBtn}>Schedule Now</button>
                </div>
            </div>
        </div>
    );
};

const css = {
    container: {
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    card: {
        background: "#FFFFFF",
        borderRadius: 24,
        padding: 32,
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 40,
        borderBottom: "1px solid #FAFAFD",
        paddingBottom: 24,
    },
    iconBox: {
        width: 56, height: 56,
        borderRadius: 16,
        background: "#EEEFFD",
        color: "#5B65DC",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: 800,
        color: "#122056",
        marginBottom: 6,
    },
    subtitle: {
        color: "#8B94B1",
        fontSize: 15,
        fontWeight: 500,
    },
    formArea: {
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 600,
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flex: 1,
    },
    rowGroup: {
        display: "flex",
        gap: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: 700,
        color: "#122056",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    input: {
        height: 52,
        background: "#FAFAFD",
        border: "1px solid #EEEFFD",
        borderRadius: 16,
        padding: "0 20px",
        fontSize: 15,
        color: "#122056",
        outline: "none",
        fontWeight: 500,
        width: "100%",
    },
    primaryBtn: {
        padding: "16px 24px",
        borderRadius: 16,
        background: "#5B65DC",
        color: "#FFFFFF",
        border: "none",
        fontSize: 15,
        fontWeight: 800,
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 6px 15px rgba(91, 101, 220, 0.2)",
        marginTop: 10,
    }
};

export default ScheduleMeetingTab;
