"use client";
import { useState } from "react";

export default function AdminAnnouncementsPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("all");

  const announcements = [
    { id: 1, title: "Platform Maintenance", content: "আগামীকাল রাত ১২টায় ১ ঘণ্টা maintenance থাকবে।", target: "all", date: "Mar 1, 2024", author: "Admin" },
    { id: 2, title: "New Feature: Live Classes", content: "এখন থেকে live class করা যাবে। Instructors দেখুন।", target: "instructors", date: "Feb 25, 2024", author: "Admin" },
    { id: 3, title: "Enrollment Open", content: "নতুন batch এর enrollment শুরু হয়েছে।", target: "students", date: "Feb 20, 2024", author: "Admin" },
  ];

  const targetColor = { all: "#832388", students: "#FF0F7B", instructors: "#F89B29" };
  const targetBg    = { all: "#f5f0ff", students: "#fff5f8", instructors: "#fff8f0" };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>Announcements</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>Broadcast messages to your platform</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
          background: "linear-gradient(90deg, #FF0F7B, #F89B29)", color: "#fff", fontSize: "14px", fontWeight: "700",
        }}>+ New Announcement</button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", padding: "24px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(255,15,123,0.08)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700" }}>Create Announcement</h3>
          <div style={{ display: "grid", gap: "14px" }}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title..."
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e5e5", fontSize: "14px", outline: "none" }} />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your message..." rows={3}
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e5e5", fontSize: "14px", outline: "none", resize: "vertical" }} />
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Target:</label>
              {["all", "students", "instructors"].map(t => (
                <button key={t} onClick={() => setTarget(t)} style={{
                  padding: "6px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: "600", textTransform: "capitalize",
                  background: target === t ? "linear-gradient(90deg, #FF0F7B, #F89B29)" : "#f0f0f0",
                  color: target === t ? "#fff" : "#555",
                }}>{t}</button>
              ))}
              <button onClick={() => setShowForm(false)} style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: "linear-gradient(90deg, #FF0F7B, #F89B29)", color: "#fff", fontSize: "14px", fontWeight: "700" }}>
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: "grid", gap: "12px" }}>
        {announcements.map(a => (
          <div key={a.id} style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1a1a1a" }}>{a.title}</h3>
                <span style={{
                  padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", textTransform: "capitalize",
                  color: targetColor[a.target as keyof typeof targetColor],
                  background: targetBg[a.target as keyof typeof targetBg],
                }}>{a.target}</span>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#555" }}>{a.content}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>By {a.author} · {a.date}</p>
            </div>
            <div style={{ display: "flex", gap: "6px", marginLeft: "16px" }}>
              <button style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #f0f0f0", cursor: "pointer", background: "#fff", color: "#555", fontSize: "12px", fontWeight: "600" }}>Edit</button>
              <button style={{ padding: "6px 14px", borderRadius: "6px", border: "none", cursor: "pointer", background: "#fff5f8", color: "#FF0F7B", fontSize: "12px", fontWeight: "600" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}