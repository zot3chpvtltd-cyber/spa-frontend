import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./SalesManagement.css";

function SalesManagement() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const response = await api.get('/admin/sales');
      // Map backend PascalCase to frontend camelCase
      const mappedSales = response.data.map(sale => ({
        id: sale.SaleId,
        date: sale.SaleDate,
        customerName: sale.CustomerName,
        service: sale.ServiceName,
        amount: parseFloat(sale.Amount),
        paymentMethod: sale.PaymentMethod
      }));
      setSales(mappedSales);
    } catch (error) {
      console.error("Error loading sales:", error);
      toast.error("Failed to load sales");
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
  const todaySales = sales.filter(sale => {
    if (!sale.date) return false;
    const saleDate = new Date(sale.date).toDateString();
    const today = new Date().toDateString();
    return saleDate === today;
  }).reduce((sum, sale) => sum + (sale.amount || 0), 0);

  const monthlySales = sales.filter(sale => {
    if (!sale.date) return false;
    const saleDate = new Date(sale.date);
    const now = new Date();
    return saleDate.getMonth() === now.getMonth() &&
      saleDate.getFullYear() === now.getFullYear();
  }).reduce((sum, sale) => sum + (sale.amount || 0), 0);

  return (
    <div className="sales-management">
      <div className="sales-header">
        <h1>Sales Management</h1>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
          Sales are automatically created when bookings are confirmed or completed
        </p>
      </div>

      <div className="sales-stats">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">₹{totalSales.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Sales</h3>
          <p className="stat-value">₹{todaySales.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <p className="stat-value">₹{monthlySales.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-value">{sales.length}</p>
        </div>
      </div>

      <div className="sales-list">
        <h2>All Sales ({sales.length})</h2>
        {sales.length === 0 ? (
          <div className="empty-state">
            <p>No sales records found</p>
          </div>
        ) : (
          <div className="sales-table-container">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {sales.sort((a, b) => new Date(b.date) - new Date(a.date)).map((sale) => (
                  <tr key={sale.id}>
                    <td>{new Date(sale.date).toLocaleDateString()}</td>
                    <td>{sale.customerName}</td>
                    <td>{sale.service}</td>
                    <td className="amount-cell">₹{sale.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`payment-badge payment-${sale.paymentMethod.toLowerCase()}`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesManagement;
