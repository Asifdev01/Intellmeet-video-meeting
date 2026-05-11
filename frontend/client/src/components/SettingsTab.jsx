import React from 'react';

const SettingsTab = () => {
    return (
        <div style={css.container}>
            <div style={css.card}>
                <div style={css.header}>
                    <div style={css.iconBox}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                    </div>
                    <div>
                        <h2 style={css.title}>Account Settings</h2>
                        <p style={css.subtitle}>Manage your profile, preferences, and security settings.</p>
                    </div>
                </div>

                <div style={css.contentArea}>
                    <div style={css.settingSection}>
                        <h3 style={css.sectionTitle}>Profile Details</h3>
                        <div style={css.formArea}>
                            <div style={css.formGroup}>
                                <label style={css.label}>Display Name</label>
                                <input type="text" defaultValue="User Name" style={css.input} />
                            </div>
                            <div style={css.formGroup}>
                                <label style={css.label}>Email Address</label>
                                <input type="email" defaultValue="user@example.com" style={css.input} />
                            </div>
                        </div>
                    </div>

                    <div style={css.settingSection}>
                        <h3 style={css.sectionTitle}>Meeting Preferences</h3>
                        <div style={css.toggleRow}>
                            <div>
                                <div style={css.toggleLabel}>Mute mic on join</div>
                                <div style={css.toggleDesc}>Automatically mute your microphone when joining a meeting.</div>
                            </div>
                            <div style={css.toggleBtnActive}>
                                <div style={css.toggleDotActive} />
                            </div>
                        </div>
                        <div style={css.toggleRow}>
                            <div>
                                <div style={css.toggleLabel}>Turn off camera on join</div>
                                <div style={css.toggleDesc}>Automatically turn off your camera when joining a meeting.</div>
                            </div>
                            <div style={css.toggleBtn}>
                                <div style={css.toggleDot} />
                            </div>
                        </div>
                    </div>

                    <button style={css.primaryBtn}>Save Changes</button>
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
    contentArea: {
        display: "flex",
        flexDirection: "column",
        gap: 40,
        maxWidth: 600,
    },
    settingSection: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 800,
        color: "#122056",
        borderBottom: "2px solid #FAFAFD",
        paddingBottom: 10,
    },
    formArea: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
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
    },
    toggleRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        background: "#FAFAFD",
        borderRadius: 16,
        border: "1px solid #EEEFFD",
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: 700,
        color: "#122056",
        marginBottom: 4,
    },
    toggleDesc: {
        fontSize: 13,
        color: "#8B94B1",
    },
    toggleBtn: {
        width: 48, height: 26,
        borderRadius: 20,
        background: "#E5E7EB",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
    },
    toggleBtnActive: {
        width: 48, height: 26,
        borderRadius: 20,
        background: "#5B65DC",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
    },
    toggleDot: {
        width: 20, height: 20,
        borderRadius: "50%",
        background: "#FFF",
        position: "absolute",
        top: 3, left: 3,
        transition: "all 0.2s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    toggleDotActive: {
        width: 20, height: 20,
        borderRadius: "50%",
        background: "#FFF",
        position: "absolute",
        top: 3, left: 25,
        transition: "all 0.2s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
        alignSelf: "flex-start",
    }
};

export default SettingsTab;
