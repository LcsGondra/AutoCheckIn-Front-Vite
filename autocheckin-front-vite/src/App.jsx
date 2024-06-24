import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registration from './components/Registration';
import Questionnaire from './components/Questionnaire';
import { useLocation } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
        </Routes>
      </div>
    </Router>
  );
}

function LandingPage() {
  const location = useLocation();
  const checkIn = location.state;

  return (
    <div>
      <h1>Bem vindo ao AutoCheckIn</h1>
      <div className="button-container">
        <Link to="/register">
          <button>Iniciar CheckIn</button>
        </Link>
      </div>
      {checkIn && (
        <div>
          <h2>Informacoes de Check-In</h2>
          <p><strong>Prioridade:</strong> {checkIn.prioridade}</p>
          <p><strong>Tipo de Emergência:</strong> {checkIn.tipoEmergencia}</p>
        </div>
      )}
    </div>
  );
}

export default App;
