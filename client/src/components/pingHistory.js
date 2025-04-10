import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PingHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  // Charger l'historique depuis le localStorage à l'aide de useEffect
  useEffect(() => {
    // Récupérer l'historique enregistré sous la clé 'pingHistory' dans le localStorage
    const storedHistory = JSON.parse(localStorage.getItem('pingHistory')) || [];

    // Inverser l'ordre des éléments pour afficher les plus récents en premier
    setHistoryData(storedHistory.reverse());
  }, []);

  const handleRowClick = (serialNumber) => {
    // Naviguer vers la page de détail du scan basé sur le numéro de série
    navigate(`/rapport/${serialNumber}`);
  };

  return (
    <div>
      {/* Affichage de l'historique avec des boutons pour chaque entrée */}
      {historyData.length > 0 ? (
        historyData.map((item) => (
          <button
            key={item.serialNumber}
            onClick={() => handleRowClick(item.serialNumber)}
            style={{
              display: 'block',
              margin: '10px',
              padding: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            {item.serialNumber} - {item.date}
          </button>
        ))
      ) : (
        <p>Aucune donnée disponible</p> // Message affiché si l'historique est vide
      )}
    </div>
  );
};

export default PingHistory;
