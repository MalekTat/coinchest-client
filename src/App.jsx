import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import AlertsPage from './pages/AlertsPage';
import ProfileEditPage from './pages/ProfileEditPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

const App = () => {
  const location = useLocation();
  const noFooterPaths = ['/login','/signup','/portfolio', '/alerts', '/profile', '/dashboard','/services','/contact'];

  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
      </Routes>
      {!noFooterPaths.includes(location.pathname) && <Footer />}
    </AuthProvider>
  );
};

export default App;