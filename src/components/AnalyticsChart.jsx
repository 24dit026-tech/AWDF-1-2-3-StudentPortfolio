import { useState, useEffect } from "react";

export default function AnalyticsChart() {
  const [data, setData] = useState([
    { label: "Completed Tasks", count: 12, color: "#137333" },
    { label: "Pending Tasks", count: 5, color: "#B06000" },
    { label: "High Priority", count: 4, color: "#C5221F" },
    { label: "Medium Priority", count: 9, color: "#7266F0" }
  ]);

  return (
    <div style={{ background: "#F8F6FF", padding: "20px", borderRadius: "15px", marginTop: "20px", border: "1px solid #E0E0E0" }}>
      <h3 style={{ margin: "0 0 15px 0", color: "#5B5BE8", textAlign: "center" }}>
        📊 Task Performance Analytics (Lazy-Loaded Component)
      </h3>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "150px", padding: "10px 0" }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20%" }}>
            <span style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>{item.count}</span>
            <div
              style={{
                width: "100%",
                height: `${item.count * 10}px`,
                background: item.color,
                borderRadius: "8px 8px 0 0",
                transition: "height 0.5s ease"
              }}
            />
            <span style={{ fontSize: "12px", marginTop: "8px", textAlign: "center", fontWeight: "600" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
