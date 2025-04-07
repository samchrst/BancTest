const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const port = 12345;
// Adresse IP de la machine dans le réseau local
const serverIP = '192.168.27.144'; // Remplacer par l'IP réelle de la machine sur le réseau local

// Liste des appareils simulés (pour cette simulation, tu peux les ignorer)
const devices = [
  { ip: '192.168.27.20', port: 12345 },
  { ip: '192.168.27.21', port: 12345 },
  { ip: '192.168.27.22', port: 12345 },
  // Ajouter d'autres appareils si nécessaire
];

// Gestion des messages entrants
server.on('message', (msg, rinfo) => {
  console.log(`Message reçu de ${rinfo.address}:${rinfo.port}: ${msg.toString()}`);

  if (msg.toString() === 'SCAN_REQUEST') {
    console.log(`Requête de scan reçue de ${rinfo.address}`);

    // Préparer la liste des appareils trouvés (ici, on utilise des IP simulées)
    const foundDevices = devices.map(device => device.ip).join(',');

    // Répondre avec la liste des appareils trouvés (en simulant une réponse avec leurs IP)
    const response = Buffer.from(`SCAN_RESPONSE:${foundDevices}`);
    server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi de la réponse:', err);
      } else {
        console.log(`Réponse envoyée à ${rinfo.address}:${rinfo.port}`);
      }
    });
  }
});

// Lancer le serveur UDP et écouter sur le port spécifié
server.bind(port, serverIP, () => {
  console.log(`Serveur en écoute sur ${serverIP} sur le port ${port}`);
});
