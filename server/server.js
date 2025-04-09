const express = require('express');
const dgram = require('dgram');
const cors = require('cors');
const routes = require("./routes/routes");

const app = express();
const port = 3000;

app.use(cors()); // Autorise les requêtes depuis React
app.use(express.json());

// Définir la route scan avant les routes custom
app.post('/api/scan', (req, res) => {
  const udpClient = dgram.createSocket('udp4');
  const udpPort = 12345;
  const udpServerIP = '192.168.27.148'; // IP du serveur UDP

  const message = Buffer.from('SCAN_REQUEST');
  udpClient.send(message, 0, message.length, udpPort, udpServerIP, (err) => {
    if (err) {
      console.error('Erreur en envoyant le message UDP:', err);
      return res.status(500).json({ error: 'Erreur en envoyant le message UDP' });
    }
  });

  // Attente de la réponse du serveur UDP
  udpClient.once('message', (msg, rinfo) => {
    const msgStr = msg.toString();
    console.log(`Réponse UDP reçue de ${rinfo.address}:${rinfo.port}: ${msgStr}`);

    if (msgStr.startsWith('SCAN_RESPONSE:')) {
      const devices = msgStr.replace('SCAN_RESPONSE:', '').split(',');
      return res.json({ devices });
    } else {
      return res.status(400).json({ error: 'Réponse invalide du serveur UDP' });
    }
  });

  // Timeout au bout de 3 secondes si pas de réponse
  setTimeout(() => {
    udpClient.close();
    return res.status(504).json({ error: 'Timeout du scan, aucune réponse reçue.' });
  }, 3000);
});

// === ROUTES CUSTOM (ex: ping) ===
app.use("/api", routes);  // Cela va gérer les autres routes comme ping

app.listen(port, () => {
  console.log(`API Express démarrée sur http://localhost:${port}`);
});
