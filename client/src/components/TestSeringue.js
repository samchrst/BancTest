import React, { useState, useEffect } from 'react';

const TestSeringue = ({ socketId, seringues }) => {
  const [seringueStatus, setSeringueStatus] = useState([]);

  // Vérifier l'état de la seringue à chaque changement
  useEffect(() => {
    // Mettre à jour l'état des seringues en fonction des données reçues
    const updatedStatus = seringues.map((seringue, index) => ({
      id: index + 1,
      connected: seringue.connected,
      connector: seringue.connector || 'N/A',
    }));

    setSeringueStatus(updatedStatus);
  }, [seringues]);

  const handleTest = (id) => {
    // Gérer un test pour une seringue donnée, ex. de manière simulée
    alert(`Test de la seringue ${id} sur la socket ${socketId}`);
  };

  return (
    <div className="container py-5">
      <h3>Test des seringues de la socket {socketId}</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Seringue ID</th>
              <th>Connectée</th>
              <th>Connecteur</th>
              <th>Test</th>
            </tr>
          </thead>
          <tbody>
            {seringueStatus.map((seringue) => (
              <tr key={seringue.id}>
                <td>Seringue {seringue.id}</td>
                <td>{seringue.connected ? '🟢 Connectée' : '🔴 Déconnectée'}</td>
                <td>{seringue.connector}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleTest(seringue.id)}
                    disabled={!seringue.connected}
                  >
                    Tester
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestSeringue;
