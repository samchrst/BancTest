import React, { useState } from 'react';
import axios from 'axios';

const Scan = () => {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // Fonction pour récupérer les résultats du scan
  const handleScan = async () => {
    setScanning(true);
    setError('');
    console.log('Scan commencé...');

    try {
      console.log('Envoi de la requête de scan à l\'API...');
      
      // Appel de l'API pour obtenir les résultats du scan
      const response = await axios.post('http://localhost:3000/api/scan');
      console.log('Réponse reçue de l\'API:', response.data);
      
      if (response.data.sockets && response.data.sockets.length > 0) {
        setResults(response.data.sockets); // Récupère les adresses IP des appareils trouvés
        console.log('Appareils trouvés:', response.data.sockets);
      } else {
        console.log('Aucun appareil trouvé dans la réponse');
      }
    } catch (err) {
      console.error('Erreur lors de l\'appel API:', err);
      setError('Erreur lors du scan du réseau');
    } finally {
      setScanning(false);
      console.log('Scan terminé');
    }
  };

  return (
    <div className="scan-container">
      <button onClick={handleScan} className="scan-button" disabled={scanning}>
        {scanning ? 'Scan en cours...' : 'Démarrer le Scan'}
      </button>
      
      {error && <p className="error-message">{error}</p>}
      
      {results.length > 0 ? (
        <div className="racks-container">
          {results.map((result, index) => (
            <div key={index} className="rack-container">
              <h3 className="rack-title">Hôte: {result}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun appareil trouvé.</p>
      )}
    </div>
  );
};

export default Scan;
