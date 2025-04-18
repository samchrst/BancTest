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
import PingHistory from './components/pingHistory';
import Rapport from './components/Rapport';
import TestSeringues from './components/TestSeringue';

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
          <Route path="/seringues" element={<TestSeringues socketId={0xFF}/>} /> 
          <Route path="/historique" element={<Historique />} /> 
          <Route path="/pingHistory" element={<PingHistory />} /> 
          <Route path="/rapport/:serialNumber" element={<Rapport />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
