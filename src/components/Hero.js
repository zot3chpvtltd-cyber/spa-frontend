import { useNavigate } from "react-router-dom";
import "./Hero.css";
import heroImg from "../assets/Homeimg.jpg"; // correct image path

function Hero() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/book");
  };

  const handleExploreServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <h1>
          Escape to <span>Pure</span> <br /> Tranquility
        </h1>

        <p>
          Discover ultimate relaxation and rejuvenation at The Stone Edge Spa.
          Our expert therapists and luxurious treatments will transport you
          to a world of peace and wellness.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={handleBookNow}>Book Your Experience</button>
          <button className="secondary-btn" onClick={handleExploreServices}>Explore Services</button>
        </div>
      </div>

      <div className="hero-right">
        <img src={heroImg} alt="spa-room" />
      </div>
    </section>
  );
}

export default Hero;
