import React from 'react';

const ChatRoomTab = () => {
    return (
        <div style={css.container}>
            <div style={css.card}>
                <div style={css.header}>
                    <div style={css.iconBox}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <div>
                        <h2 style={css.title}>Global Chat Room</h2>
                        <p style={css.subtitle}>Connect and chat with other members outside of active meetings.</p>
                    </div>
                </div>

                <div style={css.chatArea}>
                    <div style={css.messagesContainer}>
                        <div style={css.messageWrapperLeft}>
                            <div style={css.avatar}>S</div>
                            <div style={css.messageBoxLeft}>
                                <div style={css.messageName}>System Bot</div>
                                <div style={css.messageText}>Welcome to the global chat room! Start networking with other members here.</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style={css.inputArea}>
                        <input type="text" placeholder="Type a message..." style={css.input} />
                        <button style={css.sendBtn}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </div>
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
        height: "100%",
    },
    card: {
        background: "#FFFFFF",
        borderRadius: 24,
        padding: 32,
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 20,
        borderBottom: "1px solid #FAFAFD",
        paddingBottom: 24,
        flexShrink: 0,
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
    chatArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#FAFAFD",
        borderRadius: 20,
        border: "1px solid #EEEFFD",
        overflow: "hidden",
    },
    messagesContainer: {
        flex: 1,
        padding: 24,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    messageWrapperLeft: {
        display: "flex",
        gap: 12,
        maxWidth: "80%",
    },
    avatar: {
        width: 36, height: 36,
        borderRadius: "50%",
        background: "#122056",
        color: "#FFF",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 14, flexShrink: 0,
    },
    messageBoxLeft: {
        background: "#FFFFFF",
        padding: "12px 16px",
        borderRadius: "0 16px 16px 16px",
        border: "1px solid #EEEFFD",
        boxShadow: "0 2px 5px rgba(18, 32, 86, 0.02)",
    },
    messageName: {
        fontSize: 12,
        fontWeight: 700,
        color: "#8B94B1",
        marginBottom: 4,
    },
    messageText: {
        fontSize: 14,
        color: "#122056",
        lineHeight: 1.5,
    },
    inputArea: {
        padding: 20,
        background: "#FFFFFF",
        borderTop: "1px solid #EEEFFD",
        display: "flex",
        gap: 12,
    },
    input: {
        flex: 1,
        height: 52,
        background: "#FAFAFD",
        border: "1px solid #EEEFFD",
        borderRadius: 16,
        padding: "0 20px",
        fontSize: 14,
        color: "#122056",
        outline: "none",
    },
    sendBtn: {
        width: 52, height: 52,
        borderRadius: 16,
        background: "#5B65DC",
        color: "#FFFFFF",
        border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 6px 15px rgba(91, 101, 220, 0.2)",
    }
};

export default ChatRoomTab;
