import React, { useState } from 'react';

const TestSeringue = ({ socketId }) => {
  const [seringueStatus, setSeringueStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [handshake, setHandshake] = useState(0); // 💡 compteur handshake
  console.log("socketId reçu en prop :", socketId);

  const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout client atteint')), timeout)
      ),
    ]);
  };

  const turnOnSeringue = async () => {
    if (loading) return; 
    setLoading(true);

    try {
      const currentHandshake = handshake;
      setHandshake((prev) => (prev + 1) % 256); // 🔄 on incrémente sur 1 byte max (0-255)

      const response = await fetchWithTimeout('http://localhost:3000/api/turnOn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socketId,
          handshake: currentHandshake,
        }),
      });

      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      console.log('✅ Allumage réussi :', data);
    } catch (err) {
      console.error('❌ Erreur allumage :', err);
      setErreur('Impossible d\'activer la seringue.');
    } finally {
      setLoading(false);
    }
  };

  const turnOffSeringue = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const currentHandshake = handshake;
      setHandshake((prev) => (prev + 1) % 256);

      const response = await fetchWithTimeout('http://localhost:3000/api/turnOff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socketId,
          handshake: currentHandshake,
        }),
      });

      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      console.log('✅ Extinction réussie :', data);
    } catch (err) {
      console.error('❌ Erreur extinction :', err);
      setErreur('Impossible de désactiver la seringue.');
    } finally {
      setLoading(false);
    }
  };

  const testAllSeringues = async () => {
    if (loading) return;
  
    setLoading(true);
    setErreur('');
    setSeringueStatus([]);
  
    try {
      const currentHandshake = handshake;
      setHandshake((prev) => (prev + 1) % 256);
  
      console.log("socketId avant l'envoi : ", socketId);
  
      const response = await fetchWithTimeout('http://localhost:3000/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socketId,
          handshake: currentHandshake,
        }),
      });
  
      console.log("Envoi : ", { socketId, handshake: currentHandshake });
  
      if (!response.ok) throw new Error('Erreur serveur');
  
      const data = await response.json();
      console.log('🔍 Check seringues :', data);
  
      if (!data.parsed) throw new Error('Pas de données reçues');
  
      const formatted = {
        id: data.parsed.canAddress,
        connected: data.parsed.serialNumber !== '000000000000', // Condition ajoutée ici
        serialNumber: data.parsed.serialNumber,
      };
  
      setSeringueStatus([formatted]);
  
    } catch (err) {
      console.error('❌ Erreur check :', err);
      setErreur('Impossible de vérifier les seringues.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h3>Test des seringues de la socket</h3>

      <div className="btn-group-vertical mb-4">
        <button
          className="btn btn-success mb-3"
          onClick={() => turnOnSeringue(1)}
          disabled={loading}
        >
          {loading ? 'Test en cours...' : 'Allumer la seringue 1'}
        </button>

        <button
          className="btn btn-danger mb-3"
          onClick={() => turnOffSeringue(1)}
          disabled={loading}
        >
          {loading ? 'Test en cours...' : 'Éteindre la seringue 1'}
        </button>

        <button
          className="btn btn-success mb-3"
          onClick={testAllSeringues}
          disabled={loading}
        >
          {loading ? 'Test en cours...' : 'Tester toutes les seringues'}
        </button>
      </div>

      {erreur && <p className="text-danger">{erreur}</p>}

      {seringueStatus.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Connectée</th>
                <th>Numéro de série</th>
              </tr>
            </thead>
            <tbody>
              {seringueStatus.map((seringue) => (
                <tr key={seringue.id}> 
                  <td>Seringue {seringue.id}</td>
                  <td>{seringue.connected ? '🟢 Connectée' : '🔴 Déconnectée'}</td>
                  <td>{seringue.serialNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestSeringue;
