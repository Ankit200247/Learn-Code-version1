import { useEffect, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAdminData() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [overviewResponse, studentsResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/overview`, { headers }),
        fetch(`${API_URL}/api/admin/students`, { headers }),
      ]);

      const overviewData = await overviewResponse.json();
      const studentsData = await studentsResponse.json();

      if (!overviewResponse.ok) {
        throw new Error(
          overviewData.message || "Unable to load dashboard."
        );
      }

      if (!studentsResponse.ok) {
        throw new Error(
          studentsData.message || "Unable to load students."
        );
      }

      setOverview(overviewData.overview);
      setStudents(studentsData.students || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  const isActive = (lastActiveAt) => {
    if (!lastActiveAt) return false;

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return new Date(lastActiveAt).getTime() >= sevenDaysAgo;
  };

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  };

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading admin dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "30px", color: "#dc2626" }}>
        {error}
        <br />
        <button onClick={fetchAdminData} style={{ marginTop: "15px" }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "25px", width: "100%", color: "#172033" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "#64748b", marginTop: "6px" }}>
            Monitor students and their learning performance.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          style={{
            background: "#5b35f5",
            color: "#fff",
            border: "none",
            borderRadius: "9px",
            padding: "11px 20px",
            cursor: "pointer",
          }}
        >
          Refresh Data
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <p style={{ color: "#64748b" }}>Total Students</p>
          <h2>{overview?.totalStudents ?? 0}</h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#64748b" }}>Active Students</p>
          <h2 style={{ color: "#16a34a" }}>
            {overview?.activeStudents ?? 0}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#64748b" }}>Inactive Students</p>
          <h2 style={{ color: "#dc2626" }}>
            {overview?.inactiveStudents ?? 0}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "#64748b" }}>Questions Solved</p>
          <h2>{overview?.totalSolvedQuestions ?? 0}</h2>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "21px", marginTop: 0 }}>
          Registered Students
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              minWidth: "650px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {[
                  "Student",
                  "Email",
                  "Registered",
                  "Problems Solved",
                  "Modules",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "14px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => {
                const active = isActive(student.lastActiveAt);

                return (
                  <tr key={student.id}>
                    <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                      {student.name}
                    </td>

                    <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                      {student.email}
                    </td>

                    <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                      {student.registeredAt
                        ? new Date(student.registeredAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                      {student.totalProblemsSolved}
                    </td>

                    <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                      {student.completedModules}
                    </td>

                    <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                      <span
                        style={{
                          color: active ? "#15803d" : "#dc2626",
                          background: active ? "#dcfce7" : "#fee2e2",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                        }}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {students.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: "20px", textAlign: "center" }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}