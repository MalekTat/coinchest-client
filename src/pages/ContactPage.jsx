import React from 'react';
import '../styles/ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Send us your queries or feedback.</p>
      <form className="contact-form">
        <label>
          Name:
          <input type="text" placeholder="Your Name" required />
        </label>
        <label>
          Email:
          <input type="email" placeholder="Your Email" required />
        </label>
        <label>
          Message:
          <textarea placeholder="Your Message" required></textarea>
        </label>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;