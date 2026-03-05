// Brand Colors:
// --bp: #FF0F7B (Hot Pink)
// --bo: #F89B29 (Orange)
// --bpu: #832388 (Purple)
// --br: #E3436B (Rose)
// --by: #FDE047 (Yellow)

export default function AdminDashboard() {
  const stats = [
    { label: "Total Students", value: "1,240", change: "+12%", icon: "🎓", color: "#FF0F7B" },
    { label: "Total Instructors", value: "38", change: "+3%", icon: "👨‍🏫", color: "#832388" },
    { label: "Active Courses", value: "94", change: "+8%", icon: "📚", color: "#F89B29" },
    { label: "Total Revenue", value: "৳4,82,000", change: "+21%", icon: "💰", color: "#00C48C" },
  ];

  const recentTransactions = [
    { name: "Rahim Uddin", course: "Web Dev Bootcamp", amount: "৳1,500", date: "Today, 10:00 AM" },
    { name: "Sumaiya Islam", course: "Python for Beginners", amount: "৳1,200", date: "Today, 9:30 AM" },
    { name: "Tanvir Ahmed", course: "React Advanced", amount: "৳2,000", date: "Yesterday" },
    { name: "Nusrat Jahan", course: "UI/UX Design", amount: "৳1,800", date: "Yesterday" },
  ];

  const pendingActions = [
    { type: "Course Approval", detail: "React Advanced by Karim", urgent: true },
    { type: "Payout Request", detail: "৳5,000 from Karim Hossain", urgent: true },
    { type: "New Instructor", detail: "Sadia Islam pending verify", urgent: false },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#1a1a1a" }}>
          Welcome back, Admin 👋
        </h2>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
          Here's what's happening on your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: "12px", padding: "20px",
            border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: "26px", fontWeight: "800", color: "#1a1a1a" }}>{s.value}</p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#00C48C", fontWeight: "600" }}>{s.change} this month</p>
              </div>
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px", fontSize: "22px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: s.color + "15",
              }}>{s.icon}</div>
            </div>
            <div style={{ marginTop: "14px", height: "3px", borderRadius: "2px", background: "#f0f0f0" }}>
              <div style={{ height: "100%", width: "65%", borderRadius: "2px", background: `linear-gradient(90deg, ${s.color}, #F89B29)` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px" }}>

        {/* Recent Transactions */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Recent Transactions</h3>
            <a href="/sampleDashboard/admin/earnings" style={{ fontSize: "13px", color: "#FF0F7B", textDecoration: "none", fontWeight: "600" }}>View all →</a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["Student", "Course", "Amount", "Date"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t, i) => (
                <tr key={i} style={{ borderTop: "1px solid #f7f7f7" }}>
                  <td style={{ padding: "12px 20px", fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>{t.name}</td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", color: "#666" }}>{t.course}</td>
                  <td style={{ padding: "12px 20px", fontSize: "14px", fontWeight: "700", color: "#00C48C" }}>{t.amount}</td>
                  <td style={{ padding: "12px 20px", fontSize: "12px", color: "#aaa" }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Actions */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Pending Actions</h3>
          </div>
          <div style={{ padding: "12px" }}>
            {pendingActions.map((a, i) => (
              <div key={i} style={{
                padding: "12px", borderRadius: "8px", marginBottom: "8px",
                background: a.urgent ? "#fff5f8" : "#fafafa",
                border: `1px solid ${a.urgent ? "#ffcce0" : "#f0f0f0"}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: a.urgent ? "#FF0F7B" : "#1a1a1a" }}>{a.type}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888" }}>{a.detail}</p>
                </div>
                <button style={{
                  padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                  background: a.urgent ? "linear-gradient(90deg, #FF0F7B, #F89B29)" : "#f0f0f0",
                  color: a.urgent ? "#fff" : "#555", fontSize: "12px", fontWeight: "600",
                }}>
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}