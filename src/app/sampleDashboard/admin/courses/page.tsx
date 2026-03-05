"use client";
import { useState } from "react";

export default function AdminCoursesPage() {
  const [filter, setFilter] = useState("all");

  const courses = [
    { id: 1, title: "Complete Web Development Bootcamp", instructor: "Karim Hossain", students: 150, price: "৳1,500", status: "published", rating: 4.7, category: "Web Dev" },
    { id: 2, title: "Python for Beginners", instructor: "Karim Hossain", students: 98, price: "৳1,200", status: "published", rating: 4.5, category: "Programming" },
    { id: 3, title: "React Advanced", instructor: "Sadia Islam", students: 0, price: "৳2,000", status: "pending", rating: 0, category: "Web Dev" },
    { id: 4, title: "UI/UX Design Fundamentals", instructor: "Tanvir Ahmed", students: 72, price: "৳1,800", status: "published", rating: 4.8, category: "Design" },
    { id: 5, title: "Data Science with Python", instructor: "Nusrat Jahan", students: 0, price: "৳2,500", status: "rejected", rating: 0, category: "Data" },
  ];

  const statusColor = { published: "#00C48C", pending: "#F89B29", rejected: "#FF0F7B" };
  const statusBg    = { published: "#f0fff8", pending: "#fff8f0", rejected: "#fff5f8" };

  const filtered = filter === "all" ? courses : courses.filter(c => c.status === filter);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>All Courses</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>{courses.length} total courses</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "published", "pending", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: "600", textTransform: "capitalize",
              background: filter === f ? "linear-gradient(90deg, #FF0F7B, #F89B29)" : "#f0f0f0",
              color: filter === f ? "#fff" : "#555",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Course", "Instructor", "Category", "Students", "Price", "Rating", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderTop: "1px solid #f7f7f7" }}>
                <td style={{ padding: "14px 16px" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1a1a1a" }}>{c.title}</p>
                </td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{c.instructor}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "20px", background: "#f0f0f0", fontSize: "12px", fontWeight: "600", color: "#555" }}>{c.category}</span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>{c.students}</td>
                <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "700", color: "#832388" }}>{c.price}</td>
                <td style={{ padding: "14px 16px", fontSize: "13px", color: "#F89B29", fontWeight: "600" }}>{c.rating > 0 ? `⭐ ${c.rating}` : "—"}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                    color: statusColor[c.status as keyof typeof statusColor],
                    background: statusBg[c.status as keyof typeof statusBg],
                    textTransform: "capitalize",
                  }}>{c.status}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {c.status === "pending" && (
                      <button style={{ padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer", background: "linear-gradient(90deg, #FF0F7B, #F89B29)", color: "#fff", fontSize: "12px", fontWeight: "600" }}>Approve</button>
                    )}
                    <button style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid #f0f0f0", cursor: "pointer", background: "#fff", color: "#FF0F7B", fontSize: "12px", fontWeight: "600" }}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}