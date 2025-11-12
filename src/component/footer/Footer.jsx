import React from "react";
import "./Footer.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ContentWrapper from "../contentWrapper/contentWrapper";
import Logo from "../../assets/movix-logo.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <ContentWrapper>
        <div className="footer-grid">
          {/* Brand */}
          <div className="brand">
            <img src={Logo} alt="MovieSite" className="logo" />
            <p className="tagline">
              Discover and track your favorite movies and shows.
            </p>
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

          {/* Explore */}
          <div className="links">
            <h4>Explore</h4>
            <ul>
              <li>
                <a href="#movies">Movies</a>
              </li>
              <li>
                <a href="#tv-shows">TV Shows</a>
              </li>
              <li>
                <a href="#latest">Latest</a>
              </li>
              <li>
                <a href="#top-rated">Top Rated</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="links">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <a href="#terms">Terms</a>
              </li>
              <li>
                <a href="#privacy">Privacy</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="newsletter">
            <h4>Newsletter</h4>
            <form onSubmit={(e) => e.preventDefault()} className="subscribe">
              <input type="email" placeholder="Your email" aria-label="Email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} MovieSite. All rights reserved.
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
