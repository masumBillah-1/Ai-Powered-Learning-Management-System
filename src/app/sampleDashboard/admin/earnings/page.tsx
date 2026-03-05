"use client";
import { useState } from "react";

export default function AdminEarningsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "payouts" | "statements">("overview");

  const stats = [
    { label: "Total Revenue", value: "৳4,82,000", color: "#FF0F7B" },
    { label: "This Month", value: "৳48,500", color: "#832388" },
    { label: "Instructor Payouts", value: "৳3,20,000", color: "#F89B29" },
    { label: "Platform Profit", value: "৳1,62,000", color: "#00C48C" },
  ];

  const payouts = [
    { id: 1, instructor: "Karim Hossain", amount: "৳5,000", requested: "Mar 1, 2024", status: "pending" },
    { id: 2, instructor: "Sadia Islam", amount: "৳2,500", requested: "Feb 28, 2024", status: "pending" },
    { id: 3, instructor: "Tanvir Hasan", amount: "৳3,500", requested: "Feb 20, 2024", status: "paid" },
  ];

  const statements = [
    { id: 1, instructor: "Karim Hossain", course: "Web Dev Bootcamp", student: "Rahim Uddin", date: "Mar 1, 2024", amount: "৳1,500" },
    { id: 2, instructor: "Karim Hossain", course: "Python Basics", student: "Sumaiya Islam", date: "Mar 1, 2024", amount: "৳1,200" },
    { id: 3, instructor: "Tanvir Hasan", course: "UI/UX Design", student: "Nusrat Jahan", date: "Feb 28, 2024", amount: "৳1,800" },
    { id: 4, instructor: "Sadia Islam", course: "React Advanced", student: "Tanvir Ahmed", date: "Feb 27, 2024", amount: "৳2,000" },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>Earnings</h2>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>Platform revenue overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "12px", padding: "18px", border: "1px solid #f0f0f0" }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>{s.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#f0f0f0", padding: "4px", borderRadius: "10px", width: "fit-content" }}>
        {(["overview", "payouts", "statements"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 24px", borderRadius: "8px", border: "none", cursor: "pointer",
            fontSize: "14px", fontWeight: "600", textTransform: "capitalize",
            background: activeTab === tab ? "linear-gradient(90deg, #FF0F7B, #F89B29)" : "transparent",
            color: activeTab === tab ? "#fff" : "#666",
          }}>{tab}</button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700" }}>Revenue Breakdown</h3>
            {[
              { label: "Web Dev Bootcamp", amount: "৳2,25,000", pct: 75 },
              { label: "Python for Beginners", amount: "৳1,17,600", pct: 49 },
              { label: "UI/UX Design", amount: "৳1,29,600", pct: 54 },
              { label: "React Advanced", amount: "৳10,000", pct: 10 },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>{r.label}</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#832388" }}>{r.amount}</span>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "#f0f0f0" }}>
                  <div style={{ height: "100%", width: r.pct + "%", borderRadius: "4px", background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#fafafa" }}>
              {["Instructor", "Amount", "Requested", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id} style={{ borderTop: "1px solid #f7f7f7" }}>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600" }}>{p.instructor}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "700", color: "#832388" }}>{p.amount}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>{p.requested}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                      background: p.status === "paid" ? "#f0fff8" : "#fff8f0",
                      color: p.status === "paid" ? "#00C48C" : "#F89B29" }}>
                      {p.status === "paid" ? "✓ Paid" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {p.status === "pending" && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={{ padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                          background: "linear-gradient(90deg, #FF0F7B, #F89B29)", color: "#fff", fontSize: "12px", fontWeight: "600" }}>Approve</button>
                        <button style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid #f0f0f0", cursor: "pointer",
                          background: "#fff", color: "#FF0F7B", fontSize: "12px", fontWeight: "600" }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Statements Tab */}
        {activeTab === "statements" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#fafafa" }}>
              {["Instructor", "Course", "Student", "Date", "Amount"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {statements.map(s => (
                <tr key={s.id} style={{ borderTop: "1px solid #f7f7f7" }}>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600" }}>{s.instructor}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{s.course}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{s.student}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#aaa" }}>{s.date}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "700", color: "#00C48C" }}>{s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}