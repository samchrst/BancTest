import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Ping = () => {
  const [racks, setRacks] = useState([]);
  const [error, setError] = useState(null);
  const [startIp, setStartIp] = useState('');
  const [endIp, setEndIp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);  
  
  const handleScan = async () => {
    console.log("🔍 Début du scan...");
    
    setIsLoading(true);  
    setScanCompleted(false); 
    setRacks([]);

    try {
      // Validation des champs de saisie
      if (!startIp || !endIp) {
        setError('Veuillez saisir la plage d\'adresses IP');
        setIsLoading(false);
        setScanCompleted(true);
        return;
      }
      
      // Extraire le dernier octet des adresses de début et de fin
      const startOctet = parseInt(startIp.split('.').pop());
      const endOctet = parseInt(endIp.split('.').pop());

      if (isNaN(startOctet) || isNaN(endOctet) || startOctet > endOctet) {
        setError('Plage d\'adresses invalide');
        setIsLoading(false);
        setScanCompleted(true);
        return;
      }

      // Générer la liste des adresses IP à scanner
      const hosts = [];
      const baseIp = startIp.substring(0, startIp.lastIndexOf('.') + 1);
      
      for (let i = startOctet; i <= endOctet; i++) {
        hosts.push(`${baseIp}${i}`);
      }

      console.log("Envoi des hôtes à scanner:", hosts);

      const response = await axios.post('http://localhost:3000/api/ping', { hosts });

      console.log("Réponse reçue du serveur:", response.data);

      setRacks(response.data.results);
      setError(null);
      console.log("📦 Racks mis à jour dans le state:", response.data.results);
    } catch (error) {
      console.error('Erreur lors du scan des racks:', error);
      setError('Erreur lors du scan des racks');
    } finally {
      setIsLoading(false); 
      setScanCompleted(true); 
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="mb-3">🖥️ Scan des Racks</h1>
        
        {/* Formulaire pour saisir la plage d'adresses IP */}
        <div className="form-group">
          <label htmlFor="startIp">Adresse IP de départ</label>
          <input
            type="text"
            id="startIp"
            className="form-control"
            placeholder="192.168.27.20"
            value={startIp}
            onChange={(e) => setStartIp(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endIp">Adresse IP de fin</label>
          <input
            type="text"
            id="endIp"
            className="form-control"
            placeholder="192.168.27.22"
            value={endIp}
            onChange={(e) => setEndIp(e.target.value)}
          />
        </div>

        <button
          onClick={handleScan}
          className="btn btn-success btn-lg mt-3"
        >
          Lancer le Ping
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>

      {isLoading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
          <p>Scan en cours...</p>
        </div>
      )}

      {/* Affichage des résultats */}
      {scanCompleted && racks && Array.isArray(racks) && racks.length === 0 && (
        <div className="alert alert-info mt-3">Aucun rack trouvé ou une erreur est survenue.</div>
      )}

      {racks && Array.isArray(racks) && racks.length > 0 && (
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
      )}
    </div>
  );
};

export default Ping;
