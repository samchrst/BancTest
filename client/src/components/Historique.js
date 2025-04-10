import React, { useState, useEffect } from 'react';

const Historique = () => {
  const [historique, setHistorique] = useState([]);

  // Fonction pour récupérer l'historique depuis localStorage
  useEffect(() => {
    const historiqueData = localStorage.getItem('scanHistory');
    if (historiqueData) {
      setHistorique(JSON.parse(historiqueData));
    }
  }, []);

  // Fonction pour afficher l'historique des scans
  const renderHistorique = () => {
    if (historique.length === 0) {
      return <p>Aucun scan effectué jusqu'à présent.</p>;
    }

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Hôtes scannés</th>
            <th scope="col">Résultats</th>
          </tr>
        </thead>
        <tbody>
          {historique.map((scan, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{scan.date}</td>
              <td>{Array.isArray(scan.hosts) ? scan.hosts.join(', ') : 'Aucun hôte'}</td>
              <td>{scan.results ? '✅ Réussi' : '❌ Échoué'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container py-5">
      <h1>Historique des Scans</h1>
      <div className="mt-4">
        {renderHistorique()}
      </div>
    </div>
  );
};

export default Historique;
