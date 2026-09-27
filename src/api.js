const BASE_URL = "http://localhost:5000";

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (response.status === 401) {
    removeToken();
    throw new Error(data?.message || "Unauthorized (401). Please login again.");
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}

// Authentication API calls
export const registerUser = (email, password) =>
  request("/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

export const loginUser = async (email, password) => {
  const res = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (res.token) {
    setToken(res.token);
  }
  return res;
};

export const getMeProfile = () => request("/me");

export const logoutUser = () => {
  removeToken();
};

// Protected Task API calls
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
