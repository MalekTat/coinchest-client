import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import {AuthProvider} from './context/AuthContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import AlertsPage from './pages/AlertsPage';
import ProfileEditPage from './pages/ProfileEditPage';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
