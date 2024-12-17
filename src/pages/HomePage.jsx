import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'
import '../styles/HomePage.css';

import heroImage from '../assets/hero.png';
import realtimeImage from '../assets/realtime.png';
import portfolioImage from '../assets/portfolio.png';
import alertsImage from '../assets/alerts.png';


const HomePage = () => {


  useEffect(() => {
    AOS.init({
      duration: 2500, // Animation duration (in milliseconds)
      easing: 'ease-in-out', // Easing for animations
      once: true, // Whether animation should happen only once
      offset: 100, // Distance to trigger animation
    });

    return () => {
      // Cleanup AOS when the component is unmounted
      AOS.refreshHard();
    };
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content" data-aos="fade-right">
          <h1>Welcome to Coin Chest</h1>
          <p>
            Track cryptocurrency prices, manage your portfolio, and stay ahead of market trends—all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="hero-btn primary-btn">Get Started</Link>
            <Link to="/services" className="hero-btn secondary-btn">Learn More</Link>
          </div>
        </div>
        <img src={heroImage} alt="Crypto Dashboard Interaction" className="hero-image" data-aos="fade-left" />
      </section>

      {/* Features Section */}
      <section className="features" data-aos="fade-up">
        <h2>Why Choose Crypto Dashboard?</h2>
        <div className="features-content">
          <div className="feature-item cartoon-card" data-aos="fade-right">
            <img src={realtimeImage} alt="Real-Time Data" className="feature-image" />
            <h3>Real-Time Data</h3>
            <p>Access the latest cryptocurrency prices and market trends at your fingertips.</p>
          </div>
          <div className="feature-item cartoon-card" data-aos="fade-left">
            <img src={portfolioImage} alt="Portfolio Management" className="feature-image" />
            <h3>Portfolio Manage</h3>
            <p>Track your investments and monitor your performance effortlessly.</p>
          </div>
          <div className="feature-item cartoon-card" data-aos="fade-right">
            <img src={alertsImage} alt="Custom Alerts" className="feature-image" />
            <h3>Custom Alerts</h3>
            <p>Stay informed with price alerts designed to keep you ahead.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta" data-aos="fade-up">
        <h2>Ready to Dive In?</h2>
        <p>Sign up today and start managing your cryptocurrency portfolio like a pro!</p>
        <Link to="/signup" className="cta-btn" data-aos="zoom-in">Sign Up Now</Link>
      </section>
    </div>
  );
};

export default HomePage;