import { useState, useEffect } from "react";
import "./ServicesManagement.css";
import service1 from "../../assets/img1.jpg";
import service2 from "../../assets/img2.jpg";
import service3 from "../../assets/img3.jpg";

function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    image: service1
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const storedServices = JSON.parse(localStorage.getItem("services") || "[]");
    if (storedServices.length === 0) {
      // Initialize with default services
      const defaultServices = [
        {
          id: 1,
          title: "Signature Massage",
          description: "A full-body massage that restores balance and relieves tension. Experience our signature blend of traditional techniques and modern wellness.",
          duration: "60 minutes",
          price: "₹2,500",
          image: service1
        },
        {
          id: 2,
          title: "Rejuvenating Facial",
          description: "Deep cleansing and hydrating facial treatment that revitalizes your skin. Includes exfoliation, extraction, and nourishing mask.",
          duration: "45 minutes",
          price: "₹1,800",
          image: service2
        },
        {
          id: 3,
          title: "Hot Stone Therapy",
          description: "Stress melting heated stone therapy that promotes deep relaxation. Smooth, heated stones are placed on key points of your body.",
          duration: "90 minutes",
          price: "₹3,500",
          image: service3
        },
        {
          id: 4,
          title: "Aromatherapy Session",
          description: "Therapeutic essential oils combined with gentle massage techniques. Customized blends to address your specific wellness needs.",
          duration: "60 minutes",
          price: "₹2,200",
          image: service1
        },
        {
          id: 5,
          title: "Couple Spa Package",
          description: "Perfect romantic escape for couples. Enjoy side-by-side treatments in a private, serene environment designed for two.",
          duration: "120 minutes",
          price: "₹5,500",
          image: service2
        },
        {
          id: 6,
          title: "Thai Traditional Massage",
          description: "Authentic Thai massage combining acupressure, stretching, and yoga-like movements. Improves flexibility and energy flow.",
          duration: "75 minutes",
          price: "₹2,800",
          image: service3
        }
      ];
      setServices(defaultServices);
      localStorage.setItem("services", JSON.stringify(defaultServices));
    } else {
      setServices(storedServices);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const imageMap = {
      service1: service1,
      service2: service2,
      service3: service3
    };
    setFormData(prev => ({
      ...prev,
      image: imageMap[e.target.value] || service1
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      const updatedServices = services.map(service =>
        service.id === editingId ? { ...service, ...formData } : service
      );
      setServices(updatedServices);
      localStorage.setItem("services", JSON.stringify(updatedServices));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newService = {
        id: Date.now(),
        ...formData
      };
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      localStorage.setItem("services", JSON.stringify(updatedServices));
    }
    
    setFormData({
      title: "",
      description: "",
      duration: "",
      price: "",
      image: service1
    });
  };

  const handleEdit = (service) => {
    setFormData(service);
    setIsEditing(true);
    setEditingId(service.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const updatedServices = services.filter(service => service.id !== id);
      setServices(updatedServices);
      localStorage.setItem("services", JSON.stringify(updatedServices));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      duration: "",
      price: "",
      image: service1
    });
  };

  return (
    <div className="services-management">
      <h1>Services Management</h1>

      <div className="services-form-container">
        <h2>{isEditing ? "Edit Service" : "Add New Service"}</h2>
        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-row">
            <div className="form-group">
              <label>Service Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Signature Massage"
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                placeholder="e.g., 60 minutes"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="e.g., ₹2,500"
              />
            </div>

            <div className="form-group">
              <label>Image</label>
              <select
                name="image"
                value={formData.image === service1 ? "service1" : formData.image === service2 ? "service2" : "service3"}
                onChange={handleImageChange}
                required
              >
                <option value="service1">Service Image 1</option>
                <option value="service2">Service Image 2</option>
                <option value="service3">Service Image 3</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter service description..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {isEditing ? "Update Service" : "Add Service"}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="services-list">
        <h2>All Services ({services.length})</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card-admin">
              <div className="service-image-wrapper">
                <img src={service.image} alt={service.title} />
              </div>
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-details">
                  <span>⏱ {service.duration}</span>
                  <span>💰 {service.price}</span>
                </div>
                <div className="service-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesManagement;

