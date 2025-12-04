import { useState, useEffect } from "react";
import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalServices: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard stats from API
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to default values on error
        setStats({
          totalBookings: 0,
          pendingBookings: 0,
          totalServices: 0,
          totalReviews: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p className="dashboard-subtitle">Welcome to The Stone Edge Spa Administration</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingBookings}</h3>
            <p>Pending Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💆</div>
          <div className="stat-info">
            <h3>{stats.totalServices}</h3>
            <p>Active Services</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{stats.totalReviews}</h3>
            <p>Total Reviews</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card">
            <h3>Manage Bookings</h3>
            <p>View and manage all customer bookings</p>
          </div>
          <div className="action-card">
            <h3>Manage Services</h3>
            <p>Add, edit, or remove spa services</p>
          </div>
          <div className="action-card">
            <h3>Manage Reviews</h3>
            <p>View and moderate customer reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

