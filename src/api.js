const BASE_URL = "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}

export const getTasks = () => request("/tasks");

export const createTask = (task) =>
  request("/tasks", {
    method: "POST",
    body: JSON.stringify(task)
  });

export const updateTask = (id, updates) =>
  request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates)
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: "DELETE"
  });
