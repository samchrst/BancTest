const express = require('express');
const dgram = require('dgram');
const app = express();
const port = 3000;

// Route pour commencer le scan
app.get('/api/scan', (req, res) => {
  const message = Buffer.from('SCAN_REQUEST'); // Message de requête pour le scan
  const client = dgram.createSocket('udp4');
  const broadcastAddress = '255.255.255.255'; // Broadcast sur tout le réseau

  let discoveredSockets = [];

  // Fonction pour écouter les réponses
  client.on('message', (msg, rinfo) => {
    // Si un socket répond, on ajoute son adresse IP à la liste
    if (!discoveredSockets.includes(rinfo.address)) {
      discoveredSockets.push(rinfo.address);
    }
  });

  // Envoi du message en broadcast
  client.send(message, 0, message.length, 12345, broadcastAddress, (err) => {
    if (err) {
      console.error('Erreur d\'envoi du message UDP :', err);
      res.status(500).json({ error: 'Erreur d\'envoi du message UDP' });
      client.close();
    } else {
      console.log('Requête de scan envoyée');
      setTimeout(() => {
        // Retourner la liste des sockets découvertes après un délai
        res.json({ sockets: discoveredSockets });
        client.close();
      }, 3000); // Temps d'attente avant de retourner les résultats (ajustable)
    }
  });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
