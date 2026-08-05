import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, muted = false, volume = 1 }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className="w-full h-full rounded-lg bg-[#111827] object-cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onCanPlay={(e) => e.target.play().catch(err => console.log("Autoplay blocked", err))}
        />
    );
};

export default VideoPlayer;