const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const port = 12345;

server.on('message', (msg, rinfo) => {
  console.log(`Message reçu de ${rinfo.address}:${rinfo.port}: ${msg.toString()}`);
  if (msg.toString() === 'SCAN_REQUEST') {
    console.log(`Appareil trouvé: ${rinfo.address}`);
    
    // Répondre avec un message de type "SCAN_RESPONSE"
    const response = Buffer.from('SCAN_RESPONSE');
    server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi de la réponse:', err);
      } else {
        console.log(`Réponse envoyée à ${rinfo.address}:${rinfo.port}`);
      }
    });
  }
});

// Lancer le serveur UDP
server.bind(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
