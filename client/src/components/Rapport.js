import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Rapport = () => {
  const { serialNumber } = useParams();
  const [reportData, setReportData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Charger l'historique depuis le localStorage
    const history = JSON.parse(localStorage.getItem('pingHistory')) || [];
    const user = JSON.parse(localStorage.getItem('userInfo'));
    // Trouver l'entrée correspondant au serialNumber
    const entry = history.find(item => item.serialNumber === serialNumber);
    setReportData(entry); // Récupère les données du ping correspondant
    setUserData(user); // Récupère les données de l'utilisateur connecté
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
      <p><strong>Scan effectué par :</strong> {userData.nom}</p>

      <h3 className="mt-4">Résultats :</h3>

      {/* Parcours des racks */}
      {reportData.results.map((rack, index) => (
        <div key={index} className="mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Socket : {rack.host}</h5>
              <p><strong>Status :</strong> {rack.alive ? '🟢 Alive' : '🔴 Dead'}</p>
              <p><strong>Time :</strong> {rack.time} ms</p>
              <p><strong>Output :</strong> {rack.output}</p>

              {/* Seringues de cette socket */}
              <div className="mt-3">
                <h6 className="mb-3">Seringues :</h6>
                <div className="row">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((port, slotIndex) => {
                    const seringue = rack.seringues ? rack.seringues[slotIndex] : null;
                    return (
                      <div key={slotIndex} className="col-6 col-md-3 mb-2">
                        <div className="card text-center">
                          <div className="card-body">
                            <p className="card-text">
                              P{port} = {seringue ? (seringue.status === 'Non connectée' ? '-' : `S${slotIndex + 1} (Connectée)`) : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rapport;
