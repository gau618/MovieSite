import React from "react";
import "./Footer.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Section */}
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#about-us">About Us</a>
            </li>
            <li>
              <a href="#services">Our Services</a>
            </li>
            <li>
              <a href="#privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="#affiliate">Affiliate Program</a>
            </li>
          </ul>
        </div>

        {/* Get Help Section */}
        <div className="footer-column">
          <h4>Get Help</h4>
          <ul>
            <li>
              <a href="#faq">FAQ</a>
            </li>
            <li>
              <a href="#shipping">Shipping</a>
            </li>
            <li>
              <a href="#returns">Returns</a>
            </li>
            <li>
              <a href="#order-status">Order Status</a>
            </li>
            <li>
              <a href="#payment">Payment Options</a>
            </li>
          </ul>
        </div>

        {/* Online Shop Section */}
        <div className="footer-column">
          <h4>Online Shop</h4>
          <ul>
            <li>
              <a href="#movies">Movies</a>
            </li>
            <li>
              <a href="#tv-shows">TV Shows</a>
            </li>
            <li>
              <a href="#latest-releases">Latest Releases</a>
            </li>
            <li>
              <a href="#top-rated">Top Rated</a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
