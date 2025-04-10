'use strict';
const { Scan } = require('../models'); 
const dgram = require('dgram');
const ping = require('ping');
const iconv = require('iconv-lite');


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
    const client = dgram.createSocket('udp4');
    const broadcastAddress = '192.168.27.255'; // Adresse de broadcast du réseau local
    const port = 12346; // Port sur lequel le message sera envoyé
    const message = Buffer.from('SCAN_REQUEST');

    let discoveredSockets = [];
    let responded = false;

    client.bind(() => {
      // Autoriser le broadcast
      client.setBroadcast(true);

      // Écoute des réponses
      client.on('message', (msg, rinfo) => {
        const msgStr = msg.toString();
        console.log(`Réponse UDP reçue de ${rinfo.address}:${rinfo.port}: ${msgStr}`);
        if (msgStr === 'SCAN_RESPONSE') {
          if (!discoveredSockets.includes(rinfo.address)) {
            discoveredSockets.push(rinfo.address);
          }
        }
      });

      // Envoi du message en broadcast
      client.send(message, 0, message.length, port, broadcastAddress, (err) => {
        if (err) {
          console.error("Erreur d'envoi:", err);
          client.close();
          return res.status(500).json({ error: "Erreur d'envoi du message UDP" });
        }
        console.log('Message SCAN_REQUEST envoyé en broadcast');
      });
    });

    setTimeout(() => {
      if (!responded) {
        responded = true;
        client.close();
        if (discoveredSockets.length > 0) {
          return res.json({ devices: discoveredSockets });
        } else {
          return res.json({ message: "Aucun socket détecté." });
        }
      }
    }, 5000);
  },
  

  // méthode pour pinger les adresses IP
  async ping(req, res) {
    try {
      const hosts = req.body.hosts;
  
      if (!hosts || !Array.isArray(hosts)) {
        return res.status(400).json({ message: "Le body doit contenir un tableau 'hosts'." });
      }
  
      let results = [];
  
      for (let host of hosts) {
        let response = await ping.promise.probe(host, {
          extra: ['-n', '1'], // ping une seule fois
          encoding: 'buffer'  // récupérer output sous forme de Buffer
        });
  
        let output = response.output;
        if (Buffer.isBuffer(output)) {
          output = response.output.toString('utf8');
        }
        
        // Extraire l'adresse IP et le temps en ms depuis le output
        const timeMatch = output.match(/temps=(\d+) ms/);
        const ipMatch = output.match(/R�ponse de ([\d\.]+)/);
        
        results.push({
          host: host,
          alive: response.alive,
          time: timeMatch ? timeMatch[1] : '-', // Si on trouve le temps
          output: ipMatch ? ipMatch[1] : 'no response', // Si on trouve l'IP
        });
        
      }
  
      return res.status(200).json({ message: 'Ping effectué avec succès', results });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors du ping des adresses IP' });
    }
  }
};
