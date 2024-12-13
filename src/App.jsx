import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/HomePage';
import Signup from './pages/SignupPage';
import Login from './pages/LoginPage';


//import Dashboard from './pages/Dashboard';
//import Portfolio from './pages/Portfolio';
//import Alerts from './pages/Alerts';


const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/*<Route path="/" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/alerts" element={<Alerts />} />*/}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
