
const Clero = require('../models/clero.model');

const controllers = {};

controllers.getClero = async (req, res) => {
  try {
    const clero = await Clero.find();
    res.status(200).json(clero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.getCleroById = async (req, res) => {
  try {
    const clero = await Clero.findById(req.params.id);
    if (!clero) {
      return res.status(404).json({ message: 'Clero no encontrado' });
    }
    res.status(200).json(clero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.createClero = async (req, res) => {
  const clero = new Clero(req.body);
  try {
    const nuevoClero = await clero.save();
    res.status(201).json(nuevoClero);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.updateClero = async (req, res) => {
  try {
    const cleroActualizado = await Clero.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cleroActualizado) {
      return res.status(404).json({ message: 'Clero no encontrado' });
    }
    res.status(200).json(cleroActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.deleteClero = async (req, res) => {
  try {
    const clero = await Clero.findByIdAndDelete(req.params.id);
    if (!clero) {
      return res.status(404).json({ message: 'Clero no encontrado' });
    }
    res.status(200).json({ message: 'Clero eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;