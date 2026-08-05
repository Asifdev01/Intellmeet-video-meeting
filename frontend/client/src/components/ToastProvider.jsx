import { createContext, useContext, useState, useCallback } from "react";

/**
 * Global Toast notification system.
 *
 * Types: "success" | "error" | "info" (default)
 * Styled to match the existing IntellMeet palette:
 *   - success: #10B981 (green, already used for online status)
 *   - error:   #FF4D4E (red, already used for end-call / delete)
 *   - info:    #122056 (dark, already used for meeting room toasts)
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success("Settings saved!");
 *   toast.error("Something went wrong");
 *   toast.info("Meeting ID copied");
 */

const ToastContext = createContext(null);

const TOAST_COLORS = {
    success: { bg: "#10B981", color: "#FFFFFF", icon: "✓" },
    error: { bg: "#FF4D4E", color: "#FFFFFF", icon: "✕" },
    info: { bg: "#122056", color: "#FFFFFF", icon: "ℹ" },
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        // Fallback if used outside provider — never crash
        return {
            show: (msg) => console.log("[toast]", msg),
            success: (msg) => console.log("[toast:success]", msg),
            error: (msg) => console.log("[toast:error]", msg),
            info: (msg) => console.log("[toast:info]", msg),
        };
    }
    return ctx;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const show = useCallback((message, type = "info", duration = 3500) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const success = useCallback((msg, dur) => show(msg, "success", dur), [show]);
    const error = useCallback((msg, dur) => show(msg, "error", dur), [show]);
    const info = useCallback((msg, dur) => show(msg, "info", dur), [show]);

    return (
        <ToastContext.Provider value={{ show, success, error, info }}>
            {children}

            {/* Toast container — fixed top-center, above everything */}
            {toasts.length > 0 && (
                <div
                    style={{
                        position: "fixed",
                        top: 24,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 99999,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        pointerEvents: "none",
                    }}
                >
                    {toasts.map((t) => {
                        const c = TOAST_COLORS[t.type] || TOAST_COLORS.info;
                        return (
                            <div
                                key={t.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    background: c.bg,
                                    color: c.color,
                                    padding: "12px 24px",
                                    borderRadius: 12,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                                    animation: "toastSlideIn 0.3s ease",
                                    pointerEvents: "auto",
                                    maxWidth: 420,
                                }}
                            >
                                <span
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        background: "rgba(255,255,255,0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 12,
                                        fontWeight: 800,
                                        flexShrink: 0,
                                    }}
                                >
                                    {c.icon}
                                </span>
                                {t.message}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Keyframe injection — only once, inert if already present */}
            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateY(-12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
