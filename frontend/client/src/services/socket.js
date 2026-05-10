import { io } from "socket.io-client";

const SOCKET_URL = `http://${window.location.hostname}:5000`;

export const socket = io(SOCKET_URL, {
    auth: {
        token: localStorage.getItem("token") || "",
    },
    autoConnect: true,
});