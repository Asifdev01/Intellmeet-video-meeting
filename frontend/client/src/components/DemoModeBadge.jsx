/**
 * DemoModeBadge — A subtle pill shown on a specific widget when it's
 * displaying mock/fallback data instead of live data.
 *
 * Usage: {isMock && <DemoModeBadge />}
 *
 * Styled to match the existing palette (muted purple on light purple bg).
 * Never a full-page banner — only placed on the affected card/panel.
 */

const DemoModeBadge = ({ message = "Demo data — live connection unavailable" }) => (
    <div
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 8,
            background: "#EEEFFD",
            color: "#5B65DC",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2px",
            userSelect: "none",
        }}
        title={message}
    >
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Demo Mode
    </div>
);

export default DemoModeBadge;
