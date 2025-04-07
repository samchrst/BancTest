// udpDeviceSimulator.js
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const port = 12345;

server.on('listening', () => {
  const address = server.address();
  console.log(`Simulateur en écoute sur ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  const message = msg.toString();
  console.log(`Message reçu de ${rinfo.address}:${rinfo.port} - ${message}`);

  if (message === 'SCAN_REQUEST') {
    const response = Buffer.from('SCAN_RESPONSE:192.168.27.20,192.168.27.21');
    server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
      if (err) {
        console.error('Erreur lors de la réponse UDP :', err);
      } else {
        console.log('Réponse envoyée');
      }
    });
  }
});

server.bind(port);
