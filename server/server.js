const express = require("express");
const cors = require("cors");
const dgram = require('dgram'); // Importer dgram pour le serveur UDP
const scanController = require("./controllers/scanController"); // Assurez-vous que scanController est bien défini

const app = express();
const PORT = 3000;

// Créer le serveur UDP
const udpServer = dgram.createSocket('udp4');
const udpPort = 12345; // Le port utilisé pour l'UDP
const serverIP = '192.168.27.144'; // Adresse IP de la machine serveur

// Liste des appareils simulés pour tester
const devices = [
  { ip: '192.168.27.20', port: udpPort },
  { ip: '192.168.27.21', port: udpPort },
  { ip: '192.168.27.22', port: udpPort },
];

// Middleware pour autoriser les requêtes du front (CORS)
app.use(cors({ origin: "*" }));
app.use(express.json()); // Middleware pour parser le JSON

// API principale
app.use("/api", require("./routes/routes")); // Toutes les routes de l'API

// Route pour tester que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("Serveur Node.js fonctionne !");
});

// Route pour démarrer le scan via UDP
app.post('/api/scan', (req, res) => {
  const client = dgram.createSocket('udp4');
  const message = Buffer.from('SCAN_REQUEST');
  const udpPort = 12345;
  const broadcastIP = '192.168.27.255';

  let responseHandled = false;

  client.on('listening', () => {
    const address = client.address();
    console.log(`Client UDP en écoute sur ${address.address}:${address.port}`);

    client.setBroadcast(true);

    client.send(message, 0, message.length, udpPort, broadcastIP, (err) => {
      if (err) {
        console.error('Erreur d\'envoi :', err);
        client.close();
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de la requête de scan' });
      }

      console.log('Requête de scan envoyée en broadcast');
    });
  });

  client.on('message', (msg, rinfo) => {
    const response = msg.toString();
    console.log(`Réponse UDP reçue de ${rinfo.address}:${rinfo.port} : ${response}`);
    if (response.startsWith('SCAN_RESPONSE:')) {
      const devices = response.slice('SCAN_RESPONSE:'.length).split(',');
      responseHandled = true;
      client.close();
      return res.json({ devices });
    }
  });

  client.bind(54321); // Important : bind après avoir défini les handlers

  // Timeout
  setTimeout(() => {
    if (!responseHandled) {
      console.log('Timeout : aucun appareil détecté.');
      client.close();
      return res.json({ message: 'Aucun appareil détecté.' });
    }
  }, 3000);
});


// Lancer le serveur HTTP
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

// Lancer le serveur UDP (si tu veux l'écouter sur le port spécifié)
udpServer.bind(udpPort, serverIP, () => {
  console.log(`Serveur UDP en écoute sur ${serverIP}:${udpPort}`);
});
