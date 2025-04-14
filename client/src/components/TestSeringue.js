import React, { useState } from 'react';

const TestSeringue = ({ socketId }) => {
  const [seringueStatus, setSeringueStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [handshake, setHandshake] = useState(0); // 💡 compteur handshake

  const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout client atteint')), timeout)
      ),
    ]);
  };

  const turnOnSeringue = async (seringueId) => {
    if (loading) return;  // Empêche d'envoyer plusieurs requêtes en parallèle
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
      setLoading(false); // Relâche la condition de "loading" après l'opération
    }
  };

  const turnOffSeringue = async (seringueId) => {
    if (loading) return;  // Empêche d'envoyer plusieurs requêtes en parallèle
    setLoading(true);

    try {
      const currentHandshake = handshake;
      setHandshake((prev) => (prev + 1) % 256); // 🔄 idem

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
      setLoading(false); // Relâche la condition de "loading" après l'opération
    }
  };

  const testAllSeringues = async () => {
    if (loading) return;  // Si déjà en train de charger, ne pas faire une nouvelle requête

    setLoading(true);
    setErreur('');
    setSeringueStatus([]);

    try {
      const response = await fetchWithTimeout('http://localhost:3000/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seringue_socket_Id: socketId }),
      });

      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      console.log('🔍 Check seringues :', data);

      if (!data.connectedSyringes) throw new Error('Format de réponse inattendu');

      const formatted = data.connectedSyringes.map((item) => ({
        id: item.seringueId,
        connected: item.status === 'connected',
        connector: item.connector || '---',
      }));

      setSeringueStatus(formatted);
    } catch (err) {
      console.error('❌ Erreur check :', err);
      setErreur('Impossible de vérifier les seringues.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h3>Test des seringues de la socket {socketId}</h3>

      <button
        className="btn btn-success mb-4"
        onClick={testAllSeringues}
        disabled={loading}
      >
        {loading ? 'Test en cours...' : 'Tester toutes les seringues'}
      </button>

      <button
        className="btn btn-success mb-4"
        onClick={() => turnOnSeringue(1)}
        disabled={loading}
      >
        {loading ? 'Test en cours...' : 'Allumer la seringue 1'}
      </button>

      <button
        className="btn btn-danger mb-4"
        onClick={() => turnOffSeringue(1)}
        disabled={loading}
      >
        {loading ? 'Test en cours...' : 'Éteindre la seringue 1'}
      </button>

      {erreur && <p className="text-danger">{erreur}</p>}

      {seringueStatus.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Connectée</th>
                <th>Connecteur</th>
              </tr>
            </thead>
            <tbody>
              {seringueStatus.map((seringue) => (
                <tr key={seringue.id}>
                  <td>Seringue {seringue.id}</td>
                  <td>{seringue.connected ? '🟢 Connectée' : '🔴 Déconnectée'}</td>
                  <td>{seringue.connector}</td>
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
