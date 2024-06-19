import { Link } from "react-router-dom"; // Import Link for navigation
import { Container, Typography, Box, Button } from "@mui/material";
import "./styles/Homepage.css";

const HomePage = () => {
  return (
    <Container maxWidth="md" className="home-page-container">
      <Box className="content-box">
        <Typography variant="h3" component="h1" className="heading">
          Welcome to Whoofi!
        </Typography>

        <Typography className="welcome-text" sx={{ mx: "auto" }}>
          Welcome to Whoofi, where wagging tails and happy walks meet! this
          platform is designed to connect passionate dog walkers with loving dog
          owners. Whether you're a dedicated pet parent seeking reliable care
          for your furry friend or an enthusiastic dog lover eager to embark on
          joyful adventures with canine companions, you've come to the right
          place. We will help you to find perfect match, ensuring that every
          walk is not just a stroll but an experience filled with care, trust,
          and tail-wagging delight. Join us today and let's make tails wag
          together!
        </Typography>
        <Button
          component={Link}
          to="/signup"
          variant="contained"
          color="primary"
          className="action-button"
          sx={{ mt: 2 }}
        >
          Join Us Today
        </Button>
      </Box>
    </Container>
  );
};
/*
import React from 'react';
import './styles/HomePage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1>Connecting Dog Owners with Trusted Dog Walkers</h1>
          <p>Find reliable, vetted dog walkers in your area.</p>
          <div className="cta-buttons">
            <a><Link to="/search" className="btn-primary">Look for a Dog Walker</Link></a>
            <a><Link to="/signup" className="btn-secondary">Become a Dog Walker</Link></a>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Trust and Safety</h3>
            <p>All dog walkers are thoroughly vetted for your peace of mind.</p>
          </div>
          <div className="feature">
            <h3>Convenience</h3>
            <p>Easily book a walk with just a few clicks.</p>
          </div>
          <div className="feature">
            <h3>Flexibility</h3>
            <p>Choose from one-time walks or regular schedules.</p>
          </div>
          <div className="feature">
            <h3>Insurance and Support</h3>
            <p>Comprehensive insurance and dedicated support.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>Sign Up</h3>
            <p>Create an account easily.</p>
          </div>
          <div className="step">
            <h3>Search</h3>
            <p>Find dog walkers in your area.</p>
          </div>
          <div className="step">
            <h3>Book</h3>
            <p>Schedule a walk at your convenience.</p>
          </div>
          <div className="step">
            <h3>Relax</h3>
            <p>Enjoy peace of mind knowing your dog is in good hands.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"This service is fantastic! I found a great walker for my dog."</p>
          <p>- Jane Doe</p>
        </div>
        <div className="testimonial">
          <p>"As a dog walker, I've met so many wonderful pets and owners."</p>
          <p>- John Smith</p>
        </div>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How do I sign up?</h3>
          <p>Click on the Sign Up button and fill out the form.</p>
        </div>
        <div className="faq-item">
          <h3>Is my information secure?</h3>
          <p>Yes, we use the latest security measures to protect your data.</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <div className="social-media">
          <a href="https://facebook.com">Facebook</a>
          <a href="https://twitter.com">Twitter</a>
          <a href="https://instagram.com">Instagram</a>
        </div>
      </footer>
    </div>
  );
};
*/
export default HomePage;
