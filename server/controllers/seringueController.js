const { Seringue } = require('../models');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

class SeringueController {
  // Créer une nouvelle seringue
  async createSeringue(req, res) {
    try {
      const { seringue_socket_Id } = req.body;

      // Création d'une nouvelle seringue
      const newSeringue = await Seringue.create({
        seringue_socket_Id,
      });

      res.status(201).json(newSeringue);
    } catch (error) {
      console.error('Error creating seringue:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Récupérer toutes les seringues
  async getAllSeringues(req, res) {
    try {
      const seringues = await Seringue.findAll({
        include: {
          model: require('../models').Socket, // Assurez-vous que le modèle Socket est correctement importé
          as: 'socket', // Alias d'association défini dans le modèle
        },
      });

      res.status(200).json(seringues);
    } catch (error) {
      console.error('Error fetching seringues:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Récupérer une seringue par son ID
  async getSeringueById(req, res) {
    try {
      const { id } = req.params;

      const seringue = await Seringue.findByPk(id, {
        include: {
          model: require('../models').Socket,
          as: 'socket',
        },
      });

      if (!seringue) {
        return res.status(404).json({ message: 'Seringue not found' });
      }

      res.status(200).json(seringue);
    } catch (error) {
      console.error('Error fetching seringue:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Mettre à jour une seringue
  async updateSeringue(req, res) {
    try {
      const { id } = req.params;
      const { seringue_socket_Id } = req.body;

      const seringue = await Seringue.findByPk(id);

      if (!seringue) {
        return res.status(404).json({ message: 'Seringue not found' });
      }

      seringue.seringue_socket_Id = seringue_socket_Id;
      await seringue.save();

      res.status(200).json(seringue);
    } catch (error) {
      console.error('Error updating seringue:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Supprimer une seringue
  async deleteSeringue(req, res) {
    try {
      const { id } = req.params;

      const seringue = await Seringue.findByPk(id);

      if (!seringue) {
        return res.status(404).json({ message: 'Seringue not found' });
      }

      await seringue.destroy();
      res.status(200).json({ message: 'Seringue deleted successfully' });
    } catch (error) {
      console.error('Error deleting seringue:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // allumer la seringue depuis la socket grace au message 0xff en udp
  async turnOnSeringue(req, res) {
    try {
      const { socketId, handshake } = req.body;
  
      const segmentLength = 0x03;
      const command = 0x43; // commande pour allumer la seringue
      const data = 0xFF;
  
      // Construction du buffer de commande
      const frame = Buffer.from([
        socketId,       // ID socket (à bien passer dans req.body)
        segmentLength,  // longueur du segment
        command,        // commande "power on"
        handshake,      // handshake (à incrémenter côté client)
        data            // data = 0xFF
      ]);
  
      console.log("📤 Buffer envoyé :", frame.toString('hex'));
  
      const serverAddress = '192.168.2.103';
      const serverPort = 0xCAFE; // attention c’est un entier, pas `Buffer.from([0xCAFE])`
  
      // Envoi UDP
      client.send(frame, 0, frame.length, serverPort, serverAddress, (err) => {
        if (err) {
          console.error('❌ Erreur lors de l\'envoi du message UDP :', err);
          return res.status(500).json({ message: 'Erreur d\'envoi UDP' });
        }
  
        console.log('✅ Message de commande 0x43 envoyé à la seringue');
        return res.status(200).json({ message: 'Commande envoyée avec succès' });
      });
  
    } catch (error) {
      console.error('❌ Erreur dans turnOnSeringue :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async turnOffSeringue(req, res) {
    try {
      const { socketId, handshake } = req.body;
  
      const segmentLength = 0x03;
      const command = 0x43; // même commande que pour allumer
      const data = 0x00;    // ici on envoie 0x00 pour éteindre
  
      const frame = Buffer.from([
        socketId,       // ID socket (1 byte)
        segmentLength,  // longueur du segment
        command,        // commande shutdown
        handshake,      // valeur incrémentée
        data            // 0x00 = éteindre
      ]);
  
      console.log("📤 Buffer envoyé (shutdown):", frame.toString('hex'));
  
      const serverAddress = '192.168.2.103';
      const serverPort = 0xCAFE;
  
      client.send(frame, 0, frame.length, serverPort, serverAddress, (err) => {
        if (err) {
          console.error('❌ Erreur lors de l\'envoi du message UDP (shutdown) :', err);
          return res.status(500).json({ message: 'Erreur d\'envoi UDP' });
        }
  
        console.log('✅ Message de commande 0x43 (shutdown) envoyé à la seringue');
        return res.status(200).json({ message: 'Commande 0x00 (shutdown) envoyée avec succès' });
      });
  
    } catch (error) {
      console.error('❌ Erreur dans turnOffSeringue :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  


  
  // Vérifier le statut d'une seringue via UDP
// Fonction pour vérifier le statut de la seringue via UDP
async checkSeringueStatus(req, res) {
  const dgram = require('dgram');
  const client = dgram.createSocket('udp4');

  try {
    const { socketId, handshake } = req.body;

    const segmentLength = 0x05;
    const command = 0x47;
    const canAddress = 0x00;

    const frame = Buffer.from([socketId, segmentLength, command, handshake, canAddress]);

    const serverAddress = '192.168.2.103';
    const serverPort = 51966; // Port de la seringue

    let responseSent = false;

    client.on('message', (msg) => {
      if (responseSent) return;
      responseSent = true;

      console.log('📥 Réponse reçue:', msg.toString('hex'));

      try {
        const parsed = parseSyringeInfo(msg);
        client.close();
        return res.status(200).json({ message: '🧪 Infos seringue reçues', parsed });
      } catch (error) {
        client.close();
        return res.status(400).json({ message: 'Erreur de parsing', error: error.message });
      }
    });

    client.on('listening', () => {
      console.log('✅ Client en écoute sur le port aléatoire');
      client.send(frame, 0, frame.length, serverPort, serverAddress);
    });

    // Lier le client à un port aléatoire (bind 0)
    client.bind(0);

    client.send(frame, 0, frame.length, serverPort, serverAddress, (err) => {
      if (err) {
        console.error('❌ Erreur envoi UDP:', err);
        if (!responseSent) {
          responseSent = true;
          client.close();
          return res.status(500).json({ message: 'Erreur lors de l\'envoi' });
        }
      } else {
        console.log('📤 Trame envoyée:', frame.toString('hex'));
      }
    });

    setTimeout(() => {
      if (!responseSent) {
        responseSent = true;
        client.close();
        return res.status(408).json({ message: '⏱️ Timeout: aucune réponse de la seringue' });
      }
    }, 5000);

  } catch (err) {
    console.error('❌ Erreur dans checkSeringueStatus:', err);
    client.close();
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}



// Fonction pour parser les infos de la seringue
 parseSyringeInfo(msg) {
  const expectedCommand = 0x54;
  if (msg[2] !== expectedCommand) {
    throw new Error('Réponse inattendue, commande incorrecte');
  }

  const parsedData = {
    socketId: msg[0],
    segmentLength: msg[1],
    command: msg[2],
    handshake: msg[3],
    canAddress: msg[4],
    serialNumber: msg.slice(5, 11).toString('hex'),
    code: msg[11],
    revision: msg.readUInt16BE(12),
    length: msg.readUIntBE(14, 3),
    crc: msg.readUInt16BE(17)
  };
  console.log('Parsed Data:', parsedData);

  return parsedData;
}
}

module.exports = new SeringueController();
