const Administrador = require('../models/administradores.model');

const controllers = {};

controllers.getAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.find();
    res.status(200).json(administradores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.getAdministradorById = async (req, res) => {
  try {
    const administrador = await Administrador.findById(req.params.id);
    if (!administrador) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.status(200).json(administrador);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.createAdministrador = async (req, res) => {
  const administrador = new Administrador(req.body);
  try {
    const nuevoAdministrador = await administrador.save();
    res.status(201).json(nuevoAdministrador);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.updateAdministrador = async (req, res) => {
  try {
    const administradorActualizado = await Administrador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!administradorActualizado) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.status(200).json(administradorActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.deleteAdministrador = async (req, res) => {
  try {
    const administrador = await Administrador.findByIdAndDelete(req.params.id);
    if (!administrador) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.status(200).json({ message: 'Administrador eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;