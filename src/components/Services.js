import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";
import service1 from "../assets/img1.jpg";
import service2 from "../assets/img2.jpg";
import service3 from "../assets/img3.jpg";

function Services() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 to show some context
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load services from localStorage or use defaults
    const storedServices = JSON.parse(localStorage.getItem("services") || "[]");
    if (storedServices.length > 0) {
      setServices(storedServices);
      setCurrentIndex(Math.floor(storedServices.length / 2));
    } else {
      // Default services
      const defaultServices = [
        {
          id: 1,
          img: service1,
          title: "Signature Massage",
          description: "A full-body massage that restores balance and relieves tension.",
          duration: "60 minutes",
          price: "₹2,500"
        },
        {
          id: 2,
          img: service2,
          title: "Rejuvenating Facial",
          description: "Deep cleansing and hydrating facial treatment that revitalizes your skin.",
          duration: "45 minutes",
          price: "₹1,800"
        },
        {
          id: 3,
          img: service3,
          title: "Hot Stone Therapy",
          description: "Stress melting heated stone therapy that promotes deep relaxation.",
          duration: "90 minutes",
          price: "₹3,500"
        },
        {
          id: 4,
          img: service1,
          title: "Aromatherapy Session",
          description: "Therapeutic essential oils combined with gentle massage techniques.",
          duration: "60 minutes",
          price: "₹2,200"
        },
        {
          id: 5,
          img: service2,
          title: "Couple Spa Package",
          description: "Perfect romantic escape for couples. Enjoy side-by-side treatments.",
          duration: "120 minutes",
          price: "₹5,500"
        },
        {
          id: 6,
          img: service3,
          title: "Thai Traditional Massage",
          description: "Authentic Thai massage combining acupressure and stretching.",
          duration: "75 minutes",
          price: "₹2,800"
        },
      ];
      setServices(defaultServices);
      setCurrentIndex(Math.floor(defaultServices.length / 2));
    }
  }, []);

  const handleBookNow = () => {
    navigate("/book");
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const getCardStyle = (index) => {
    const total = services.length;
    // Calculate distance from current index, handling wrap-around
    let diff = (index - currentIndex + total) % total;
    if (diff > total / 2) diff -= total;

    const absDiff = Math.abs(diff);

    // Config values
    const xOffset = 220; // Horizontal spacing
    const zOffset = -200; // Depth spacing
    const scaleStep = 0.2; // Scale reduction per step
    const rotateAngle = 45; // Rotation angle

    // Only show 5 items (center + 2 on each side)
    const isVisible = absDiff <= 2;

    if (!isVisible) return { display: 'none' };

    const translateX = diff * xOffset;
    const translateZ = Math.abs(diff) * zOffset;
    const rotateY = diff === 0 ? 0 : diff > 0 ? -rotateAngle : rotateAngle;
    const scale = 1 - (absDiff * scaleStep);
    const zIndex = 10 - absDiff;
    const opacity = 1 - (absDiff * 0.3);

    return {
      transform: `translateX(-50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex: zIndex,
      opacity: opacity,
      filter: absDiff > 0 ? `blur(${absDiff * 2}px)` : 'none',
      pointerEvents: diff === 0 ? 'auto' : 'none' // Only center card is clickable
    };
  };

  return (
    <section className="services-section" id="services">
      <h2>Our Signature Services</h2>
      <p className="sub">Indulge in our carefully curated treatments</p>

      <div className="services-slider-container">
        <button className="slider-btn prev-btn" onClick={prevSlide}>
          &#8249;
        </button>

        <div className="services-slider">
          <div className="services-slider-track">
            {services.map((service, index) => (
              <div
                key={service.id || index}
                className={`service-card ${index === currentIndex ? 'active' : ''}`}
                style={getCardStyle(index)}
                onClick={() => {
                  if (index !== currentIndex) setCurrentIndex(index);
                }}
              >
                <div className="service-image-wrapper">
                  <img src={service.image || service.img} alt={service.title} />
                </div>
                <div className="info">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className="service-details">
                    <span className="duration">⏱ {service.duration}</span>
                    <span className="price">{service.price}</span>
                  </div>
                  <div className="action-buttons">
                    <button className="book-btn" onClick={handleBookNow}>Book Now</button>
                    <a
                      href={`https://wa.me/+917487095947?text=I'm interested in ${service.title}`}
                      className="whatsapp-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="slider-btn next-btn" onClick={nextSlide}>
          &#8250;
        </button>
      </div>

      <div className="slider-controls">
        <div className="slider-dots">
          {services.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
