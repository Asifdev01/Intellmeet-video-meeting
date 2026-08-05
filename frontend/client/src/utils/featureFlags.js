/**
 * Feature flags — toggle experimental features on/off.
 * Read from Vite env vars where possible, with safe defaults.
 * New features default to true; set VITE_FEATURE_X=false in .env to disable.
 */

const envBool = (key, fallback = true) => {
    const val = import.meta.env[key];
    if (val === undefined || val === null || val === "") return fallback;
    return val !== "false" && val !== "0";
};

const featureFlags = Object.freeze({
    // Batch A — low risk
    toastNotifications: envBool("VITE_FEATURE_TOASTS", true),
    meetingToolbar: envBool("VITE_FEATURE_MEETING_TOOLBAR", true),
    emojiReactions: envBool("VITE_FEATURE_EMOJI_REACTIONS", true),

    // Batch B — mostly frontend
    notifications: envBool("VITE_FEATURE_NOTIFICATIONS", true),
    analyticsWidget: envBool("VITE_FEATURE_ANALYTICS", true),
    globalSearch: envBool("VITE_FEATURE_GLOBAL_SEARCH", true),
    pdfExport: envBool("VITE_FEATURE_PDF_EXPORT", true),

    // Batch C — higher complexity, default off until stable
    waitingRoom: envBool("VITE_FEATURE_WAITING_ROOM", false),
    hostControls: envBool("VITE_FEATURE_HOST_CONTROLS", false),
    meetingRecording: envBool("VITE_FEATURE_RECORDING", false),
    emailInvites: envBool("VITE_FEATURE_EMAIL_INVITES", false),
});

export default featureFlags;
