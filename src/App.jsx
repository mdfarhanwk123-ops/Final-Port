import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route
        path="*"
        element={
          <div className="not-found">
            <h1>404</h1>
            <p>Page not found.</p>
            <a href="/">Return Home</a>
          </div>
        }
      />
    </Routes>
  );
}

export default App;