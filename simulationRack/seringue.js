const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const DESTINATION_PORT = 51966; // 51966 en décimal
const DESTINATION_IP = '127.0.0.1';

// Exemple : découvrir un socket
function buildDiscoverFrame(uid = 0x00) {
  const segment = Buffer.from([
    3,         // Length du segment (Cmd, UID, Data = 1 + 1 + 0)
    0x47,      // Discover command
    uid        // UID
  ]);

  const socketId = Buffer.from([0x01]); // identifiant de socket arbitraire
  const header = Buffer.alloc(8, 0x00); // pas précisé dans ton image, on met des zéros

  return Buffer.concat([header, socketId, segment]);
}

function sendFrame(buffer) {
  client.send(buffer, 0, buffer.length, DESTINATION_PORT, DESTINATION_IP, (err) => {
    if (err) console.error('Erreur envoi :', err);
    else console.log('Trame envoyée avec succès');
  });
}

// Réception de la réponse
client.on('message', (msg, rinfo) => {
  console.log(`📨 Message reçu de ${rinfo.address}:${rinfo.port}`);
  parseFrame(msg);
});

// Analyse d'une réponse UDP
function parseFrame(buffer) {
  const socketId = buffer.readUInt8(8);
  console.log(`🧩 Socket ID: ${socketId}`);

  let offset = 9;
  while (offset < buffer.length) {
    const segmentLength = buffer.readUInt8(offset);
    const cmd = buffer.readUInt8(offset + 1);
    const uid = buffer.readUInt8(offset + 2);
    const data = buffer.slice(offset + 3, offset + segmentLength + offset);
    console.log("Trame envoyée:", buffer.toString('hex'));

    console.log(`↪️ Segment: Cmd=0x${cmd.toString(16)}, UID=${uid}, Data=`, data);

    switch (cmd) {
      case 0x50:
        console.log("✅ Présentation du socket (Discover OK)");
        break;
      case 0x51:
        console.log("📡 Socket Status reçu");
        break;
      case 0x52:
        console.log("🚨 Socket Error reçu");
        break;
      case 0x53:
        const ackCmd = data.readUInt8(0);
        const errCode = data.readUInt8(1);
        console.log(`✅ Acknowledge pour cmd 0x${ackCmd.toString(16)} - Erreur: ${errCode}`);
        break;
      default:
        console.log(`🆕 Commande inconnue: 0x${cmd.toString(16)}`);
    }

    offset += segmentLength + 1;
  }
}

// Envoi après petit délai
setTimeout(() => {
  const frame = buildDiscoverFrame();
  sendFrame(frame);
}, 500);

// Fermer la socket proprement après X secondes
setTimeout(() => {
  console.log("🔒 Fin de l'écoute UDP");
  client.close();
}, 5000);
