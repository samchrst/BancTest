import React, { useState } from 'react';
import axios from 'axios';

const ScanButton = () => {
  const [racks, setRacks] = useState([]);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les racks avec leurs sockets
  const handleScan = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/ping', {
        hosts: ["192.168.1.1", "8.8.8.8", "example.com", "127.0.0.1"] // Passe les IPs ici si nécessaire
      });
      setRacks(response.data.results); // Utilise 'results' de la réponse pour mettre à jour racks
      setError(null); // Réinitialise les erreurs en cas de succès
    } catch (error) {
      console.error('Erreur lors du scan des racks:', error);
      setError('Erreur lors du scan des racks'); // Met à jour l'état en cas d'erreur
    }
  };

  return (
    <div className="scan-container">
      <button onClick={handleScan} className="scan-button">Scan</button>

      {error && <p className="error-message">{error}</p>}  {/* Affiche une erreur si nécessaire */}

      {racks && Array.isArray(racks) && racks.length > 0 ? (
        <div className="racks-container">
          {racks.map((rack, index) => (
            <div key={index} className="rack-container">
              <h3 className="rack-title">Host: {rack.host}</h3> {/* Affiche chaque rack */}
              <p className="rack-info">Alive: {rack.alive ? 'Yes' : 'No'}</p>
              <p className="rack-info">Time: {rack.time} ms</p>
              <p className="rack-info">Output: {rack.output}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun rack trouvé ou une erreur est survenue.</p> // Message si aucun rack ou erreur
      )}
    </div>
  );
};

export default ScanButton;
