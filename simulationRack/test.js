const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 12346;

server.on('listening', () => {
  const address = server.address();
  console.log(`Socket UDP en écoute sur ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  const message = msg.toString();
  console.log(`Message reçu de ${rinfo.address}:${rinfo.port} → ${message}`);

  if (message === 'SCAN_REQUEST') {
    const response = Buffer.from('SCAN_RESPONSE');
    server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
      if (err) console.error('Erreur en répondant au SCAN:', err);
      else console.log(`Réponse SCAN_RESPONSE envoyée à ${rinfo.address}:${rinfo.port}`);
    });
  }
});

server.bind(PORT);
