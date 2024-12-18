import React from 'react';
import '../styles/ServicesPage.css';
import realtimeImage from '../assets/realtime.png';
import portfolioImage from '../assets/portfolio.png';
import alertsImage from '../assets/alerts.png';

const ServicesPage = () => {
  const services = [
    { title: "Real-Time Data", description: "Get accurate and up-to-date cryptocurrency prices.", image: realtimeImage },
    { title: "Portfolio Management", description: "Track your investments and monitor your performance.", image: portfolioImage },
    { title: "Custom Alerts", description: "Stay informed with price alerts to keep you ahead.", image: alertsImage },
  ];

  return (
    <div className="services-page">
      <h1>Our Services</h1>
      <div className="services-list">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <img src={service.image} alt={service.title} className="service-image" />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;