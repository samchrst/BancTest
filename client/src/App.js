import React from 'react';
import './App.css';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Scan from './components/Scan';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Ping from './components/Ping';
import Historique from './components/Historique';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ping" element={<Ping />} />
          <Route path="/scan" element={<Scan />} />  
          <Route path="/historique" element={<Historique />} />       
        </Routes>
      </Router>
    </div>
  );
}

export default App;
