import React, { useState } from 'react';
import axios from 'axios';

function Scan() {
  const [scanStatus, setScanStatus] = useState('Scan terminé');
  const [devices, setDevices] = useState([]);
  
  const startScan = async () => {
    setScanStatus('Scan commencé...');
    try {
      console.log('Envoi de la requête de scan à l\'API...');
      const response = await axios.post('http://localhost:3000/api/scan');
      console.log('Réponse reçue de l\'API:', response.data);

      if (response.data.devices && response.data.devices.length > 0) {
        console.log('Contenu de response.data.devices:', response.data.devices);

        setDevices(response.data.devices);
        setScanStatus('Scan terminé');
      } else {
        setDevices([]);
        setScanStatus('Aucun appareil trouvé.');
      }
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      setScanStatus('Erreur lors du scan');
    }
  };

  return (
    <div>
      <h1>Scan des appareils</h1>
      <button onClick={startScan}>Lancer le scan</button>
      <p>{scanStatus}</p>
      {devices.length > 0 && (
        <ul>
          {devices.map((device, index) => (
            <li key={index}>{device}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Scan;
