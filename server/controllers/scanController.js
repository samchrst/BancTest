'use strict';
const { Scan } = require('../models'); 
const dgram = require('dgram');
const ping = require('ping');

module.exports = {
  // Créer un nouveau scan
  async create(req, res) {
    try {
      const { scan_rack_id } = req.body;
      
      const scan = await Scan.create({
        scan_rack_id
      });

      return res.status(201).json(scan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la création du scan' });
    }
  },

  // Récupérer tous les scans
  async getAll(req, res) {
    try {
      const scans = await Scan.findAll({
        include: {
          model: Scan.sequelize.models.Rack,
          as: 'rack',
          attributes: ['id', 'nbSocket', 'nbSeringue']  // Inclure les informations du Rack
        }
      });

      return res.status(200).json(scans);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des scans' });
    }
  },

  // Récupérer un scan par son ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const scan = await Scan.findByPk(id, {
        include: {
          model: Scan.sequelize.models.Rack,
          as: 'rack',
          attributes: ['id', 'nbSocket', 'nbSeringue']
        }
      });

      if (!scan) {
        return res.status(404).json({ message: 'Scan non trouvé' });
      }

      return res.status(200).json(scan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération du scan' });
    }
  },

  // Mettre à jour un scan
  async update(req, res) {
    try {
      const { id } = req.params;
      const { scan_rack_id } = req.body;

      const scan = await Scan.findByPk(id);

      if (!scan) {
        return res.status(404).json({ message: 'Scan non trouvé' });
      }

      scan.scan_rack_id = scan_rack_id || scan.scan_rack_id;

      await scan.save();

      return res.status(200).json(scan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour du scan' });
    }
  },

  // Supprimer un scan
  async delete(req, res) {
    try {
      const { id } = req.params;

      const scan = await Scan.findByPk(id);

      if (!scan) {
        return res.status(404).json({ message: 'Scan non trouvé' });
      }

      await scan.destroy();

      return res.status(200).json({ message: 'Scan supprimé avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la suppression du scan' });
    }
  },

   // méthode pour scanner le réseau
  async scan(req, res) {
    try {
      // Créer un socket UDP
      const client = dgram.createSocket('udp4');
      const broadcastAddress = '192.168.1.255'; // Adresse de broadcast pour le réseau
      const port = 12345; // Port sur lequel le scan sera effectué
      const message = Buffer.from('SCAN_REQUEST'); // Message à envoyer aux appareils sur le réseau

      let discoveredSockets = [];

      // Écouter les messages UDP de retour des appareils
      client.on('message', (msg, rinfo) => {
        // Si le message est une réponse valide, on ajoute l'adresse IP à la liste
        if (msg.toString() === 'SCAN_RESPONSE') {
          if (!discoveredSockets.includes(rinfo.address)) {
            discoveredSockets.push(rinfo.address);
          }
        }
      });

      // Envoi du message en broadcast à tous les appareils sur le réseau
      client.send(message, 0, message.length, port, broadcastAddress, (err) => {
        if (err) {
          console.error('Erreur d\'envoi du message UDP :', err);
          return res.status(500).json({ error: 'Erreur d\'envoi du message UDP' });
        }
        console.log('Requête de scan envoyée en broadcast');

        // Arrêter le client après un délai d'attente pour laisser le temps aux appareils de répondre
        setTimeout(() => {
          // Répondre avec la liste des sockets découvertes
          res.json({ sockets: discoveredSockets });
          client.close(); // Fermer le client UDP
        }, 3000); // Attendre 3 secondes avant de donner la réponse (ajustable)
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors du scan du réseau' });
    }
  },

  // Autres méthodes de scan (ping, etc.) peuvent être ajoutées ici
  async ping(req, res) {
    try {
        console.log("Reçu dans le body :", req.body); // 🔥 DEBUG
        const hosts = req.body.hosts; // 🔥 Prendre les IPs envoyées dans la requête

        if (!hosts || !Array.isArray(hosts)) {
            return res.status(400).json({ message: "Le body doit contenir un tableau 'hosts'." });
        }

        let results = [];

        for (let host of hosts) {
            let response = await ping.promise.probe(host);
            results.push({
                host: host,
                alive: response.alive,
                time: response.time,
                output: response.output,
            });
        }

        console.log("Résultats du ping :", results); // 🔥 DEBUG

        return res.status(200).json({ message: 'Ping effectué avec succès', results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors du ping des adresses IP' });
    }
  }
};
