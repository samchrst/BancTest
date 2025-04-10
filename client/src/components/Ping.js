import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Ping = () => {
  const [racks, setRacks] = useState([]);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les racks avec leurs sockets
  const handleScan = async () => {
    console.log("🔍 Début du scan...");

    try {
      // boucle pour définir les adresses IP à scanner
      const hosts = [];
      for (let i = 20; i <= 22; i++) {
        hosts.push(`192.168.27.${i}`);
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
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="mb-3">🖥️ Scan des Racks</h1>
        <button
          onClick={handleScan}
          className="btn btn-success btn-lg"
        >
          Lancer le Ping
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>

      {racks && Array.isArray(racks) && racks.length > 0 ? (
        <div className="row">
          {racks.map((rack, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Host: {rack.host}</h5>
                  <p className="card-text">
                    <strong>Status:</strong> {rack.alive ? '🟢 Alive' : '🔴 Dead'}
                  </p>
                  <p className="card-text">
                    <strong>Time:</strong> {rack.time} ms
                  </p>
                  <p className="card-text">
                    <strong>Output:</strong> {rack.output}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info mt-3">Aucun rack trouvé ou une erreur est survenue.</div>
      )}
    </div>
  );
};

export default Ping;
