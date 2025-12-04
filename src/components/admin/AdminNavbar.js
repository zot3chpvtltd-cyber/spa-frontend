import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import "./AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Check if user is Master Admin
  const isMasterAdmin = user?.role === 'master_admin';

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-header">
        <h2>{isMasterAdmin ? 'ZOT3CH' : 'The Stone Edge Spa'}</h2>
        <span className="admin-badge">{isMasterAdmin ? 'Master Admin' : 'Admin Panel'}</span>
      </div>

      <div className="admin-nav-links">
        <button
          className={`admin-nav-link ${isActive("/admin/dashboard")}`}
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`admin-nav-link ${isActive("/admin/bookings")}`}
          onClick={() => navigate("/admin/bookings")}
        >
          Appointments
        </button>
        <button
          className={`admin-nav-link ${isActive("/admin/staff")}`}
          onClick={() => navigate("/admin/staff")}
        >
          Staff
        </button>
        <button
          className={`admin-nav-link ${isActive("/admin/services")}`}
          onClick={() => navigate("/admin/services")}
        >
          Services
        </button>
        <button
          className={`admin-nav-link ${isActive("/admin/inventory")}`}
          onClick={() => navigate("/admin/inventory")}
        >
          Inventory
        </button>
        <button
          className={`admin-nav-link ${isActive("/admin/sales")}`}
          onClick={() => navigate("/admin/sales")}
        >
          Sales
        </button>
        <button
          className={`admin-nav-link ${isActive("/admin/expenses")}`}
          onClick={() => navigate("/admin/expenses")}
        >
          Expenses
        </button>
        <button
          className={`admin-nav-link ${isActive("/admin/reviews")}`}
          onClick={() => navigate("/admin/reviews")}
        >
          Reviews
        </button>
      </div>

      <div className="admin-nav-actions">
        <button className="admin-home-btn" onClick={() => navigate("/")}>
          View Site
        </button>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;

