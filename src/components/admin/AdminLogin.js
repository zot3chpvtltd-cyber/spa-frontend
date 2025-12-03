import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Default admin credentials (in production, this should be handled by backend)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>Admin Login</h1>
        <p className="admin-subtitle">The Stone Edge Spa Administration</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="admin-credentials-hint">
          <p>Default: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

