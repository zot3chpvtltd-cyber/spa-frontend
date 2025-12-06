import React from 'react';
import './Footer.css';
import zot3chLogo from '../assets/zot3ch_logo_transparent.png';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>The Stone Edge Spa</h3>
                    <p>Experience the ancient healing art of Thai massage in a serene environment.</p>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Phone: +91 7487 095 947</p>
                    <p>Email: thestoneedgespapvtltd@gmail.com</p>
                </div>
                <div className="footer-section">
                    <h3>Opening Hours</h3>
                    <p>Mon - Sun: 10:00 AM - 9:00 PM</p>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-logo">
                    <img src={zot3chLogo} alt="ZOT3CH Logo" />
                </div>
                <div className="copyright">
                    <p>&copy; {new Date().getFullYear()} The Stone Edge Spa. All rights reserved to ZOT3CH.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
