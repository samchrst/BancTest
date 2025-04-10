const { Seringue } = require('../models');
const dgram = require('dgram');
const client = dgram.createSocket('udp4'); // Création du client UDP

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

  // Vérifier le statut d'une seringue via UDP
  async checkSeringueStatus(req, res) {
    try {
      const { seringue_socket_Id } = req.body;

      // Crée le message UDP à envoyer
      const message = Buffer.from(`CHECK_STATUS:${seringue_socket_Id}`);

      // Définir l'adresse et le port du serveur UDP
      const serverAddress = '192.168.1.100'; // Adresse du serveur UDP
      const serverPort = 12345; // Port UDP

      // Envoi du message
      client.send(message, 0, message.length, serverPort, serverAddress, (err) => {
        if (err) {
          console.error('Erreur lors de l\'envoi du message UDP:', err);
          return res.status(500).json({ message: 'Erreur lors de l\'envoi du message UDP' });
        }
        console.log('Message UDP envoyé');
      });

      // Réception de la réponse UDP (asynchrone)
      client.on('message', (msg) => {
        const response = msg.toString();

        if (response === 'OK') {
          return res.status(200).json({ status: 'Seringue connectée et opérationnelle' });
        } else {
          return res.status(400).json({ status: 'Problème avec la seringue' });
        }
      });

    } catch (error) {
      console.error('Error checking seringue status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

// Exporter une instance de la classe
module.exports = new SeringueController();
