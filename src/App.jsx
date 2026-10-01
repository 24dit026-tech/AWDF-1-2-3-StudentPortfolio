import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Lazy-loaded route components (Code Splitting)
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Fallback UI component for Suspense
function LoadingFallback() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#5B5BE8" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>⏳ Loading page chunk...</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>
        React Suspense is loading the requested route bundle dynamically on demand.
      </p>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : "light"}>
      <Navbar />

      <div style={{ textAlign: "center", margin: "20px" }}>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;