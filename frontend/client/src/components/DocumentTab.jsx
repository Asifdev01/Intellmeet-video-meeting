import { useState, useEffect } from "react";
import { getDocuments, deleteDocument } from "../services/documentService";
import { useToast } from "./ToastProvider";

const DocumentTab = () => {
    const toast = useToast();
    const [docs, setDocs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDocuments()
            .then(setDocs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDocument(id);
            setDocs(docs.filter(d => d._id !== id));
        } catch (error) {
            console.error("Failed to delete document:", error);
            toast.error("Failed to delete document");
        }
    };

    const handleDownload = (doc) => {
        const actionItemsText = doc.actionItems?.length 
            ? doc.actionItems.map(a => `- ${a.task} (@${a.assignee || 'Unassigned'})${a.deadline ? ` by ${a.deadline}` : ''}`).join("\n")
            : "No action items";
            
        const decisionsText = doc.decisionPoints?.length
            ? doc.decisionPoints.map(d => `- ${d}`).join("\n")
            : "No key decisions";

        const text = `Meeting Title: ${doc.title}
Date: ${new Date(doc.createdAt).toLocaleDateString()}
Sentiment: ${doc.sentiment || 'Neutral'}

--- SUMMARY ---
${doc.summary}

--- KEY DECISIONS ---
${decisionsText}

--- ACTION ITEMS ---
${actionItemsText}`;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title.replace(/\s+/g, '_')}_Summary.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filtered = docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

    if (loading) {
        return <div style={{ padding: 40, textAlign: "center" }}>Loading documents...</div>;
    }

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#122056", marginBottom: 20 }}>Saved Documents</h2>
            
            <input 
                type="text" 
                placeholder="Search by meeting title..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ 
                    padding: 16, 
                    marginBottom: 24, 
                    width: "100%", 
                    borderRadius: 12, 
                    border: "1px solid #EEEFFD",
                    background: "#FFFFFF",
                    fontSize: 15,
                    color: "#122056",
                    outline: "none"
                }} 
            />
            
            {filtered.length === 0 ? (
                <div style={{ background: "#FFFFFF", padding: 40, borderRadius: 16, textAlign: "center", color: "#8B94B1" }}>
                    No documents found.
                </div>
            ) : (
                <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
                    {filtered.map(doc => (
                        <div key={doc._id} style={{ 
                            padding: 24, 
                            background: "#FFFFFF", 
                            borderRadius: 16, 
                            boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#122056" }}>{doc.title}</h3>
                                {doc.sentiment && (
                                    <span style={{ 
                                        fontSize: 11, 
                                        fontWeight: 800, 
                                        padding: "4px 8px", 
                                        borderRadius: 6,
                                        background: doc.sentiment.toLowerCase() === "positive" ? "rgba(16, 185, 129, 0.1)" : doc.sentiment.toLowerCase() === "negative" ? "rgba(255, 77, 78, 0.1)" : "#EEEFFD",
                                        color: doc.sentiment.toLowerCase() === "positive" ? "#10B981" : doc.sentiment.toLowerCase() === "negative" ? "#FF4D4E" : "#5B65DC"
                                    }}>
                                        {doc.sentiment}
                                    </span>
                                )}
                            </div>
                            <p style={{ fontSize: 12, color: "#8B94B1", marginBottom: 16, fontWeight: 600 }}>
                                {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                            
                            <p style={{ fontSize: 14, color: "#122056", lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
                                {doc.summary.substring(0, 150)}...
                            </p>
                            
                            <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                                <button 
                                    onClick={() => handleDownload(doc)} 
                                    style={{ 
                                        background: "#EEEFFD", 
                                        color: "#5B65DC", 
                                        border: "none", 
                                        padding: "10px 16px", 
                                        borderRadius: 10, 
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        flex: 1
                                    }}
                                >
                                    Download TXT
                                </button>
                                <button 
                                    onClick={() => handleDelete(doc._id)} 
                                    style={{ 
                                        background: "rgba(255, 77, 78, 0.1)", 
                                        color: "#FF4D4E", 
                                        border: "none", 
                                        padding: "10px 16px", 
                                        borderRadius: 10, 
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

export default DocumentTab;
