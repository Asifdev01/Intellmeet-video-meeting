import { io } from "socket.io-client";

/**
 * Socket.io client with reconnection handling.
 *
 * Exports the same `socket` object as before so all existing imports work unchanged.
 * Adds exponential backoff reconnection and a `socketStatus` reactive helper.
 */

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket", "polling"],
    // Built-in reconnection with exponential backoff
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,       // start at 1s
    reconnectionDelayMax: 10000,   // cap at 10s
});

// --- Connection status tracking (subscribe from components if needed) ---
let _connected = socket.connected;
const _listeners = new Set();

/** Subscribe to connection status changes. Returns unsubscribe function. */
export const onSocketStatusChange = (cb) => {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
};

/** Get current connection status synchronously. */
export const isSocketConnected = () => _connected;

const _notify = (status) => {
    _connected = status;
    _listeners.forEach((cb) => {
        try { cb(status); } catch (e) { console.error("[socket] listener error", e); }
    });
};

socket.on("connect", () => {
    console.log("[socket] Connected:", socket.id);
    _notify(true);
});

socket.on("disconnect", (reason) => {
    console.warn("[socket] Disconnected:", reason);
    _notify(false);
});

socket.on("reconnect_attempt", (attempt) => {
    console.log(`[socket] Reconnection attempt #${attempt}`);
});

socket.on("reconnect", (attempt) => {
    console.log(`[socket] Reconnected after ${attempt} attempt(s)`);
    _notify(true);
});

socket.on("reconnect_failed", () => {
    console.error("[socket] Reconnection failed after max attempts");
    _notify(false);
});