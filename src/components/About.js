import "./About.css";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import Homeimg from "../assets/Homeimg.jpg";

function About() {
  return (
    <section className="about-section" id="about">
      <div className="left">
        <h2>Your Journey to Wellness Begins Here</h2>

        <p>
          At The Stone Edge Spa, we believe true beauty and wellness start from within.
        </p>

        <p>
          Since 2015, our expert therapists deliver healing therapies mixed with modern science.
        </p>

        <div className="grid">
          <span>🏆 Award Winning Service</span>
          <span>👩‍⚕️ Expert Therapists</span>
          <span>🌿 Natural Products</span>
          <span>🛡 Safe & Clean</span>
        </div>
      </div>

      <div className="right">
        <img src={img1} alt="spa" />
        <img src={img2} alt="spa" />
        <img src={img3} alt="spa" />
        <img src={Homeimg} alt="spa" />
      </div>
    </section>
  );
}

export default About;
