const Diocesis = require('../models/diocesis.model');
const controllers = {};


controllers.getDiocesis = async (req, res) => {
  try {
    const diocesis = await Diocesis.find();
    res.status(200).json(diocesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


controllers.getDiocesisById = async (req, res) => {
  try {
    const diocesis = await Diocesis.findById(req.params.id);
    if (!diocesis) {
      return res.status(404).json({ message: 'Diócesis no encontrada' });
    }
    res.status(200).json(diocesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


controllers.createDiocesis = async (req, res) => {
  const diocesis = new Diocesis(req.body);
  try {
    const nuevaDiocesis = await diocesis.save();
    res.status(201).json(nuevaDiocesis);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


controllers.updateDiocesis = async (req, res) => {
  try {
    const diocesisActualizada = await Diocesis.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!diocesisActualizada) {
      return res.status(404).json({ message: 'Diócesis no encontrada' });
    }
    res.status(200).json(diocesisActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


controllers.deleteDiocesis = async (req, res) => {
  try {
    const diocesis = await Diocesis.findByIdAndDelete(req.params.id);
    if (!diocesis) {
      return res.status(404).json({ message: 'Diócesis no encontrada' });
    }
    res.status(200).json({ message: 'Diócesis eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;