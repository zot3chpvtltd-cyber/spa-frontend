import "./Testimonials.css";

function Testimonials() {
  return (
    <section className="testimonials-section" id="reviews">
      <h2>What Our Clients Say</h2>
      <p className="sub">Discover why thousands trust us</p>

      <div className="review-card">
        <div className="stars">★★★★★</div>

        <p className="text">
          "The Stone Edge Spa is my sanctuary. Their signature massage transformed my stress levels!"
        </p>

        <div className="user">
          <img src="/client.png" />
          <div>
            <h4>Sarah Johnson</h4>
            <p>Marketing Executive</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
