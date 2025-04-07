import React, { useState } from 'react';
import axios from 'axios';

const Ping = () => {
  const [racks, setRacks] = useState([]);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les racks avec leurs sockets
  const handleScan = async () => {
    console.log("🔍 Début du scan...");

    try {
    // Générer les adresses IP de 192.168.3.101 à 192.168.3.126
    const hosts = [];
    for (let i = 127; i <= 163; i++) {
      hosts.push(`192.168.2.${i}`);
    }

// Afficher les adresses générées
      console.log("Envoi des hôtes à scanner:", hosts);

      const response = await axios.post('http://localhost:3000/api/ping', { hosts });

      console.log("Réponse reçue du serveur:", response.data);

      setRacks(response.data.results);
      setError(null);
      console.log("📦 Racks mis à jour dans le state:", response.data.results);
    } catch (error) {
      console.error('Erreur lors du scan des racks:', error);
      setError('Erreur lors du scan des racks');
    }
  };

  return (
    <div className="scan-container">
      <button onClick={handleScan} className="scan-button">Ping</button>

      {error && <p className="error-message">{error}</p>}

      {racks && Array.isArray(racks) && racks.length > 0 ? (
        <div className="racks-container">
          {racks.map((rack, index) => {
            console.log(`Affichage du rack #${index}:`, rack);
            return (
              <div key={index} className="rack-container">
                <h3 className="rack-title">Host: {rack.host}</h3>
                <p className="rack-info">Alive: {rack.alive ? 'Yes' : 'No'}</p>
                <p className="rack-info">Time: {rack.time} ms</p>
                <p className="rack-info">Output: {rack.output}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Aucun rack trouvé ou une erreur est survenue.</p>
      )}
    </div>
  );
};

export default Ping;
