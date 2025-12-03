import { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalServices: 0,
    totalReviews: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const services = JSON.parse(localStorage.getItem("services") || "[]");
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");

    setStats({
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === "pending").length,
      totalServices: services.length || 6, // Default to 6 if no services in storage
      totalReviews: reviews.length || 3 // Default to 3 if no reviews in storage
    });
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

