import { useState, useEffect } from "react";
import "./StaffManagement.css";

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    photo: ""
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const storedStaff = JSON.parse(localStorage.getItem("staff") || "[]");
    setStaff(storedStaff);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      const updatedStaff = staff.map(s =>
        s.id === editingId ? { ...s, ...formData } : s
      );
      setStaff(updatedStaff);
      localStorage.setItem("staff", JSON.stringify(updatedStaff));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newStaff = {
        id: Date.now(),
        ...formData
      };
      const updatedStaff = [...staff, newStaff];
      setStaff(updatedStaff);
      localStorage.setItem("staff", JSON.stringify(updatedStaff));
    }
    
    setFormData({
      name: "",
      position: "",
      phone: "",
      email: "",
      photo: ""
    });
    setShowForm(false);
  };

  const handleEdit = (staffMember) => {
    setFormData(staffMember);
    setIsEditing(true);
    setEditingId(staffMember.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      const updatedStaff = staff.filter(s => s.id !== id);
      setStaff(updatedStaff);
      localStorage.setItem("staff", JSON.stringify(updatedStaff));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: "",
      position: "",
      phone: "",
      email: "",
      photo: ""
    });
  };

  return (
    <div className="staff-management">
      <div className="staff-header">
        <h1>Staff Management</h1>
        <button className="add-staff-btn" onClick={() => setShowForm(true)}>
          + Add Staff
        </button>
      </div>

      {showForm && (
        <div className="staff-form-container">
          <h2>{isEditing ? "Edit Staff" : "Add New Staff"}</h2>
          <form onSubmit={handleSubmit} className="staff-form">
            <div className="photo-upload-section">
              <div className="photo-preview">
                {formData.photo ? (
                  <img src={formData.photo} alt="Staff" />
                ) : (
                  <div className="photo-placeholder">No Photo</div>
                )}
              </div>
              <label className="photo-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
                Upload Photo
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Massage Therapist"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email (optional)"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {isEditing ? "Update Staff" : "Add Staff"}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="staff-list">
        <h2>All Staff ({staff.length})</h2>
        {staff.length === 0 ? (
          <div className="empty-state">
            <p>No staff members found</p>
          </div>
        ) : (
          <div className="staff-grid">
            {staff.map((staffMember) => (
              <div key={staffMember.id} className="staff-card">
                <div className="staff-photo">
                  {staffMember.photo ? (
                    <img src={staffMember.photo} alt={staffMember.name} />
                  ) : (
                    <div className="photo-placeholder">No Photo</div>
                  )}
                </div>
                <div className="staff-info">
                  <h3>{staffMember.name}</h3>
                  <p className="position">{staffMember.position}</p>
                  <p className="phone">📞 {staffMember.phone}</p>
                  {staffMember.email && <p className="email">✉ {staffMember.email}</p>}
                  <div className="staff-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(staffMember)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(staffMember.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffManagement;

