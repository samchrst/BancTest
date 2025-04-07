'use strict';
const { Socket } = require('../models'); // Assure-toi d'importer le modèle `Socket`

module.exports = {
  // Créer un nouveau socket
  async create(req, res) {
    try {
      const { socket_ip, socket_rack_id } = req.body;
      
      const socket = await Socket.create({
        socket_ip,
        socket_rack_id
      });

      return res.status(201).json(socket);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la création du socket' });
    }
  },

  // Récupérer tous les sockets
  async getAll(req, res) {
    try {
      const sockets = await Socket.findAll({
        include: {
          model: Socket.sequelize.models.Rack,
          as: 'rack',
          attributes: ['id', 'nbSocket', 'nbSeringue']  // Inclure les informations du Rack
        }
      });

      return res.status(200).json(sockets);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des sockets' });
    }
  },

  // Récupérer un socket par son ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const socket = await Socket.findByPk(id, {
        include: {
          model: Socket.sequelize.models.Rack,
          as: 'rack',
          attributes: ['id', 'nbSocket', 'nbSeringue']
        }
      });

      if (!socket) {
        return res.status(404).json({ message: 'Socket non trouvé' });
      }

      return res.status(200).json(socket);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération du socket' });
    }
  },

  // Mettre à jour un socket
  async update(req, res) {
    try {
      const { id } = req.params;
      const { socket_ip, socket_rack_id } = req.body;

      const socket = await Socket.findByPk(id);

      if (!socket) {
        return res.status(404).json({ message: 'Socket non trouvé' });
      }

      socket.socket_ip = socket_ip || socket.socket_ip;
      socket.socket_rack_id = socket_rack_id || socket.socket_rack_id;

      await socket.save();

      return res.status(200).json(socket);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour du socket' });
    }
  },

  // Supprimer un socket
  async delete(req, res) {
    try {
      const { id } = req.params;

      const socket = await Socket.findByPk(id);

      if (!socket) {
        return res.status(404).json({ message: 'Socket non trouvé' });
      }

      await socket.destroy();

      return res.status(200).json({ message: 'Socket supprimé avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la suppression du socket' });
    }
  }
};
