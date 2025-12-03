import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Membership.css";

function Membership() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const membershipPlans = [
    {
      id: 1,
      name: "3 Months",
      duration: "3 Months",
      price: 15000,
      originalPrice: 18000,
      discount: "17% OFF",
      features: [
        "Unlimited Spa Sessions",
        "Priority Booking",
        "10% Discount on Additional Services",
        "Free Consultation",
        "Wellness Tips & Guidance"
      ],
      popular: false
    },
    {
      id: 2,
      name: "6 Months",
      duration: "6 Months",
      price: 28000,
      originalPrice: 36000,
      discount: "22% OFF",
      features: [
        "Unlimited Spa Sessions",
        "Priority Booking",
        "15% Discount on Additional Services",
        "Free Consultation",
        "Wellness Tips & Guidance",
        "2 Free Couple Sessions",
        "Monthly Health Check-up"
      ],
      popular: true
    },
    {
      id: 3,
      name: "1 Year",
      duration: "1 Year",
      price: 50000,
      originalPrice: 72000,
      discount: "31% OFF",
      features: [
        "Unlimited Spa Sessions",
        "Priority Booking",
        "20% Discount on Additional Services",
        "Free Consultation",
        "Wellness Tips & Guidance",
        "5 Free Couple Sessions",
        "Monthly Health Check-up",
        "Free Home Service (4 times)",
        "Exclusive Member Events"
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBookMembership = () => {
    if (selectedPlan) {
      // Store membership booking
      const membership = {
        id: Date.now(),
        plan: selectedPlan.name,
        duration: selectedPlan.duration,
        price: selectedPlan.price,
        customerName: "",
        phone: "",
        email: "",
        status: "pending",
        createdAt: new Date().toISOString()
      };

      const existingMemberships = JSON.parse(localStorage.getItem("memberships") || "[]");
      const updatedMemberships = [...existingMemberships, membership];
      localStorage.setItem("memberships", JSON.stringify(updatedMemberships));

      // Navigate to booking page with membership info
      navigate("/book", { state: { membership: selectedPlan } });
    }
  };

  return (
    <div className="membership-page no-scrollbar">
      <div className="membership-header">
        <h1>Membership Plans</h1>
        <p className="membership-subtitle">Choose the perfect plan for your wellness journey</p>
      </div>

      <div className="membership-plans">
        {membershipPlans.map((plan) => (
          <div
            key={plan.id}
            className={`membership-card ${plan.popular ? "popular" : ""} ${selectedPlan?.id === plan.id ? "selected" : ""
              }`}
            onClick={() => handleSelectPlan(plan)}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h2>{plan.name}</h2>
            <div className="price-section">
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">{plan.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="original-price">
                <span className="strike">₹{plan.originalPrice.toLocaleString('en-IN')}</span>
                <span className="discount">{plan.discount}</span>
              </div>
            </div>
            <div className="duration">{plan.duration} Membership</div>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`select-btn ${selectedPlan?.id === plan.id ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectPlan(plan);
              }}
            >
              {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="membership-cta">
          <div className="selected-plan-info">
            <h3>Selected Plan: {selectedPlan.name}</h3>
            <p>Total Amount: ₹{selectedPlan.price.toLocaleString('en-IN')}</p>
          </div>
          <button className="book-membership-btn" onClick={handleBookMembership}>
            Book Membership Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Membership;

