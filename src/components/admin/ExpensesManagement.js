import { useState, useEffect } from "react";
import "./ExpensesManagement.css";

function ExpensesManagement() {
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    category: "",
    description: "",
    amount: "",
    paymentMethod: "",
    vendor: ""
  });

  const categories = ["Inventory", "Staff Salary", "Rent", "Utilities", "Marketing", "Maintenance", "Other"];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(storedExpenses);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      const updatedExpenses = expenses.map(expense =>
        expense.id === editingId ? { ...expense, ...formData, amount: parseFloat(formData.amount) } : expense
      );
      setExpenses(updatedExpenses);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const expense = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      };
      const updatedExpenses = [...expenses, expense];
      setExpenses(updatedExpenses);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    }
    
    setFormData({
      date: "",
      category: "",
      description: "",
      amount: "",
      paymentMethod: "",
      vendor: ""
    });
    setShowForm(false);
    alert(isEditing ? "Expense updated successfully!" : "Expense recorded successfully!");
  };

  const handleEdit = (expense) => {
    setFormData({
      ...expense,
      amount: expense.amount.toString()
    });
    setIsEditing(true);
    setEditingId(expense.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
    setFormData({
      date: "",
      category: "",
      description: "",
      amount: "",
      paymentMethod: "",
      vendor: ""
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const todayExpenses = expenses.filter(expense => {
    if (!expense.date) return false;
    const expenseDate = new Date(expense.date).toDateString();
    const today = new Date().toDateString();
    return expenseDate === today;
  }).reduce((sum, expense) => sum + (expense.amount || 0), 0);

  const monthlyExpenses = expenses.filter(expense => {
    if (!expense.date) return false;
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + (expense.amount || 0), 0);

  return (
    <div className="expenses-management">
      <div className="expenses-header">
        <h1>Expenses Management</h1>
        <button className="add-expense-btn" onClick={() => setShowForm(true)}>
          + Add Expense
        </button>
      </div>

      <div className="expenses-stats">
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value">₹{totalExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Expenses</h3>
          <p className="stat-value">₹{todayExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <p className="stat-value">₹{monthlyExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <h3>Total Records</h3>
          <p className="stat-value">{expenses.length}</p>
        </div>
      </div>

      {showForm && (
        <div className="expenses-form-container">
          <h2>{isEditing ? "Edit Expense" : "Record New Expense"}</h2>
          <form onSubmit={handleSubmit} className="expenses-form">
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter expense description"
                />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vendor/Supplier</label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  placeholder="Enter vendor name (optional)"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {isEditing ? "Update Expense" : "Record Expense"}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="expenses-list">
        <h2>All Expenses ({expenses.length})</h2>
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expense records found</p>
          </div>
        ) : (
          <div className="expenses-table-container">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Vendor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map((expense) => (
                  <tr key={expense.id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`category-badge category-${expense.category.toLowerCase().replace(" ", "-")}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td>{expense.description}</td>
                    <td className="amount-cell">₹{expense.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`payment-badge payment-${expense.paymentMethod.toLowerCase()}`}>
                        {expense.paymentMethod}
                      </span>
                    </td>
                    <td>{expense.vendor || "N/A"}</td>
                    <td>
                      <div className="expense-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(expense)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default ExpensesManagement;

