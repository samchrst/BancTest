import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Scan() {
  const [scanStatus, setScanStatus] = useState('');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const startScan = async () => {
    setScanStatus('Scan en cours...');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/scan');
      if (response.data.devices && response.data.devices.length > 0) {
        setDevices(response.data.devices);
        setScanStatus('Scan terminé avec succès 🎉');
      } else {
        setDevices([]);
        setScanStatus('Aucun appareil trouvé 😕');
      }
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      setScanStatus('Erreur lors du scan ❌');
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="mb-3">🔍 Scan du réseau</h1>
        <button
          className="btn btn-primary"
          onClick={startScan}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Scannage...
            </>
          ) : (
            'Lancer le scan'
          )}
        </button>
        <p className="mt-3 text-muted">{scanStatus}</p>
      </div>

      {devices.length > 0 && (
        <div className="row">
          {devices.map((device, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">📡 Socket {index + 1}</h5>
                  <p className="card-text">{device}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Scan;
