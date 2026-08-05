import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../services/socket";
import VideoPlayer from "../components/VideoPlayer";
import { peerConfig } from "../services/webrtc";
import { getCurrentUser } from "../services/authService";
import EmojiPicker from 'emoji-picker-react';
import { useToast } from "../components/ToastProvider";
import featureFlags from "../utils/featureFlags";

const avatarColors = [
    { bg: "#E6F1FB", text: "#185FA5" },
    { bg: "#E1F5EE", text: "#0F6E56" },
    { bg: "#EEEDFE", text: "#534AB7" },
    { bg: "#FBEAF0", text: "#993556" },
    { bg: "#FAEEDA", text: "#854F0B" },
];
const getAvatarStyle = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];
const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
const getSenderColor = (name) => {
    const colors = ["#185FA5", "#0F6E56", "#534AB7", "#993556", "#854F0B"];
    return colors[name.charCodeAt(0) % colors.length];
};
const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });


const Avatar = ({ name, size = 34 }) => {
    const s = getAvatarStyle(name);
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: s.bg, color: s.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.36, fontWeight: 600, flexShrink: 0, userSelect: "none",
        }}>
            {getInitials(name)}
        </div>
    );
};


const CtrlBtn = ({ onClick, danger, active, disabled, children, label, style = {} }) => (
    <button
        onClick={disabled ? undefined : onClick}
        aria-label={label}
        title={label}
        disabled={disabled}
        style={{
            width: 44, height: 44, borderRadius: "12px",
            border: danger ? "none" : active ? `2px solid #5B65DC` : "1px solid #e5e7eb",
            background: danger ? "#FF4D4E" : active ? "#EEEFFD" : disabled ? "#F3F4F6" : "#FFFFFF",
            color: danger ? "#FFFFFF" : active ? "#5B65DC" : disabled ? "#9CA3AF" : "#122056",
            cursor: disabled ? "not-allowed" : "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(18, 32, 86, 0.05)",
            opacity: disabled ? 0.6 : 1,
            ...style
        }}
    >
        {children}
    </button>
);

const IconBlur = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 0 20" strokeDasharray="4 4" />
        <path d="M12 6v12" />
    </svg>
);


const IconMic = ({ muted }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {muted ? (
            <>
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
            </>
        ) : (
            <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
            </>
        )}
    </svg>
);

const IconCamera = ({ off }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {off ? (
            <>
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
                <path d="M23 7l-7 5 7 5V7z" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        ) : (
            <>
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </>
        )}
    </svg>
);

const IconPhone = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.43 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.5 9.9a16 16 0 0 0 3.18 3.41z" style={{ transform: "rotate(135deg)", transformOrigin: "center" }} />
    </svg>
);

const IconVolume = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
);

const IconExpand = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
);

const IconSend = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const IconBack = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const IconScreenShare = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="m17 2 5 5-5 5" />
        <path d="M22 7h-9" />
    </svg>
);

const IconEmoji = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
);

const MeetingRoom = () => {
    const { roomId } = useParams();

    const currentUser = getCurrentUser() || {};
    const myName = currentUser.name || "You";
    const myUserId = currentUser._id || "guest";

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState("");
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});

    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [mediaError, setMediaError] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [flyingReactions, setFlyingReactions] = useState([]);
    const [pinnedParticipantId, setPinnedParticipantId] = useState(null);
    const [layoutMode, setLayoutMode] = useState("speaker"); // "speaker" | "grid"
    const [networkStats, setNetworkStats] = useState({});
    const [isBlurOn, setIsBlurOn] = useState(false);
    const [raisedHands, setRaisedHands] = useState([]);
    const [isHost, setIsHost] = useState(true); // Demo mode: default to true for testing
    const blurStateRef = useRef({ active: false, animFrame: null });
    const originalVideoTrackRef = useRef(null);
    const toast = useToast();
    const [activeTab, setActiveTab] = useState("chat");
    const [participants, setParticipants] = useState([]);
    const [timerOpen, setTimerOpen] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [masterVolume, setMasterVolume] = useState(1);
    const [participantVolumes, setParticipantVolumes] = useState({});
    const typingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const peersRef = useRef({});
    const localStreamRef = useRef(null);
    const pendingCandidatesRef = useRef({});
    useEffect(() => {
        const handleReconnect = () => {
            console.log("[Meeting] Socket reconnected, re-joining room...");
            socket.emit("join-room", { roomId, userId: socket.id, userName: myName });
        };
        socket.on("connect", handleReconnect);
        return () => {
            socket.off("connect", handleReconnect);
        };
    }, [roomId, myName]);

    useEffect(() => {
        socket.on("receive-message", (data) => {
            if (data.type === "COMMAND") {
                if (data.command === "MUTE_ALL" && data.senderId !== socket.id) {
                    const track = localStreamRef.current?.getAudioTracks()[0];
                    if (track && track.enabled) {
                        track.enabled = false;
                        setIsMuted(true);
                        toast.info("You were muted by the host.");
                    }
                }
                if (data.command === "MUTE_ONE" && data.targetId === socket.id) {
                    const track = localStreamRef.current?.getAudioTracks()[0];
                    if (track && track.enabled) {
                        track.enabled = false;
                        setIsMuted(true);
                        toast.info("The host muted your microphone.");
                    }
                }
                if (data.command === "RAISE_HAND") {
                    setRaisedHands((prev) => (prev.includes(data.senderId) ? prev : [...prev, data.senderId]));
                    if (isHost && data.senderId !== socket.id) toast.info(`${data.sender || "Someone"} raised their hand.`);
                }
                if (data.command === "LOWER_HAND") {
                    if (data.targetId === "ALL") {
                        setRaisedHands([]);
                    } else {
                        setRaisedHands((prev) => prev.filter((id) => id !== data.targetId));
                    }
                }
                return;
            }
            setMessages((prev) => [...prev, { ...data, time: new Date() }]);
        });
        socket.on("user-typing", (data) => {
            setTyping(data.message);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTyping(""), 3000);
        });
        return () => {
            socket.off("receive-message");
            socket.off("user-typing");
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        let int;
        if (timerRunning) {
            int = setInterval(() => setTimerSeconds(s => s + 1), 1000);
        }
        return () => clearInterval(int);
    }, [timerRunning]);

    const formatTimer = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

    useEffect(() => {
        const interval = setInterval(async () => {
            const statsObj = {};
            for (const [socketId, peer] of Object.entries(peersRef.current)) {
                try {
                    if (!peer.getStats) continue;
                    const stats = await peer.getStats();
                    let quality = "good";
                    let packetsLost = 0;
                    let packetsSent = 0;
                    stats.forEach(report => {
                        if (report.type === "outbound-rtp") {
                            packetsSent += report.packetsSent || 0;
                        }
                        if (report.type === "remote-inbound-rtp") {
                            packetsLost += report.packetsLost || 0;
                            const rtt = report.roundTripTime || 0;
                            if (rtt > 0.5) quality = "poor";
                            else if (rtt > 0.2) quality = "fair";
                        }
                        if (report.type === "inbound-rtp") {
                            const jitter = report.jitter || 0;
                            if (jitter > 0.05) quality = "poor";
                        }
                    });
                    if (packetsSent > 0 && packetsLost / packetsSent > 0.1) quality = "poor";
                    statsObj[socketId] = quality;
                } catch (err) {
                    console.warn("getStats error", err);
                    statsObj[socketId] = "unsupported";
                }
            }
            statsObj["local"] = "good"; // Assumption for self
            setNetworkStats(statsObj);
        }, 3000);
        return () => clearInterval(interval);
    }, []);




    useEffect(() => {
        let stream = null;
        let isMounted = true;
        const getMedia = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Browser not supported");
                }
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } catch (err) {
                console.warn("Video+Audio failed, trying Audio only", err);
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                    setIsCameraOff(true);
                } catch (audioErr) {
                    console.error("Media error (all failed):", audioErr);
                    setMediaError(audioErr.name === "NotAllowedError"
                        ? "Camera/Mic access denied. You joined as a viewer."
                        : "Could not access hardware. You joined as a viewer.");
                    setIsCameraOff(true);
                    setIsMuted(true);
                }
            }

            if (!isMounted) {
                stream?.getTracks().forEach(t => t.stop());
                return;
            }

            if (stream) {
                setLocalStream(stream);
                localStreamRef.current = stream;
            }

            console.log(`[Meeting] Joining room ${roomId} as "${myName}"`);
            socket.emit("join-room", { roomId, userId: socket.id, userName: myName });
        };
        getMedia();
        
        return () => {
            isMounted = false;
            stream?.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
            setLocalStream(null);
            Object.values(peersRef.current).forEach(peer => peer.close());
            peersRef.current = {};
            setRemoteStreams({});
        };
    }, [roomId, myName]);

    useEffect(() => {
        const createPeer = (targetSocketId, targetUserName) => {
            const peer = new RTCPeerConnection(peerConfig);
            peersRef.current[targetSocketId] = peer;
            pendingCandidatesRef.current[targetSocketId] = pendingCandidatesRef.current[targetSocketId] || [];

            peer.oniceconnectionstatechange = () => {
                console.log(`[WebRTC] ICE Connection State changed to: ${peer.iceConnectionState}`);
            };

            peer.onsignalingstatechange = () => {
                console.log(`[WebRTC] Signaling State changed to: ${peer.signalingState}`);
            };

            if (localStreamRef.current) {
                console.log("[WebRTC] Adding local tracks to peer connection");
                localStreamRef.current.getTracks().forEach((t) => peer.addTrack(t, localStreamRef.current));
            }

            peer.ontrack = (e) => {
                console.log(`[WebRTC] Received remote track: ${e.track.kind}`);
                if (e.streams && e.streams[0]) {
                    console.log("[WebRTC] Remote stream attached");
                    setRemoteStreams(prev => ({
                        ...prev,
                        [targetSocketId]: { stream: e.streams[0], userName: targetUserName || "Participant" }
                    }));
                } else {
                    console.log("[WebRTC] Creating new MediaStream for track");
                    const stream = new MediaStream([e.track]);
                    setRemoteStreams(prev => ({
                        ...prev,
                        [targetSocketId]: { stream, userName: targetUserName || "Participant" }
                    }));
                }
            };

            peer.onicecandidate = (e) => {
                if (e.candidate) {
                    console.log(`[WebRTC] Generated ICE candidate, sending to ${targetSocketId}`);
                    socket.emit("ice-candidate", { candidate: e.candidate, to: targetSocketId });
                } else {
                    console.log("[WebRTC] ICE candidate gathering complete");
                }
            };

            return peer;
        };

        const handleOffer = async ({ offer, from }) => {
            console.log(`[WebRTC] Received offer from ${from}`, offer);
            let targetUserName = "Participant";
            setParticipants(prev => {
                const u = prev.find(p => p.socketId === from);
                if (u && u.userName) targetUserName = u.userName;
                return prev;
            });

            const peer = createPeer(from, targetUserName);
            console.log("[WebRTC] Setting remote description (offer)");
            await peer.setRemoteDescription(new RTCSessionDescription(offer));

            console.log("[WebRTC] Creating answer");
            const answer = await peer.createAnswer();
            console.log("[WebRTC] Setting local description (answer)");
            await peer.setLocalDescription(answer);
            console.log(`[WebRTC] Sending answer to ${from}`);
            socket.emit("answer", { answer, to: from });

            const pending = pendingCandidatesRef.current[from] || [];
            if (pending.length > 0) {
                console.log("[WebRTC] Processing", pending.length, "pending candidates");
                pending.forEach((candidate) => {
                    peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error("Error adding pending candidate", e));
                });
                pendingCandidatesRef.current[from] = [];
            }
        };

        const handleAnswer = async ({ answer, from }) => {
            console.log("[WebRTC] Received answer from remote peer", from);
            const peer = peersRef.current[from];
            if (peer) {
                console.log("[WebRTC] Setting remote description (answer)");
                await peer.setRemoteDescription(new RTCSessionDescription(answer));

                const pending = pendingCandidatesRef.current[from] || [];
                if (pending.length > 0) {
                    console.log("[WebRTC] Processing", pending.length, "pending candidates after answer");
                    pending.forEach((candidate) => {
                        peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error("Error adding pending candidate", e));
                    });
                    pendingCandidatesRef.current[from] = [];
                }
            }
        };

        const handleIceCandidate = async ({ candidate, from }) => {
            console.log("[WebRTC] Received remote ICE candidate from", from);
            const peer = peersRef.current[from];
            if (peer && peer.remoteDescription) {
                try {
                    console.log("[WebRTC] Adding remote ICE candidate to peer connection");
                    await peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error("[WebRTC] Error adding ICE candidate", e);
                }
            } else {
                console.log("[WebRTC] Queuing ICE candidate (peer not ready)");
                pendingCandidatesRef.current[from] = pendingCandidatesRef.current[from] || [];
                pendingCandidatesRef.current[from].push(candidate);
            }
        };

        const handleActiveParticipants = (users) => {
            console.log("[Meeting] Active participants:", users);
            const hasLocal = users.some(u => u.socketId === socket.id);
            if (!hasLocal) {
                users.push({ socketId: socket.id, userName: myName });
            }
            setParticipants(users);
        };

        const handleUserJoined = async (user) => {
            const { socketId, userName } = user;
            console.log(`[Meeting] User joined: "${userName}" (${socketId})`);
            toast.info(`${userName || "A participant"} joined the meeting`);
            setParticipants(prev => {
                const exists = prev.find(u => u.socketId === socketId);
                if (exists) return prev;
                return [...prev, user];
            });

            const peer = createPeer(socketId, userName);
            console.log("[WebRTC] Creating offer");
            const offer = await peer.createOffer();
            console.log("[WebRTC] Setting local description (offer)");
            await peer.setLocalDescription(offer);
            console.log(`[WebRTC] Sending offer to ${socketId}`);
            socket.emit("offer", { offer, to: socketId });
        };

        const handleUserLeft = ({ socketId }) => {
            console.log(`[Meeting] User left: ${socketId}`);
            setParticipants(prev => {
                const user = prev.find(u => u.socketId === socketId);
                if (user) toast.info(`${user.userName || "A participant"} left the meeting`);
                return prev.filter(u => u.socketId !== socketId);
            });
            if (peersRef.current[socketId]) {
                peersRef.current[socketId].close();
                delete peersRef.current[socketId];
            }
            setRemoteStreams(prev => {
                const next = { ...prev };
                delete next[socketId];
                return next;
            });
            delete pendingCandidatesRef.current[socketId];
        };

        const handleReaction = (data) => {
            const id = Date.now() + Math.random();
            setFlyingReactions(prev => [...prev, { id, emoji: data.emoji }]);
            setTimeout(() => {
                setFlyingReactions(prev => prev.filter(r => r.id !== id));
            }, 1500);
        };

        socket.on("active-participants", handleActiveParticipants);
        socket.on("user-joined", handleUserJoined);
        socket.on("offer", handleOffer);
        socket.on("answer", handleAnswer);
        socket.on("ice-candidate", handleIceCandidate);
        socket.on("user-left", handleUserLeft);
        socket.on("reaction", handleReaction);

        return () => {
            socket.off("active-participants", handleActiveParticipants);
            socket.off("user-joined", handleUserJoined);
            socket.off("offer", handleOffer);
            socket.off("answer", handleAnswer);
            socket.off("ice-candidate", handleIceCandidate);
            socket.off("user-left", handleUserLeft);
            socket.off("reaction", handleReaction);
        };
    }, [roomId, myName, myUserId]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);


    const sendMessage = () => {
        if (!message.trim()) return;

        socket.emit("send-message", { roomId, message, senderId: socket.id, sender: myName });
        setMessage("");
        inputRef.current?.focus();
    };

    const handleTyping = () => socket.emit("typing", { roomId, message: `${myName} is typing...` });

    const toggleMute = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        if (track) { track.enabled = !track.enabled; setIsMuted(!track.enabled); }
    };

    const toggleCamera = async () => {
        if (!isCameraOff) {
            const track = localStreamRef.current?.getVideoTracks()[0];
            if (track) {
                track.stop();
            }
            setIsCameraOff(true);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const newTrack = stream.getVideoTracks()[0];

                const newStream = new MediaStream([
                    newTrack,
                    ...(localStreamRef.current ? localStreamRef.current.getAudioTracks() : [])
                ]);

                setLocalStream(newStream);
                localStreamRef.current = newStream;

                if (peersRef.current) {
                    Object.values(peersRef.current).forEach(peer => {
                        const sender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
                        if (sender) {
                            sender.replaceTrack(newTrack);
                        } else {
                            peer.addTrack(newTrack, newStream);
                        }
                    });
                }
                setIsCameraOff(false);
            } catch (err) {
                console.error("Could not restart camera", err);
                toast.error("Could not access camera");
            }
        }
    };

    const leaveRoom = () => {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        Object.values(peersRef.current).forEach(peer => peer.close());
        peersRef.current = {};
        setLocalStream(null);
        setRemoteStreams({});
        window.location.href = "/";
    };

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];
            
            Object.values(peersRef.current).forEach(async (peer) => {
                const sender = peer.getSenders().find((s) => s.track?.kind === "video");
                if (sender) await sender.replaceTrack(screenTrack);
            });

            const updatedStream = new MediaStream([
                screenTrack,
                ...localStreamRef.current.getAudioTracks(),
            ]);
            setLocalStream(updatedStream);
            setIsScreenSharing(true);

            screenTrack.onended = () => stopScreenShare();
        } catch (err) {
            console.error("Screen share error:", err);
        }
    };

    const stopScreenShare = async () => {
        const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
        
        Object.values(peersRef.current).forEach(async (peer) => {
            const sender = peer.getSenders().find((s) => s.track?.kind === "video");
            if (sender && cameraTrack) await sender.replaceTrack(cameraTrack);
        });

        const restoredStream = new MediaStream([
            cameraTrack,
            ...localStreamRef.current.getAudioTracks(),
        ]);
        setLocalStream(restoredStream);
        setIsScreenSharing(false);
    };

    const toggleBlur = async () => {
        if (isBlurOn) {
            setIsBlurOn(false);
            blurStateRef.current.active = false;
            if (blurStateRef.current.animFrame) cancelAnimationFrame(blurStateRef.current.animFrame);
            if (originalVideoTrackRef.current && localStreamRef.current) {
                const newStream = new MediaStream([originalVideoTrackRef.current, ...localStreamRef.current.getAudioTracks()]);
                setLocalStream(newStream);
                localStreamRef.current = newStream;
                Object.values(peersRef.current).forEach(peer => {
                    const sender = peer.getSenders().find(s => s.track?.kind === "video");
                    if (sender) sender.replaceTrack(originalVideoTrackRef.current);
                });
            }
            return;
        }

        try {
            const canvas = document.createElement("canvas");
            if (!canvas.captureStream) {
                throw new Error("Canvas captureStream not supported");
            }
            
            // If currently screen sharing, we might not want to blur it, but let's just blur whatever video track is there.
            const videoTrack = originalVideoTrackRef.current || localStreamRef.current?.getVideoTracks()[0];
            if (!videoTrack) throw new Error("No local video track");
            
            originalVideoTrackRef.current = videoTrack;
            
            const video = document.createElement("video");
            video.srcObject = new MediaStream([videoTrack]);
            video.muted = true;
            video.play();
            
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext("2d");
            
            blurStateRef.current.active = true;
            
            const drawFrame = () => {
                if (!blurStateRef.current.active) return;
                
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    ctx.save();
                    ctx.filter = "blur(15px)";
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    ctx.filter = "none";
                    ctx.globalCompositeOperation = "destination-in";
                    ctx.beginPath();
                    ctx.ellipse(canvas.width / 2, canvas.height / 2 + 50, 150, 200, 0, 0, 2 * Math.PI);
                    ctx.fill();
                    
                    ctx.globalCompositeOperation = "source-in";
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    ctx.globalCompositeOperation = "destination-over";
                    ctx.filter = "blur(15px)";
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    ctx.restore();
                }
                
                blurStateRef.current.animFrame = requestAnimationFrame(drawFrame);
            };
            
            drawFrame();
            
            const canvasStream = canvas.captureStream(30);
            const blurTrack = canvasStream.getVideoTracks()[0];
            
            const newStream = new MediaStream([blurTrack, ...localStreamRef.current.getAudioTracks()]);
            setLocalStream(newStream);
            localStreamRef.current = newStream;
            
            Object.values(peersRef.current).forEach(peer => {
                const sender = peer.getSenders().find(s => s.track?.kind === "video");
                if (sender) sender.replaceTrack(blurTrack);
            });
            
            setIsBlurOn(true);
        } catch (err) {
            console.error("Blur error:", err);
            toast.error("Background blur not supported: " + err.message);
            setIsBlurOn(false);
            blurStateRef.current.active = false;
        }
    };


    return (
        <div style={css.root}>
            <style>{globalCSS}</style>
            <aside style={css.sidebar}>
                <div style={css.logoArea}>
                    <div style={css.logoIcon}>
                        <img src="/favicon.png" alt="Logo" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                    </div>
                </div>
                <div style={css.sideNav}>
                    {["home", "video", "doc", "chat", "bell", "settings"].map((icon, i) => (
                        <button key={icon} style={{ ...css.sideBtn, ...(icon === "video" ? css.sideBtnActive : {}) }}>
                            {icon === "home" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>}
                            {icon === "video" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>}
                            {icon === "doc" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>}
                            {icon === "chat" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                            {icon === "bell" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>}
                            {icon === "settings" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
                        </button>
                    ))}
                </div>
                <button onClick={leaveRoom} style={css.sideExit}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                </button>
            </aside>

            <main style={css.main}>
                <header style={css.header}>
                    <div style={css.headerLeft}>
                        <div style={css.timeMeta}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <h1 style={css.roomTitle}>Meeting Session</h1>
                    </div>
                    <div style={css.headerRight}>
                        <div style={css.userPill}>
                            <Avatar name={myName} size={28} />
                            <span style={css.userName}>{myName}</span>
                        </div>
                    </div>
                </header>

                <div style={css.content}>

                    {(() => {
                        const allParticipants = [
                            {
                                id: "local",
                                isLocal: true,
                                stream: localStream,
                                userName: myName + " (You)",
                                isCameraOff: isCameraOff || !localStream,
                            },
                            ...Object.entries(remoteStreams).map(([id, data]) => ({
                                id,
                                isLocal: false,
                                stream: data.stream,
                                userName: data.userName,
                                isCameraOff: !data.stream || data.stream.getVideoTracks().length === 0,
                            }))
                        ];

                        const togglePin = (id) => {
                            setPinnedParticipantId(prev => prev === id ? null : id);
                        };

                        if (layoutMode === "grid") {
                            return (
                                <div style={{ display: "grid", gridTemplateColumns: allParticipants.length > 4 ? "repeat(3, 1fr)" : allParticipants.length > 1 ? "repeat(2, 1fr)" : "1fr", gap: 16, flex: 1, overflowY: "auto" }}>
                                    {allParticipants.map((p) => (
                                        <div key={p.id} onClick={() => togglePin(p.id)} style={{ ...css.stageArea, cursor: "pointer", border: pinnedParticipantId === p.id ? "2px solid #5B65DC" : "none", minHeight: 200 }}>
                                            {!p.isCameraOff && p.stream ? (
                                                <VideoPlayer stream={p.stream} muted={p.isLocal} volume={p.isLocal ? 0 : (participantVolumes[p.id] ?? 1) * masterVolume} />
                                            ) : (
                                                <div style={css.mainPlaceholder}>
                                                    <Avatar name={p.userName.replace(" (You)", "")} size={80} />
                                                    <p style={css.placeholderText}>{mediaError && p.isLocal ? mediaError : p.userName + "'s camera is off"}</p>
                                                </div>
                                            )}
                                            <div style={css.mainLabel}>
                                                <div style={css.statusDot} />
                                                {p.userName}
                                                {raisedHands.includes(p.id) && <span style={{ marginLeft: 8 }}>✋</span>}
                                                {networkStats[p.id] && (
                                                    <span title={networkStats[p.id] === "unsupported" ? "Network stats unsupported" : "Network: " + networkStats[p.id]} style={{ marginLeft: 8 }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={networkStats[p.id] === "good" ? "#10B981" : networkStats[p.id] === "fair" ? "#F59E0B" : networkStats[p.id] === "poor" ? "#EF4444" : "#D1D5DB"} strokeWidth="2">
                                                            <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12" y2="20" strokeWidth="4" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {flyingReactions.map(r => (
                                        <div key={r.id} className="flying-reaction" style={{ left: `${20 + Math.random() * 60}%` }}>
                                            {r.emoji}
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        let mainParticipant = allParticipants.find(p => p.id === pinnedParticipantId);
                        if (!mainParticipant) {
                            mainParticipant = allParticipants.find(p => !p.isLocal) || allParticipants[0];
                        }
                        const stripParticipants = allParticipants.filter(p => p.id !== mainParticipant.id);

                        return (
                            <>
                                {stripParticipants.length > 0 && (
                                    <div style={css.thumbStrip}>
                                        {stripParticipants.map((p) => (
                                            <div key={p.id} onClick={() => togglePin(p.id)} style={{ ...css.thumbCard, cursor: "pointer" }}>
                                                {!p.isCameraOff && p.stream ? (
                                                    <VideoPlayer stream={p.stream} muted={p.isLocal} volume={p.isLocal ? 0 : (participantVolumes[p.id] ?? 1) * masterVolume} />
                                                ) : (
                                                    <div style={css.thumbPlaceholder}><Avatar name={p.userName.replace(" (You)", "")} size={40} /></div>
                                                )}
                                                <div style={{...css.thumbLabel, display: 'flex', gap: 6, alignItems: 'center'}}>
                                                    <span>{p.userName}</span>
                                                    {raisedHands.includes(p.id) && <span>✋</span>}
                                                    {networkStats[p.id] && (
                                                        <span title={networkStats[p.id] === "unsupported" ? "Network stats unsupported" : "Network: " + networkStats[p.id]}>
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={networkStats[p.id] === "good" ? "#10B981" : networkStats[p.id] === "fair" ? "#F59E0B" : networkStats[p.id] === "poor" ? "#EF4444" : "#D1D5DB"} strokeWidth="2">
                                                                <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12" y2="20" strokeWidth="4" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div style={{ ...css.stageArea, cursor: "pointer" }} onClick={() => togglePin(mainParticipant.id)}>
                                    {!mainParticipant.isCameraOff && mainParticipant.stream ? (
                                        <VideoPlayer stream={mainParticipant.stream} muted={mainParticipant.isLocal} volume={mainParticipant.isLocal ? 0 : (participantVolumes[mainParticipant.id] ?? 1) * masterVolume} />
                                    ) : (
                                        <div style={css.mainPlaceholder}>
                                            <Avatar name={mainParticipant.userName.replace(" (You)", "")} size={120} />
                                            <p style={css.placeholderText}>{mediaError && mainParticipant.isLocal ? mediaError : mainParticipant.userName + "'s camera is off"}</p>
                                        </div>
                                    )}
                                    <div style={css.mainLabel}>
                                        <div style={css.statusDot} />
                                        {mainParticipant.userName}
                                        {pinnedParticipantId === mainParticipant.id && <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.8 }}>(Pinned)</span>}
                                        {raisedHands.includes(mainParticipant.id) && <span style={{ marginLeft: 8 }}>✋</span>}
                                        {networkStats[mainParticipant.id] && (
                                            <span title={networkStats[mainParticipant.id] === "unsupported" ? "Network stats unsupported" : "Network: " + networkStats[mainParticipant.id]} style={{ marginLeft: 8 }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={networkStats[mainParticipant.id] === "good" ? "#10B981" : networkStats[mainParticipant.id] === "fair" ? "#F59E0B" : networkStats[mainParticipant.id] === "poor" ? "#EF4444" : "#D1D5DB"} strokeWidth="2">
                                                    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12" y2="20" strokeWidth="4" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                    {flyingReactions.map(r => (
                                        <div key={r.id} className="flying-reaction" style={{ left: `${20 + Math.random() * 60}%` }}>
                                            {r.emoji}
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}

                    {featureFlags.meetingToolbar ? (
                        <footer style={css.controlPill}>
                            <div style={css.roomIdBox}>
                                <span style={css.roomLabel}>Meeting ID</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={css.roomValue}>{roomId}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(roomId); toast.success("Meeting ID copied!"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#5B65DC", padding: 4, display: "flex", alignItems: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div style={css.btnGroup}>
                                <CtrlBtn onClick={toggleMute} active={!isMuted} label={isMuted ? "Unmute" : "Mute"}>
                                    <IconMic muted={isMuted} />
                                </CtrlBtn>
                                <CtrlBtn onClick={toggleCamera} active={!isCameraOff} label={isCameraOff ? "Camera On" : "Camera Off"}>
                                    <IconCamera off={isCameraOff} />
                                </CtrlBtn>
                                <CtrlBtn 
                                    onClick={() => {
                                        const isRaised = raisedHands.includes("local");
                                        socket.emit("send-message", { roomId, type: "COMMAND", command: isRaised ? "LOWER_HAND" : "RAISE_HAND", targetId: "local", senderId: "local", sender: myName });
                                    }} 
                                    active={raisedHands.includes("local")} 
                                    label="Raise Hand"
                                >
                                    ✋
                                </CtrlBtn>
                                <div title={typeof document !== "undefined" && !document.createElement("canvas").captureStream ? "Background blur not supported on this browser" : isBlurOn ? "Disable Blur" : "Enable Blur"}>
                                    <CtrlBtn onClick={toggleBlur} active={isBlurOn} label="Blur" disabled={typeof document !== "undefined" && !document.createElement("canvas").captureStream}>
                                        <IconBlur />
                                    </CtrlBtn>
                                </div>
                                <CtrlBtn onClick={isScreenSharing ? stopScreenShare : startScreenShare} active={isScreenSharing} label={isScreenSharing ? "Stop Sharing" : "Share Screen"}>
                                    <IconScreenShare />
                                </CtrlBtn>
                                <div style={{ position: "relative" }}>
                                    <CtrlBtn onClick={() => setTimerOpen(!timerOpen)} active={timerOpen || timerRunning} label="Timer">
                                        ⏱️
                                    </CtrlBtn>
                                    {timerOpen && (
                                        <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 12, zIndex: 100, background: "#FFF", padding: 12, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: 8, border: "1px solid #EEEFFD", minWidth: 120 }}>
                                            <div style={{ fontSize: 24, fontWeight: 800, color: "#122056", textAlign: "center", fontFamily: "monospace" }}>{formatTimer(timerSeconds)}</div>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button onClick={() => setTimerRunning(!timerRunning)} style={{ flex: 1, padding: 6, background: timerRunning ? "#F59E0B" : "#10B981", color: "#FFF", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>{timerRunning ? "Pause" : "Start"}</button>
                                                <button onClick={() => { setTimerRunning(false); setTimerSeconds(0); }} style={{ padding: 6, background: "#F3F4F6", color: "#122056", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Reset</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 16 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#8B94B1", textTransform: "uppercase" }}>Master Vol</span>
                                    <input type="range" min="0" max="1" step="0.01" value={masterVolume} onChange={e => setMasterVolume(parseFloat(e.target.value))} style={{ width: 80, accentColor: "#5B65DC" }} />
                                </div>
                                {featureFlags.emojiReactions && (
                                    <div style={{ position: "relative" }}>
                                        <CtrlBtn onClick={() => setShowReactionPicker(!showReactionPicker)} active={showReactionPicker} label="Reactions">
                                            <IconEmoji />
                                        </CtrlBtn>
                                        {showReactionPicker && (
                                            <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 12, zIndex: 100 }}>
                                                <div style={{ background: "#FFF", borderRadius: 16, padding: "8px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", display: "flex", gap: 8, border: "1px solid #EEEFFD" }}>
                                                    {["👍", "👏", "💖", "😂", "🎉", "😮"].map(emoji => (
                                                        <button 
                                                            key={emoji} 
                                                            onClick={() => { socket.emit("reaction", { roomId, emoji }); setShowReactionPicker(false); }}
                                                            style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", padding: 8, borderRadius: 8, transition: "transform 0.2s" }}
                                                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                                                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <CtrlBtn 
                                    onClick={() => setLayoutMode(prev => prev === "speaker" ? "grid" : "speaker")} 
                                    active={layoutMode === "grid"} 
                                    label={layoutMode === "speaker" ? "Grid View" : "Speaker View"}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                    </svg>
                                </CtrlBtn>
                                <CtrlBtn label="More"><IconExpand /></CtrlBtn>
                            </div>
                            <button onClick={leaveRoom} style={css.endCallBtn}>
                                End Call
                            </button>
                        </footer>
                    ) : (
                        <footer style={css.controlPill}>
                            <div style={css.roomIdBox}>
                                <span style={css.roomLabel}>Meeting ID</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={css.roomValue}>{roomId}</span>
                                </div>
                            </div>
                            <button onClick={leaveRoom} style={css.endCallBtn}>End Call</button>
                        </footer>
                    )}
                </div>
            </main>

            <aside style={css.chatContainer}>
                <div style={css.panelHeader}>
                    <button
                        onClick={() => setActiveTab("chat")}
                        style={{ ...css.tab, ...(activeTab === "chat" ? css.tabActive : {}) }}
                    >
                        Chat
                    </button>
                    <button
                        onClick={() => setActiveTab("participants")}
                        style={{ ...css.tab, ...(activeTab === "participants" ? css.tabActive : {}) }}
                    >
                        Participants ({participants.length})
                    </button>
                </div>

                {activeTab === "chat" ? (
                    <>
                        <div style={css.chatList}>
                            {messages.length === 0 && (
                                <div style={css.chatEmpty}>No messages yet. Send a greeting to the patient.</div>
                            )}
                            {messages.map((msg, i) => {
                                const isOwn = msg.senderId === socket.id;
                                const sender = msg.sender || "Participant";
                                return (
                                    <div key={i} style={{ ...css.msgGroup, alignItems: isOwn ? "flex-end" : "flex-start" }}>
                                        {!isOwn && <div style={css.msgSender}>{sender}</div>}
                                        <div style={isOwn ? css.bubbleOwn : css.bubbleOther}>
                                            {msg.message}
                                        </div>
                                        <div style={css.msgMeta}>{msg.time ? formatTime(new Date(msg.time)) : ""}</div>
                                    </div>
                                );
                            })}
                            {typing && <div style={css.typingIndicator}>{typing}</div>}
                            <div ref={messagesEndRef} />
                        </div>

                        <div style={css.chatInputArea}>
                            <div style={{ position: "relative" }}>
                                <button onClick={() => setShowEmoji(!showEmoji)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: 48, width: 40, color: "#8B94B1" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                                </button>
                                {showEmoji && (
                                    <div style={{ position: "absolute", bottom: "100%", left: 0, marginBottom: 8, zIndex: 100 }}>
                                        <EmojiPicker onEmojiClick={(e) => { setMessage(prev => prev + e.emoji); setShowEmoji(false); }} theme="light" />
                                    </div>
                                )}
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={message}
                                onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
                                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                                placeholder="Send a message..."
                                style={css.chatInput}
                            />
                            <button onClick={sendMessage} style={css.chatSendBtn}>
                                <IconSend />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={css.participantList}>
                        {isHost && (
                            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                <button onClick={() => socket.emit("send-message", { roomId, type: "COMMAND", command: "MUTE_ALL", senderId: socket.id })} style={{...css.chatSendBtn, width: 'auto', padding: '0 12px', fontSize: 12, height: 32}}>Mute All</button>
                                <button onClick={() => socket.emit("send-message", { roomId, type: "COMMAND", command: "LOWER_HAND", targetId: "ALL", senderId: socket.id })} style={{...css.chatSendBtn, width: 'auto', padding: '0 12px', fontSize: 12, height: 32, background: '#F3F4F6', color: '#122056', border: '1px solid #EEEFFD'}}>Lower All Hands</button>
                            </div>
                        )}
                        {participants.map((p) => {
                            const pId = p.socketId === socket.id ? "local" : p.socketId;
                            return (
                            <div key={p.socketId} style={css.participantItem}>
                                <Avatar name={p.userName} size={32} />
                                <div style={css.participantInfo}>
                                    <div style={css.participantName}>
                                        {p.userName} {p.socketId === socket.id ? "(You)" : ""}
                                    </div>
                                    <div style={css.participantStatus}>
                                        <div style={{ ...css.statusDot, background: "#10B981" }} />
                                        Online
                                        {raisedHands.includes(pId) && <span style={{ marginLeft: 4 }}>✋</span>}
                                    </div>
                                </div>
                                {p.socketId !== socket.id && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: isHost ? 8 : 0 }}>
                                        <span style={{ fontSize: 8, fontWeight: 700, color: "#8B94B1" }}>VOL</span>
                                        <input type="range" min="0" max="1" step="0.01" value={participantVolumes[p.socketId] ?? 1} onChange={e => setParticipantVolumes({...participantVolumes, [p.socketId]: parseFloat(e.target.value)})} style={{ width: 40, accentColor: "#5B65DC" }} />
                                    </div>
                                )}
                                {isHost && p.socketId !== socket.id && (
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                                        {raisedHands.includes(pId) && (
                                            <button onClick={() => socket.emit("send-message", { roomId, type: "COMMAND", command: "LOWER_HAND", targetId: pId })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }} title="Lower Hand">👇</button>
                                        )}
                                        <button onClick={() => socket.emit("send-message", { roomId, type: "COMMAND", command: "MUTE_ONE", targetId: pId })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4 }} title="Mute Participant">
                                            <IconMic muted={true} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )})}
                    </div>
                )}
            </aside>
        </div>
    );
};


const globalCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  body {
    background: #FAFAFD;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #122056;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
  .pulse { animation: pulse 2s infinite ease-in-out; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  video {
    width: 100%; height: 100%;
    object-fit: cover;
    border-radius: 20px;
    display: block;
    background: #122056;
  }


  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

  @keyframes flyUpAndFade {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      50% { transform: translateY(-100px) scale(1.5); opacity: 1; }
      100% { transform: translateY(-200px) scale(1); opacity: 0; }
  }
  .flying-reaction {
      position: absolute;
      bottom: 20px;
      font-size: 40px;
      animation: flyUpAndFade 1.5s ease-out forwards;
      pointer-events: none;
      z-index: 50;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  }
`;

const css = {
    root: {
        display: "flex",
        height: "100vh",
        background: "#FAFAFD",
        overflow: "hidden",
    },


    sidebar: {
        width: 80,
        background: "#122056",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 0",
        flexShrink: 0,
        zIndex: 10,
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
    },
    logoArea: { marginBottom: 40 },
    logoIcon: {
        width: 40, height: 40,
        borderRadius: "12px",
        background: "#5B65DC",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 10px rgba(91, 101, 220, 0.3)",
    },
    sideNav: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    sideBtn: {
        width: 48, height: 48,
        borderRadius: "14px",
        border: "none",
        background: "transparent",
        color: "rgba(255,255,255,0.4)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
    },
    sideBtnActive: {
        background: "rgba(255,255,255,0.1)",
        color: "#FFFFFF",
    },
    sideExit: {
        width: 48, height: 48,
        borderRadius: "14px",
        border: "none",
        background: "rgba(255,77,78,0.1)",
        color: "#FF4D4E",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
    },


    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    },
    header: {
        height: 72,
        padding: "0 32px",
        background: "#FFFFFF",
        borderBottom: "1px solid #EEEFFD",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
    },
    timeMeta: { fontSize: 12, color: "#8B94B1", fontWeight: 600, marginBottom: 2 },
    roomTitle: { fontSize: 20, fontWeight: 700, color: "#122056", letterSpacing: "-0.5px" },
    userPill: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px",
        borderRadius: "12px",
        background: "#FAFAFD",
        border: "1px solid #EEEFFD",
    },
    userName: { fontSize: 13, fontWeight: 600, color: "#122056" },

    content: {
        flex: 1,
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        overflowY: "auto",
    },

    thumbStrip: {
        display: "flex",
        gap: 16,
    },
    thumbCard: {
        width: 180, height: 110,
        borderRadius: "20px",
        overflow: "hidden",
        background: "#FFFFFF",
        border: "1px solid #EEEFFD",
        position: "relative",
        boxShadow: "0 4px 10px rgba(18, 32, 86, 0.03)",
    },
    thumbPlaceholder: {
        width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#EEEFFD",
    },
    thumbLabel: {
        position: "absolute", bottom: 8, left: 8,
        background: "rgba(18, 32, 86, 0.6)",
        backdropFilter: "blur(4px)",
        color: "#FFFFFF", fontSize: 11, fontWeight: 600,
        padding: "3px 8px", borderRadius: "6px",
    },
    pulseSmall: { width: 12, height: 12, borderRadius: "50%", background: "#5B65DC" },

    stageArea: {
        flex: 1,
        background: "#122056",
        borderRadius: "24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(18, 32, 86, 0.1)",
    },
    mainPlaceholder: {
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 20,
    },
    placeholderText: { color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500 },
    mainLabel: {
        position: "absolute", bottom: 20, left: 20,
        background: "rgba(18, 32, 86, 0.4)",
        backdropFilter: "blur(10px)",
        color: "#FFFFFF", padding: "8px 16px",
        borderRadius: "12px", fontSize: 13, fontWeight: 600,
        display: "flex", alignItems: "center", gap: 8,
    },
    statusDot: { width: 8, height: 8, borderRadius: "50%", background: "#10B981" },

    controlPill: {
        height: 80,
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px, 0 10px 30px rgba(18, 32, 86, 0.05)",
    },
    roomIdBox: {
        display: "flex", flexDirection: "column", gap: 2,
    },
    roomLabel: { fontSize: 10, color: "#8B94B1", fontWeight: 700, textTransform: "uppercase" },
    roomValue: { fontSize: 14, color: "#122056", fontWeight: 700, fontFamily: "monospace" },
    btnGroup: { display: "flex", gap: 12 },
    endCallBtn: {
        padding: "12px 24px",
        borderRadius: "12px",
        background: "#FF4D4E",
        color: "#FFFFFF",
        border: "none",
        fontSize: 14, fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 4px 12px rgba(255, 77, 78, 0.2)",
    },


    chatContainer: {
        width: 360,
        background: "#FFFFFF",
        borderLeft: "1px solid #EEEFFD",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
    },
    panelHeader: {
        padding: "24px 24px 16px",
        display: "flex",
        gap: 20,
        borderBottom: "1px solid #FAFAFD",
    },
    tab: {
        fontSize: 14, fontWeight: 700, color: "#8B94B1",
        background: "none", border: "none", cursor: "pointer",
        paddingBottom: 8, position: "relative",
    },
    tabActive: {
        color: "#5B65DC",
    },
    participantList: {
        flex: 1,
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    participantItem: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px",
        borderRadius: "12px",
        background: "#FAFAFD",
        border: "1px solid #EEEFFD",
    },
    participantInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    participantName: {
        fontSize: 14,
        fontWeight: 700,
        color: "#122056",
    },
    participantStatus: {
        fontSize: 11,
        fontWeight: 600,
        color: "#8B94B1",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    chatList: {
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    chatEmpty: { textAlign: "center", color: "#8B94B1", fontSize: 13, marginTop: 40 },
    msgGroup: { display: "flex", flexDirection: "column", gap: 4 },
    msgSender: { fontSize: 11, fontWeight: 700, color: "#8B94B1", marginLeft: 4 },
    bubbleOther: {
        background: "#FAFAFD",
        color: "#122056",
        padding: "12px 16px",
        borderRadius: "0 16px 16px 16px",
        fontSize: 14, lineHeight: 1.5,
        maxWidth: "85%",
        border: "1px solid #EEEFFD",
    },
    bubbleOwn: {
        background: "#5B65DC",
        color: "#FFFFFF",
        padding: "12px 16px",
        borderRadius: "16px 16px 0 16px",
        fontSize: 14, lineHeight: 1.5,
        maxWidth: "85%",
    },
    msgMeta: { fontSize: 10, color: "#8B94B1", marginTop: 4, marginHorizontal: 4 },
    typingIndicator: { fontSize: 12, color: "#5B65DC", fontStyle: "italic", padding: "0 24px" },
    chatInputArea: {
        padding: "24px",
        borderTop: "1px solid #EEEFFD",
        display: "flex",
        gap: 12,
    },
    chatInput: {
        flex: 1,
        height: 48,
        background: "#FAFAFD",
        border: "1px solid #EEEFFD",
        borderRadius: "14px",
        padding: "0 16px",
        fontSize: 14,
        color: "#122056",
        outline: "none",
    },
    chatSendBtn: {
        width: 48, height: 48,
        borderRadius: "14px",
        background: "#5B65DC",
        color: "#FFFFFF",
        border: "none",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 10px rgba(91, 101, 220, 0.2)",
    },
};

export default MeetingRoom;