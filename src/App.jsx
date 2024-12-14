import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import {AuthProvider} from './context/AuthContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/HomePage';
import Signup from './pages/SignupPage';
import Login from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import Portfolio from './pages/PortfolioPage';
import Alerts from './pages/AlertsPage';
import ProfileEdit from './pages/ProfileEditPage';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
