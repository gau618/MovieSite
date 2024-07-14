import React from 'react';
import "./Footer.scss";
import { FaFacebook } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>
      <ul className="social-icon">
        <li className="social-icon__item">
          <a className="social-icon__link" href="#">
            <FaFacebook/>
          </a>
        </li>
        <li className="social-icon__item">
          <a className="social-icon__link" href="#">
            < FaTwitterSquare/>
          </a>
        </li>
        <li className="social-icon__item">
          <a className="social-icon__link" href="#">
           <FaLinkedin/>
          </a>
        </li>
        <li className="social-icon__item">
          <a className="social-icon__link" href="#">
          <RiInstagramFill/>
          </a>
        </li>
      </ul>
      <ul className="menu">
        <li className="menu__item"><a className="menu__link" href="#">Home</a></li>
        <li className="menu__item"><a className="menu__link" href="#">About</a></li>
        <li className="menu__item"><a className="menu__link" href="#">Services</a></li>
        <li className="menu__item"><a className="menu__link" href="#">Team</a></li>
        <li className="menu__item"><a className="menu__link" href="#">Contact</a></li>
      </ul>
     <center class="footerpara"> &copy;2024 Gaurav kannaujiya | All Rights Reserved</center>
    </footer>
  );
};

export default Footer;
