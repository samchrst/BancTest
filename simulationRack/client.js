const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const port = 12345;
const serverIP = '192.168.27.148';  // IP de ton serveur

// Envoi de la requête de scan
const message = Buffer.from('SCAN_REQUEST');
client.send(message, 0, message.length, port, serverIP, (err) => {
  if (err) {
    console.error('Erreur lors de l\'envoi de la requête:', err);
  } else {
    console.log('Requête de scan envoyée');
  }
});

// Réception de la réponse
client.on('message', (msg, rinfo) => {
  console.log(`Réponse reçue de ${rinfo.address}:${rinfo.port}: ${msg.toString()}`);
  if (msg.toString().startsWith('SCAN_RESPONSE:')) {
    // Extraire les IPs des appareils trouvés
    const devices = msg.toString().slice('SCAN_RESPONSE:'.length).split(',');
    console.log('Appareils trouvés:', devices);
  }
});
