import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";

// PAGES
import HomePage from "./pages/HomePage";
import VisitorCountDashboard from "./pages/VisitorCountDashboard"; // ✅ ADD THIS

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const FIXED_USER = "admin";
  const FIXED_PASS = "1234";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === FIXED_USER && password === FIXED_PASS) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    } else {
      setError("Invalid username or password");
    }
  };

  const onTyping = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>SmartGate</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={onTyping(setUsername)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={onTyping(setPassword)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  return isAuth ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* HOME */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* 🔥 DASHBOARD (FIXED) */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <VisitorCountDashboard />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;