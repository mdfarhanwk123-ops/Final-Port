import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-grid"></div>
      <div className="admin-login-container">
        <a href="/" className="admin-back">← RETURN TO PORTFOLIO</a>

        <div className="admin-login-card">
          <div className="admin-logo">MF</div>
          <div className="admin-label">ADMIN ACCESS</div>
          <h1>SYSTEM LOGIN</h1>
          <p>Authenticate to manage portfolio content.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn btn-primary admin-login-button" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "AUTHENTICATE →"}
            </button>
          </form>
        </div>

        <p className="admin-warning">⚠ AUTHORIZED PERSONNEL ONLY</p>
      </div>
    </div>
  );
}

export default AdminLogin;