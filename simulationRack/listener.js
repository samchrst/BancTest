// listener.js
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  console.log(`📨 Reçu: ${msg.toString('hex')} de ${rinfo.address}:${rinfo.port}`);

  // 👉 On simule une réponse Discover (cmd 0x50) avec les mêmes UID/socket
  const socketId = Buffer.from([0x01]); // identifiant arbitraire
  const uid = msg[10]; // on récupère le UID envoyé pour le remettre

  const responseSegment = Buffer.from([
    3,      // longueur segment
    0x50,   // Discover OK
    uid     // même UID
  ]);

  const header = Buffer.alloc(8, 0x00); // header vide
  const response = Buffer.concat([header, socketId, responseSegment]);

  // 🔁 Envoi de la réponse au client
  server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
    if (err) console.error("❌ Erreur d'envoi de la réponse :", err);
    else console.log(`✅ Réponse envoyée à ${rinfo.address}:${rinfo.port}`);
  });
});

server.bind(51966, '127.0.0.1', () => {
  console.log("🟢 En écoute sur 127.0.0.1:51966");
});
