"use client";
import { useState } from "react";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<"students" | "instructors">("students");
  const [search, setSearch] = useState("");

  const students = [
    { id: 1, name: "Rahim Uddin", email: "rahim@gmail.com", enrolled: 5, joined: "Jan 15, 2024", blocked: false },
    { id: 2, name: "Sumaiya Islam", email: "sumaiya@gmail.com", enrolled: 3, joined: "Feb 10, 2024", blocked: false },
    { id: 3, name: "Tanvir Ahmed", email: "tanvir@gmail.com", enrolled: 7, joined: "Mar 5, 2024", blocked: true },
    { id: 4, name: "Nusrat Jahan", email: "nusrat@gmail.com", enrolled: 2, joined: "Apr 1, 2024", blocked: false },
  ];

  const instructors = [
    { id: 1, name: "Karim Hossain", email: "karim@gmail.com", courses: 4, students: 320, verified: true, blocked: false },
    { id: 2, name: "Sadia Islam", email: "sadia@gmail.com", courses: 1, students: 0, verified: false, blocked: false },
    { id: 3, name: "Tanvir Hasan", email: "tanvir2@gmail.com", courses: 2, students: 95, verified: true, blocked: false },
  ];

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
  const filteredInstructors = instructors.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase()));

  const Avatar = ({ name }: { name: string }) => (
    <div style={{
      width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #FF0F7B, #F89B29)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: "700", fontSize: "15px",
    }}>{name.charAt(0)}</div>
  );

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>Users</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>Manage students and instructors</p>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{ padding: "9px 14px", borderRadius: "8px", border: "1px solid #e5e5e5", fontSize: "14px", width: "240px", outline: "none" }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#f0f0f0", padding: "4px", borderRadius: "10px", width: "fit-content" }}>
        {(["students", "instructors"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 24px", borderRadius: "8px", border: "none", cursor: "pointer",
            fontSize: "14px", fontWeight: "600", textTransform: "capitalize",
            background: activeTab === tab ? "linear-gradient(90deg, #FF0F7B, #F89B29)" : "transparent",
            color: activeTab === tab ? "#fff" : "#666",
          }}>{tab}</button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        {activeTab === "students" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#fafafa" }}>
              {["Student", "Email", "Enrolled Courses", "Joined", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id} style={{ borderTop: "1px solid #f7f7f7" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Avatar name={s.name} />
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{s.email}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "700", color: "#832388" }}>{s.enrolled}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>{s.joined}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                      background: s.blocked ? "#fff5f8" : "#f0fff8", color: s.blocked ? "#FF0F7B" : "#00C48C" }}>
                      {s.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button style={{ padding: "5px 14px", borderRadius: "6px", border: "none", cursor: "pointer",
                      background: s.blocked ? "linear-gradient(90deg, #FF0F7B, #F89B29)" : "#f0f0f0",
                      color: s.blocked ? "#fff" : "#555", fontSize: "12px", fontWeight: "600" }}>
                      {s.blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#fafafa" }}>
              {["Instructor", "Email", "Courses", "Students", "Verified", "Action"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filteredInstructors.map(i => (
                <tr key={i.id} style={{ borderTop: "1px solid #f7f7f7" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Avatar name={i.name} />
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>{i.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{i.email}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "700", color: "#832388" }}>{i.courses}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "700", color: "#1a1a1a" }}>{i.students}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                      background: i.verified ? "#f0fff8" : "#fff8f0", color: i.verified ? "#00C48C" : "#F89B29" }}>
                      {i.verified ? "✓ Verified" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {!i.verified && (
                        <button style={{ padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                          background: "linear-gradient(90deg, #FF0F7B, #F89B29)", color: "#fff", fontSize: "12px", fontWeight: "600" }}>Verify</button>
                      )}
                      <button style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid #f0f0f0", cursor: "pointer",
                        background: "#fff", color: "#FF0F7B", fontSize: "12px", fontWeight: "600" }}>Block</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}