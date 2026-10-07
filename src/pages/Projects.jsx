import { useEffect, useState, lazy, Suspense } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  registerUser,
  loginUser,
  getMeProfile,
  logoutUser,
  getToken
} from "../api";
import Spinner from "../components/Spinner";

// Lazy loaded heavy analytics chart component (Post-Lab Task)
const AnalyticsChart = lazy(() => import("../components/AnalyticsChart"));

export default function Projects() {
  // Auth state
  const [token, setTokenState] = useState(getToken());
  const [userProfile, setUserProfile] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Task state
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  // Practical 13: AI Generation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState("");

  async function handleGenerateAiDescription() {
    if (!title.trim()) {
      setError("Please enter a task title first to generate an AI description.");
      return;
    }
    setAiLoading(true);
    setError("");
    setAiNotice("");
    try {
      const res = await fetch("http://localhost:5000/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
        setAiNotice(data.fallback ? "✨ AI Fallback suggestion generated! (Server-side key safe in .env)" : "✨ AI description generated!");
      }
    } catch (err) {
      setError("Failed to connect to AI generator service.");
    } finally {
      setAiLoading(false);
    }
  }

  // Load user profile & tasks when token is available
  useEffect(() => {
    if (token) {
      loadProfileAndTasks();
    } else {
      setTasks([]);
      setUserProfile(null);
    }
  }, [token]);

  async function loadProfileAndTasks() {
    setLoading(true);
    setError("");
    try {
      const meRes = await getMeProfile();
      setUserProfile(meRes.user);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load protected task data.");
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setAuthLoading(true);
    setError("");
    setNotice("");
    try {
      if (authMode === "register") {
        const res = await registerUser(email, password);
        setNotice(res.message + " Please log in now.");
        setAuthMode("login");
      } else {
        const res = await loginUser(email, password);
        setNotice("Login successful! JWT Token acquired.");
        setTokenState(res.token);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    setTokenState(null);
    setUserProfile(null);
    setTasks([]);
    setNotice("Logged out successfully. Token cleared.");
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const created = await createTask({ title, description, priority });
      setTasks((current) => [created, ...current]);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setNotice("Task created successfully!");
    } catch (err) {
      setError(err.message || "Could not create task.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task) {
    setBusyId(task._id);
    setError("");
    setNotice("");
    try {
      const updated = await updateTask(task._id, {
        completed: !task.completed
      });
      setTasks((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
      setNotice("Task updated successfully!");
    } catch (err) {
      setError(err.message || "Could not update task.");
    } finally {
      setBusyId("");
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setBusyId(task._id);
    setError("");
    setNotice("");
    try {
      await deleteTask(task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      setNotice("Task deleted successfully!");
    } catch (err) {
      setError(err.message || "Could not delete task.");
    } finally {
      setBusyId("");
    }
  }

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-card" style={{ maxWidth: "850px", margin: "20px auto", padding: "30px", background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
      <h1 style={{ color: "#5B5BE8", marginBottom: "5px", textAlign: "center" }}>Practical 7: Auth & Middleware Pipeline</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}>
        JWT Authentication, Bcrypt Password Hashing & Server-side Middleware Validation
      </p>

      {/* Global Notices */}
      {notice && (
        <div role="status" style={{ padding: "12px 18px", borderRadius: "10px", background: "#E6F4EA", color: "#137333", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
          ✅ {notice}
        </div>
      )}

      {error && (
        <div role="alert" style={{ padding: "12px 18px", borderRadius: "10px", background: "#FCE8E6", color: "#C5221F", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
          ⚠️ {error}
        </div>
      )}

      {/* AUTH SECTION (If NOT Logged In) */}
      {!token ? (
        <div style={{ background: "#F8F6FF", padding: "30px", borderRadius: "15px", maxWidth: "500px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={() => setAuthMode("login")}
              style={{ padding: "10px 20px", borderRadius: "20px", background: authMode === "login" ? "#7266F0" : "#E0E0E0", color: authMode === "login" ? "#FFF" : "#333", border: "none", fontWeight: "bold", cursor: "pointer" }}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("register")}
              style={{ padding: "10px 20px", borderRadius: "20px", background: authMode === "register" ? "#7266F0" : "#E0E0E0", color: authMode === "register" ? "#FFF" : "#333", border: "none", fontWeight: "bold", cursor: "pointer" }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <h3 style={{ margin: 0, textAlign: "center", color: "#333" }}>
              {authMode === "login" ? "User Login (JWT Auth)" : "New User Registration (Bcrypt Hashing)"}
            </h3>
            <label style={{ fontWeight: "bold", fontSize: "14px" }}>Email Address:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 24dit026@student.ac.in"
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #CCC" }}
            />
            <label style={{ fontWeight: "bold", fontSize: "14px" }}>Password (min 6 chars):</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #CCC" }}
            />
            <button
              type="submit"
              disabled={authLoading}
              style={{ padding: "12px", borderRadius: "25px", background: "#7266F0", color: "#FFF", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
            >
              {authLoading ? "Processing..." : authMode === "login" ? "🔑 Login & Get JWT Token" : "📝 Register User"}
            </button>
          </form>
        </div>
      ) : (
        /* PROTECTED TASK MANAGER SECTION (If Logged In) */
        <div>
          {/* User Session Banner */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EEF6FF", padding: "15px 20px", borderRadius: "12px", marginBottom: "25px", border: "1px solid #B2B0FF" }}>
            <div>
              <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
                🔒 Logged In User: <span style={{ color: "#5B5BE8" }}>{userProfile?.email || "24dit026@student.ac.in"}</span>
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}>
                JWT Token Active (Expires in 1h) | Authorization Header set
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{ padding: "8px 18px", borderRadius: "20px", background: "#FCE8E6", color: "#C5221F", border: "none", fontWeight: "bold", cursor: "pointer" }}
            >
              🚪 Logout
            </button>
          </div>

          {/* Task Creation Form */}
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#F8F6FF", padding: "20px", borderRadius: "15px", marginBottom: "25px" }}>
            <h3 style={{ margin: 0, color: "#333" }}>Add Protected Task (Server-Side Validated)</h3>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title (required by validation middleware)"
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "15px" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (or click AI Suggest)"
                style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "15px" }}
              />
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={aiLoading}
                style={{ padding: "10px 16px", borderRadius: "8px", background: "#E8DBFF", color: "#7958F7", border: "1px solid #B2B0FF", fontWeight: "bold", cursor: "pointer" }}
              >
                {aiLoading ? "⏳ Generating..." : "✨ AI Suggest"}
              </button>
            </div>
            {aiNotice && <p style={{ margin: "2px 0 6px 0", fontSize: "12px", color: "#137333", fontWeight: "bold" }}>{aiNotice} (Editable suggestion - review before saving)</p>}
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <label style={{ fontWeight: "bold", fontSize: "14px" }}>Priority:</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CCC" }}>
                <option value="low">Low 🟢</option>
                <option value="medium">Medium 🟡</option>
                <option value="high">High 🔴</option>
              </select>
              <button
                type="submit"
                disabled={saving}
                style={{ marginLeft: "auto", padding: "10px 24px", borderRadius: "25px", background: "#7266F0", color: "#FFF", border: "none", fontWeight: "bold", cursor: "pointer" }}
              >
                {saving ? "Saving..." : "+ Add Task"}
              </button>
            </div>
          </form>

          {/* Search & Refresh */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search protected tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #CCC" }}
            />
            <button
              onClick={loadProfileAndTasks}
              disabled={loading}
              style={{ padding: "10px 18px", borderRadius: "8px", background: "#EEF6FF", color: "#5B5BE8", border: "1px solid #B2B0FF", cursor: "pointer", fontWeight: "bold" }}
            >
              🔄 Refresh Tasks
            </button>
          </div>

          {/* Task List */}
          {loading ? (
            <Spinner />
          ) : filteredTasks.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", padding: "30px 0" }}>No protected tasks found in database.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    background: task.completed ? "#F1F3F4" : "#FFFFFF",
                    border: "1px solid #E0E0E0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 6px 0", textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#888" : "#333" }}>
                      {task.title}
                    </h3>
                    {task.description && <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>{task.description}</p>}
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "13px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "12px", background: task.completed ? "#E6F4EA" : "#FEF7E0", color: task.completed ? "#137333" : "#B06000", fontWeight: "bold" }}>
                        Status: {task.completed ? "Completed" : "Pending"}
                      </span>
                      <span style={{ padding: "3px 10px", borderRadius: "12px", background: "#F1F3F4", color: "#555" }}>
                        Priority: {task.priority || "medium"}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      disabled={busyId === task._id}
                      onClick={() => handleToggle(task)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        background: task.completed ? "#FFF0F5" : "#E8F0FE",
                        color: task.completed ? "#C5221F" : "#1A73E8",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      {task.completed ? "Mark Pending" : "Mark Complete"}
                    </button>
                    <button
                      disabled={busyId === task._id}
                      onClick={() => handleDelete(task)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        background: "#FCE8E6",
                        color: "#C5221F",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lazy Loaded Heavy Analytics Chart Component */}
          <Suspense fallback={<div style={{ textAlign: "center", padding: "20px", color: "#5B5BE8" }}>⏳ Loading analytics chart chunk...</div>}>
            <AnalyticsChart />
          </Suspense>
        </div>
      )}
    </div>
  );
}