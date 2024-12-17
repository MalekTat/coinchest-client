import React from 'react';
import '../styles/ServicesPage.css';

const ServicesPage = () => {
  const services = [
    { title: "Real-Time Data", description: "Get accurate and up-to-date cryptocurrency prices." },
    { title: "Portfolio Management", description: "Track your investments with ease." },
    { title: "Custom Alerts", description: "Receive notifications for price changes." },
  ];

  return (
    <div className="services-page">
      <h1>Our Services</h1>
      <div className="services-list">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
