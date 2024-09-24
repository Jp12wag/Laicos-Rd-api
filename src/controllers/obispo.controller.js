const Obispo = require('../models/obispo.model');

const controllers = {};

controllers.getObispos = async (req, res) => {
  try {
    const obispos = await Obispo.find();
    res.status(200).json(obispos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.getObispoById = async (req, res) => {
  try {
    const obispo = await Obispo.findById(req.params.id);
    if (!obispo) {
      return res.status(404).json({ message: 'Obispo no encontrado' });
    }
    res.status(200).json(obispo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.createObispo = async (req, res) => {
  const obispo = new Obispo(req.body);
  try {
    const nuevoObispo = await obispo.save();
    res.status(201).json(nuevoObispo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.updateObispo = async (req, res) => {
  try {
    const obispoActualizado = await Obispo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!obispoActualizado) {
      return res.status(404).json({ message: 'Obispo no encontrado' });
    }
    res.status(200).json(obispoActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.deleteObispo = async (req, res) => {
  try {
    const obispo = await Obispo.findByIdAndDelete(req.params.id);
    if (!obispo) {
      return res.status(404).json({ message: 'Obispo no encontrado' });
    }
    res.status(200).json({ message: 'Obispo eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;