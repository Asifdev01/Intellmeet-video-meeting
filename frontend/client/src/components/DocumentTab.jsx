import React from 'react';

const DocumentTab = () => {
    return (
        <div style={css.container}>
            <div style={css.card}>
                <div style={css.header}>
                    <div style={css.iconBox}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                    </div>
                    <div>
                        <h2 style={css.title}>Documents</h2>
                        <p style={css.subtitle}>Manage your meeting notes, transcripts, and shared files here.</p>
                    </div>
                </div>

                <div style={css.emptyState}>
                    <div style={css.emptyIcon}>📄</div>
                    <h3 style={css.emptyTitle}>No Documents Yet</h3>
                    <p style={css.emptyText}>Documents and summaries from your meetings will appear here automatically.</p>
                    <button style={css.primaryBtn}>Upload Document</button>
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
    emptyState: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 40,
        background: "#FAFAFD",
        borderRadius: 20,
        border: "1px dashed #EEEFFD",
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: "#122056",
        marginBottom: 8,
    },
    emptyText: {
        color: "#8B94B1",
        fontSize: 14,
        marginBottom: 24,
        maxWidth: 300,
        lineHeight: 1.5,
    },
    primaryBtn: {
        padding: "12px 24px",
        borderRadius: 14,
        background: "#5B65DC",
        color: "#FFFFFF",
        border: "none",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 6px 15px rgba(91, 101, 220, 0.2)",
    }
};

export default DocumentTab;
