import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../services/settingsService";
import { useToast } from "./ToastProvider";

const SettingsTab = () => {
    const toast = useToast();
    const [user, setUser] = useState({ 
        name: "", 
        email: "", 
        settings: { muteMicOnJoin: false, disableCameraOnJoin: false } 
    });
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { 
        getSettings()
            .then(res => {
                if (res) {
                    setUser({
                        ...res,
                        settings: res.settings || { muteMicOnJoin: false, disableCameraOnJoin: false }
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false)); 
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = { 
                name: user.name, 
                email: user.email, 
                settings: user.settings 
            };
            if (password) payload.password = password;
            
            const updated = await updateSettings(payload);
            localStorage.setItem("user", JSON.stringify(updated));
            toast.success("Settings saved successfully!");
            setPassword("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: 40 }}>Loading settings...</div>;

    return (
        <div style={{ padding: 24, maxWidth: 600 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#122056", marginBottom: 24 }}>Account Settings</h2>
            
            <div style={{ 
                background: "#FFFFFF", 
                padding: 32, 
                borderRadius: 16, 
                boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px",
                display: "flex", 
                flexDirection: "column", 
                gap: 20 
            }}>
                
                <div>
                    <label style={{ display: "block", fontSize: 13, color: "#8B94B1", fontWeight: 700, marginBottom: 8 }}>Display Name</label>
                    <input 
                        value={user.name || ""} 
                        onChange={e => setUser({...user, name: e.target.value})} 
                        style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #EEEFFD", outline: "none", color: "#122056", fontWeight: 500 }} 
                    />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: 13, color: "#8B94B1", fontWeight: 700, marginBottom: 8 }}>Email Address</label>
                    <input 
                        value={user.email || ""} 
                        onChange={e => setUser({...user, email: e.target.value})} 
                        style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #EEEFFD", outline: "none", color: "#122056", fontWeight: 500 }} 
                    />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: 13, color: "#8B94B1", fontWeight: 700, marginBottom: 8 }}>New Password (leave blank to keep current)</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        style={{ width: "100%", padding: 14, borderRadius: 10, border: "1px solid #EEEFFD", outline: "none", color: "#122056", fontWeight: 500 }} 
                    />
                </div>

                <div style={{ height: 1, background: "#EEEFFD", margin: "10px 0" }} />

                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#122056", marginBottom: 16 }}>Meeting Preferences</h3>
                    
                    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 16, fontSize: 14, fontWeight: 600, color: "#122056" }}>
                        <input 
                            type="checkbox" 
                            checked={user.settings?.muteMicOnJoin || false} 
                            onChange={e => setUser({...user, settings: {...user.settings, muteMicOnJoin: e.target.checked}})} 
                            style={{ width: 18, height: 18, accentColor: "#5B65DC" }}
                        />
                        Mute microphone automatically on join
                    </label>
                    
                    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#122056" }}>
                        <input 
                            type="checkbox" 
                            checked={user.settings?.disableCameraOnJoin || false} 
                            onChange={e => setUser({...user, settings: {...user.settings, disableCameraOnJoin: e.target.checked}})} 
                            style={{ width: 18, height: 18, accentColor: "#5B65DC" }}
                        />
                        Turn off camera automatically on join
                    </label>
                </div>

                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    style={{ 
                        marginTop: 20, 
                        padding: "16px 24px", 
                        background: "#5B65DC", 
                        color: "#FFFFFF", 
                        borderRadius: 12, 
                        border: "none", 
                        cursor: saving ? "not-allowed" : "pointer", 
                        fontWeight: 800,
                        fontSize: 15,
                        transition: "all 0.2s",
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default SettingsTab;
