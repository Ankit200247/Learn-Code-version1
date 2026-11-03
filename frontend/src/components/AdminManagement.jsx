import { useEffect, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function AdminManagement() {
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  async function fetchManagementData() {
    try {
      setLoading(true);
      setError("");

      const [studentResponse, adminResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/students`, { headers }),
        fetch(`${API_URL}/api/admin/management/users`, { headers }),
      ]);

      const studentData = await studentResponse.json();
      const adminData = await adminResponse.json();

      if (!studentResponse.ok) {
        throw new Error(studentData.message || "Unable to load students.");
      }

      if (!adminResponse.ok) {
        throw new Error(adminData.message || "Unable to load admins.");
      }

      setStudents(studentData.students || []);
      setAdmins(adminData.users || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchManagementData();
  }, []);

  async function updateRole(userId, role) {
    const action =
      role === "admin" ? "make this student an Admin" : "remove Admin access";

    if (!window.confirm(`Are you sure you want to ${action}?`)) return;

    try {
      setProcessing(userId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/management/users/${userId}/role`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update role.");
      }

      setMessage(data.message);
      await fetchManagementData();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing("");
    }
  }

  async function transferSuperAdmin(userId, userName) {
    const confirmed = window.confirm(
      `Transfer Super Admin access to ${userName}? Your account will become Admin.`
    );

    if (!confirmed) return;

    try {
      setProcessing(userId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/management/transfer-superadmin`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ newSuperAdminId: userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Transfer failed.");
      }

      setMessage(data.message || "Super Admin transferred successfully.");
      await fetchManagementData();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing("");
    }
  }

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "22px",
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "8px",
    padding: "9px 14px",
    cursor: "pointer",
    fontWeight: "600",
  };

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading Admin Management...</div>;
  }

  if (error && students.length === 0 && admins.length === 0) {
    return (
      <div style={{ padding: "30px", color: "#dc2626" }}>
        {error}
        <br />
        <button
          onClick={fetchManagementData}
          style={{ ...buttonStyle, marginTop: "15px" }}
        >
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
            Admin Management
          </h1>
          <p style={{ color: "#64748b", marginTop: "6px" }}>
            Manage Admin access and Super Admin responsibilities.
          </p>
        </div>

        <button
          onClick={fetchManagementData}
          style={{
            ...buttonStyle,
            background: "#5b35f5",
            color: "#fff",
          }}
        >
          Refresh Data
        </button>
      </div>

      {message && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ fontSize: "21px", marginTop: 0 }}>
          Current Admin Team
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: "600px",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name", "Email", "Role", "Action"].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "13px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {admins.map((user) => (
                <tr key={user._id}>
                  <td style={{ padding: "13px", borderBottom: "1px solid #eee" }}>
                    {user.name || "User"}
                  </td>

                  <td style={{ padding: "13px", borderBottom: "1px solid #eee" }}>
                    {user.email}
                  </td>

                  <td style={{ padding: "13px", borderBottom: "1px solid #eee" }}>
                    <span
                      style={{
                        background:
                          user.role === "superadmin" ? "#ede9fe" : "#dbeafe",
                        color:
                          user.role === "superadmin" ? "#6d28d9" : "#1d4ed8",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {user.role === "superadmin" ? "Super Admin" : "Admin"}
                    </span>
                  </td>

                  <td style={{ padding: "13px", borderBottom: "1px solid #eee" }}>
                    {user.role === "admin" && (
                      <button
                        disabled={processing === user._id}
                        onClick={() =>
                          transferSuperAdmin(user._id, user.name || user.email)
                        }
                        style={{
                          ...buttonStyle,
                          background: "#ede9fe",
                          color: "#6d28d9",
                        }}
                      >
                        {processing === user._id
                          ? "Please wait..."
                          : "Make Super Admin"}
                      </button>
                    )}

                    {user.role === "superadmin" && (
                      <span style={{ color: "#64748b", fontSize: "13px" }}>
                        Current Super Admin
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {admins.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
                    No Admin accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "21px", marginTop: 0 }}>
          Student Role Management
        </h2>

        <p style={{ color: "#64748b", marginBottom: "18px" }}>
          Promote a student to Admin or remove Admin access.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: "600px",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name", "Email", "Problems Solved", "Action"].map(
                  (heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "13px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td style={{ padding: "13px", borderBottom: "1px solid #eee" }}>
                    {student.name}
                  </td>

                  <td style={{ padding: "13px", borderBottom: "1px solid #eee" }}>
                    {student.email}
                  </td>

                  <td style={{ padding: "13px", borderBottom: "1px solid #eee" }}>
                    {student.totalProblemsSolved}
                  </td>

                  <td style={{ padding: "13px", borderBottom: "1px solid #eee" }}>
                    <button
                      disabled={processing === student.id}
                      onClick={() => updateRole(student.id, "admin")}
                      style={{
                        ...buttonStyle,
                        background: "#dcfce7",
                        color: "#15803d",
                      }}
                    >
                      {processing === student.id
                        ? "Please wait..."
                        : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
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