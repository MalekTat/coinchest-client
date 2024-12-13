import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
//import Dashboard from './pages/Dashboard';
//import Portfolio from './pages/Portfolio';
//import Alerts from './pages/Alerts';


const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="/" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/alerts" element={<Alerts />} />*/}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
