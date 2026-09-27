import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api";
import Spinner from "../components/Spinner";

export default function Projects() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Could not load tasks from backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

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
    <div className="page-card" style={{ maxWidth: "800px", margin: "20px auto", padding: "30px", background: "white", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
      <h1 style={{ color: "#5B5BE8", marginBottom: "10px", textAlign: "center" }}>Task Manager (Full-Stack Integration)</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}>Connected to Node.js/Express + MongoDB Backend (Port 5000)</p>

      {/* Task Creation Form */}
      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#F8F6FF", padding: "20px", borderRadius: "15px", marginBottom: "25px" }}>
        <h3 style={{ margin: 0, color: "#333" }}>Add New Task</h3>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (required)"
          style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "15px" }}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "15px" }}
        />
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
            style={{ marginLeft: "auto", padding: "10px 24px", borderRadius: "25px", background: "#7266F0", color: "#FFF", border: "none", fontWeight: "bold", cursor: "pointer", transition: "0.2s" }}
          >
            {saving ? "Saving..." : "+ Add Task"}
          </button>
        </div>
      </form>

      {/* Inline Feedback Notices */}
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

      {/* Filter / Search Bar & Refresh */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #CCC" }}
        />
        <button
          onClick={loadTasks}
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
        <p style={{ textAlign: "center", color: "#888", padding: "30px 0" }}>No tasks found in MongoDB database.</p>
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
    </div>
  );
}