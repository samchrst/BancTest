import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Rapport = () => {
  const { serialNumber } = useParams();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Charger l'historique depuis le localStorage
    const history = JSON.parse(localStorage.getItem('pingHistory')) || [];
    
    // Trouver l'entrée correspondant au serialNumber
    const entry = history.find(item => item.serialNumber === serialNumber);
    setReportData(entry); // Récupère les données du ping correspondant
  }, [serialNumber]);

  if (!reportData) {
    return (
      <div className="container py-5">
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1>Rapport du Ping pour {reportData.serialNumber}</h1>
      <p><strong>Date :</strong> {reportData.date}</p>
      <p><strong>Plage IP :</strong> {reportData.range}</p>

      <h3>Résultats :</h3>
      <div className="row">
        {reportData.results.map((rack, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Host: {rack.host}</h5>
                <p><strong>Status:</strong> {rack.alive ? '🟢 Alive' : '🔴 Dead'}</p>
                <p><strong>Time:</strong> {rack.time} ms</p>
                <p><strong>Output:</strong> {rack.output}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rapport;
