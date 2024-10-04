import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Email } from "@mui/icons-material";

function Login() {
  const [userId, setUserId] = useState("admin@ceedcivil.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [borderColor, setBorderColor] = useState(null);
  const { user, login, isAuthenticated, msg, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
    if (!user) setError(msg);

    if (isAuthenticated === true) {
      setBorderColor("success");
      navigate("/dashboard");
    } else if (isAuthenticated === true) {
      setBorderColor("danger");
    } else {
      setBorderColor(null);
    }
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setBorderColor(null);

    if (userId && password) login(userId, password);
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100">
      <div
        className={`login-card card p-4 shadow-lg rounded position-relative ${
          borderColor ? `border-${borderColor}` : ""
        }`}
      >
        {loading && (
          <div className="loading-indicator-container">
            <div className="loading-indicator"></div>
          </div>
        )}

        <div className="text-center mb-4">
          <img
            src="/api/placeholder/100/100"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "100px" }}
          />
        </div>

        <h2 className="card-title text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userId" className="form-label">
              User ID
            </label>
            <input
              type="text"
              className="form-control"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
