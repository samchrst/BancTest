import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PingHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  // Charger l'historique depuis le localStorage à l'aide de useEffect
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('pingHistory')) || [];
    // Inverser l'ordre des éléments pour afficher les plus récents en premier
    setHistoryData(storedHistory.reverse());
  }, []);

  const handleRowClick = (serialNumber) => {
    navigate(`/rapport/${serialNumber}`);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Historique des Pings</h2>
      {historyData.length > 0 ? (
        <ul className="list-group">
          {historyData.map((item) => (
            <li
              key={item.serialNumber}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => handleRowClick(item.serialNumber)}
            >
              <span>S/N : {item.serialNumber} - {item.date}</span>
              <button className="btn btn-primary btn-sm">Voir le rapport</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune donnée disponible</p>
      )}
    </div>
  );
};

export default PingHistory;
