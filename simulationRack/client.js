const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const message = Buffer.from('SCAN_REQUEST');
const serverPort = 12345;
const serverAddress = '192.168.1.24';

client.send(message, 0, message.length, serverPort, serverAddress, (err) => {
  if (err) {
    console.error('Erreur lors de l\'envoi du message UDP:', err);
  } else {
    console.log('Message SCAN_REQUEST envoyé');
  }
});
