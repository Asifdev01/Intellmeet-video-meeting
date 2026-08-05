import { useState, useEffect } from "react";
import { getScheduledMeetings, createScheduledMeeting, deleteScheduledMeeting } from "../services/scheduledMeetingService";
import { useToast } from "./ToastProvider";

const ScheduleMeetingTab = () => {
    const toast = useToast();
    const [meetings, setMeetings] = useState([]);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        getScheduledMeetings()
            .then(setMeetings)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async () => {
        if (!title || !date || !time) {
            toast.error("Please fill all fields");
            return;
        }
        
        try {
            const newMeeting = await createScheduledMeeting({ title, date, time });
            setMeetings([...meetings, newMeeting]);
            setTitle(""); 
            setDate(""); 
            setTime("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to schedule meeting");
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#122056", marginBottom: 24 }}>Schedule a Meeting</h2>
            
            <div style={{ 
                background: "#FFFFFF", 
                padding: 24, 
                borderRadius: 16, 
                boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px",
                display: "flex", 
                gap: 16, 
                flexWrap: "wrap",
                marginBottom: 40
            }}>
                <div style={{ flex: "1 1 200px" }}>
                    <label style={{ display: "block", fontSize: 13, color: "#8B94B1", fontWeight: 700, marginBottom: 8 }}>Meeting Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Weekly Standup" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #EEEFFD", outline: "none" }} 
                    />
                </div>
                
                <div style={{ flex: "1 1 150px" }}>
                    <label style={{ display: "block", fontSize: 13, color: "#8B94B1", fontWeight: 700, marginBottom: 8 }}>Date</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)} 
                        style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #EEEFFD", outline: "none", color: "#122056" }} 
                    />
                </div>

                <div style={{ flex: "1 1 150px" }}>
                    <label style={{ display: "block", fontSize: 13, color: "#8B94B1", fontWeight: 700, marginBottom: 8 }}>Time</label>
                    <input 
                        type="time" 
                        value={time} 
                        onChange={e => setTime(e.target.value)} 
                        style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #EEEFFD", outline: "none", color: "#122056" }} 
                    />
                </div>
                
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button 
                        onClick={handleCreate} 
                        style={{ 
                            padding: "14px 28px", 
                            background: "#5B65DC", 
                            color: "#FFFFFF", 
                            borderRadius: 10, 
                            border: "none", 
                            cursor: "pointer",
                            fontWeight: 800,
                            height: 48
                        }}
                    >
                        Schedule
                    </button>
                </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#122056", marginBottom: 20 }}>Upcoming Meetings</h3>
            
            {loading ? (
                <div>Loading...</div>
            ) : meetings.length === 0 ? (
                <div style={{ background: "#FFFFFF", padding: 40, borderRadius: 16, textAlign: "center", color: "#8B94B1" }}>
                    No upcoming meetings scheduled.
                </div>
            ) : (
                <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
                    {meetings.map(m => (
                        <div key={m._id} style={{ 
                            padding: 24, 
                            background: "#FFFFFF", 
                            borderRadius: 16, 
                            boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px" 
                        }}>
                            <h4 style={{ fontSize: 16, fontWeight: 800, color: "#122056", marginBottom: 8 }}>{m.title}</h4>
                            <p style={{ color: "#8B94B1", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                                📅 {m.date} at 🕒 {m.time}
                            </p>
                            
                            <div style={{ display: "flex", gap: 10 }}>
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(m.meetingLink); toast.success("Link copied to clipboard!"); }} 
                                    style={{ 
                                        background: "#EEEFFD", 
                                        color: "#5B65DC", 
                                        border: "none", 
                                        padding: "10px 16px", 
                                        borderRadius: 8, 
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        flex: 1
                                    }}
                                >
                                    Copy Link
                                </button>
                                <button 
                                    onClick={async () => { 
                                        try {
                                            await deleteScheduledMeeting(m._id); 
                                            setMeetings(meetings.filter(x => x._id !== m._id)); 
                                        } catch (e) {
                                            console.error(e);
                                            toast.error("Failed to delete");
                                        }
                                    }} 
                                    style={{ 
                                        background: "rgba(255, 77, 78, 0.1)", 
                                        color: "#FF4D4E", 
                                        border: "none", 
                                        padding: "10px 16px", 
                                        borderRadius: 8, 
                                        cursor: "pointer",
                                        fontWeight: 700
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduleMeetingTab;
