import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Crypto Dashboard</h1>
          <p>
            The ultimate platform to track cryptocurrency prices, manage your portfolio, 
            and stay updated with market trends.
          </p>
          <div className="hero-buttons">
            <a href="/signup" className="hero-btn primary-btn">Get Started</a>
            <a href="/service" className="hero-btn secondary-btn">Learn More</a>
          </div>
        </div>
        <img
          src="/assets/crypto-hero.jpg"
          alt="Cryptocurrency Dashboard"
          className="hero-image"
        />
      </section>

      {/* Information Cards */}
      <section className="info-section">
        <div className="card animate-left">
          <h2>Real-Time Data</h2>
          <p>Stay updated with the latest cryptocurrency prices and market trends.</p>
        </div>
        <div className="card animate-right">
          <h2>Portfolio Management</h2>
          <p>Track your investments and see your profits and losses in real-time.</p>
        </div>
        <div className="card animate-left">
          <h2>Price Alerts</h2>
          <p>Set custom alerts for your favorite cryptocurrencies and never miss an opportunity.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;