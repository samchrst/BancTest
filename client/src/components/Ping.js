import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Ping = () => {
  const [racks, setRacks] = useState([]);
  const [error, setError] = useState(null);
  const [startIp, setStartIp] = useState('');
  const [endIp, setEndIp] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [seringueStatus, setSeringueStatus] = useState([]);  // Nouveau state pour stocker le statut des seringues
  const [loading, setLoading] = useState(false);  // Nouveau state pour gérer le chargement des seringues
  const [erreur, setErreur] = useState('');  // Nouveau state pour gérer les erreurs de vérification des seringues
  const [handshake, setHandshake] = useState(0);  // Nouveau state pour le handshake

  const handleScan = async () => {
    setIsLoading(true);  
    setScanCompleted(false); 
    setRacks([]);
  
    try {
      if (!serialNumber.trim()) {
        setError("Veuillez entrer un numéro de série unique.");
        setIsLoading(false);
        setScanCompleted(true);
        return;
      }
  
      if (!startIp || !endIp) {
        setError('Veuillez saisir la plage d\'adresses IP');
        setIsLoading(false);
        setScanCompleted(true);
        return;
      }
  
      const startOctet = parseInt(startIp.split('.').pop());
      const endOctet = parseInt(endIp.split('.').pop());
  
      if (isNaN(startOctet) || isNaN(endOctet) || startOctet > endOctet) {
        setError('Plage d\'adresses invalide');
        setIsLoading(false);
        setScanCompleted(true);
        return;
      }
  
      const hosts = [];
      const baseIp = startIp.substring(0, startIp.lastIndexOf('.') + 1);
      
      for (let i = startOctet; i <= endOctet; i++) {
        hosts.push(`${baseIp}${i}`);
      }
  
      const response = await axios.post('http://localhost:3000/api/ping', { hosts });
  
      setRacks(response.data.results);
      setError(null);
  
      // Stocker avec le numéro de série comme un attribut dans l'objet
      const history = JSON.parse(localStorage.getItem('pingHistory')) || [];
      const newEntry = {
        serialNumber,
        date: new Date().toLocaleString(),
        range: `${startIp} - ${endIp}`,
        results: response.data.results,
      };
  
      history.push(newEntry);  // Ajoute l'objet au tableau sans utiliser le numéro de série comme clé
      localStorage.setItem('pingHistory', JSON.stringify(history));
  
      // Enregistrer les résultats des seringues
      const seringuesHistory = response.data.results.map(rack => {
        return {
          host: rack.host,
          seringues: Array.from({ length: 8 }).map((_, slotIndex) => {
            return rack.seringues && rack.seringues[slotIndex] ? {
              slot: slotIndex + 1,
              connector: rack.seringues[slotIndex].connector,
              status: 'Connectée'
            } : {
              slot: slotIndex + 1,
              status: 'Non connectée'
            };
          }),
        };
      });
  
      localStorage.setItem('seringuesHistory', JSON.stringify(seringuesHistory));
  
    } catch (error) {
      console.error('Erreur lors du scan des racks:', error);
      setError('Erreur lors du scan des racks');
    } finally {
      setIsLoading(false); 
      setScanCompleted(true); 
    }
  };

  const testAllSeringues = async () => {
    if (loading) return;
  
    setLoading(true);
    setErreur('');
    setSeringueStatus([]);  // Réinitialise les données à chaque test
  
    try {
      const currentHandshake = handshake;
      setHandshake((prev) => (prev + 1) % 256);
  
      const response = await fetch('http://localhost:3000/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handshake: currentHandshake,
        }),
      });
  
      console.log("Envoi : ", { handshake: currentHandshake });
  
      if (!response.ok) throw new Error('Erreur serveur');
  
      const data = await response.json();
      console.log('🔍 Check seringues :', data);
  
      if (!data.parsed) throw new Error('Pas de données reçues');
  
      const formatted = {
        id: data.parsed.canAddress,
        connected: data.parsed.serialNumber !== '000000000000', // Condition ajoutée ici
        serialNumber: data.parsed.serialNumber,
      };
  
      // Pousse l'objet dans un tableau
      setSeringueStatus(prevStatus => [...prevStatus, formatted]);
  
    } catch (err) {
      console.error('❌ Erreur check :', err);
      setErreur('Impossible de vérifier les seringues.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="mb-3">🖥️ Scan des Racks</h1>
  
        <div className="form-group">
          <label htmlFor="serialNumber">Numéro de série</label>
          <input
            type="text"
            id="serialNumber"
            className="form-control"
            placeholder="S/N-001"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </div>
  
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
  
        <button onClick={handleScan} className="btn btn-success btn-lg mt-3">
          Lancer le Ping
        </button>
  
        <button onClick={testAllSeringues} className="btn btn-info btn-lg mt-3 ml-2">
          Vérifier les Seringues
        </button>
  
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {erreur && <div className="alert alert-danger mt-3">{erreur}</div>}
      </div>
  
      {isLoading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
          <p>Scan en cours...</p>
        </div>
      )}
  
      {scanCompleted && racks.length === 0 && (
        <div className="alert alert-info mt-3">Aucun rack trouvé ou une erreur est survenue.</div>
      )}
  
      {racks.length > 0 && (
        <div className="row">
          {racks.map((rack, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Host: {rack.host}</h5>
                  <p><strong>Status:</strong> {rack.alive ? '🟢 Alive' : '🔴 Dead'}</p>
                  <p><strong>Time:</strong> {rack.time} ms</p>
                  <p><strong>Output:</strong> {rack.output}</p>
  
                  {/* Affichage des slots pour les seringues */}
                  <div className="mt-3">
                    <h6>Seringues connectées :</h6>
                    {Array.from({ length: 8 }).map((_, slotIndex) => {
                      const seringue = seringueStatus[slotIndex]; // Trouver la seringue à cet index
                      
                      return (
                        <div key={slotIndex} className="d-flex justify-content-between">
                          <p>Seringue {slotIndex + 1}</p>
                          <p>
                            {seringue ? (
                              // Si la seringue existe, afficher le numéro de série
                              `Connectée (S/N: ${seringue.serialNumber})`
                            ) : (
                              // Sinon, afficher "Non connectée"
                              '🔴 Non connectée'
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* Affichage des résultats de la vérification des seringues */}
      {seringueStatus.length > 0 && (
        <div className="mt-4">
          <h4>Status des seringues :</h4>
          <div className="alert alert-info">
            <p><strong>Seringue ID:</strong> {seringueStatus[0].id}</p>
            <p><strong>Connectée:</strong> {seringueStatus[0].connected ? 'Oui' : 'Non'}</p>
            <p><strong>Numéro de série:</strong> {seringueStatus[0].serialNumber}</p>
          </div>
        </div>
      )}
    </div>
  );
}  
export default Ping;
