import { useState, useEffect } from "react";
import "./InventoryManagement.css";

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "",
    price: "",
    supplier: ""
  });

  const categories = ["Oil", "Soap", "Shampoo", "Lotion", "Cream", "Towel", "Other"];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const storedInventory = JSON.parse(localStorage.getItem("inventory") || "[]");
    setInventory(storedInventory);
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
      const updatedInventory = inventory.map(item =>
        item.id === editingId ? { ...item, ...formData, quantity: parseFloat(formData.quantity), price: parseFloat(formData.price) } : item
      );
      setInventory(updatedInventory);
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        createdAt: new Date().toISOString()
      };
      const updatedInventory = [...inventory, newItem];
      setInventory(updatedInventory);
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    }
    
    setFormData({
      itemName: "",
      category: "",
      quantity: "",
      unit: "",
      price: "",
      supplier: ""
    });
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      quantity: item.quantity.toString(),
      price: item.price.toString()
    });
    setIsEditing(true);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedInventory = inventory.filter(item => item.id !== id);
      setInventory(updatedInventory);
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
    setFormData({
      itemName: "",
      category: "",
      quantity: "",
      unit: "",
      price: "",
      supplier: ""
    });
  };

  const updateQuantity = (id, change) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
  };

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <button className="add-item-btn" onClick={() => setShowForm(true)}>
          + Add Item
        </button>
      </div>

      {showForm && (
        <div className="inventory-form-container">
          <h2>{isEditing ? "Edit Item" : "Add New Item"}</h2>
          <form onSubmit={handleSubmit} className="inventory-form">
            <div className="form-row">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Lavender Oil"
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
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., ml, kg, pieces"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Enter supplier name (optional)"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {isEditing ? "Update Item" : "Add Item"}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="inventory-list">
        <h2>All Items ({inventory.length})</h2>
        {inventory.length === 0 ? (
          <div className="empty-state">
            <p>No inventory items found</p>
          </div>
        ) : (
          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>
                      <span className={`category-badge category-${item.category.toLowerCase()}`}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{item.unit}</td>
                    <td>₹{item.price}</td>
                    <td>{item.supplier || "N/A"}</td>
                    <td>
                      <div className="item-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
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

export default InventoryManagement;

