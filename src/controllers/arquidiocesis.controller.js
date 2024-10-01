const Arquidiocesis = require('../models/arquidiocesis.model');

const controllers = {};

controllers.getArquidiocesis = async (req, res) => {
  try {
    const arquidiocesis = await Arquidiocesis.find();
    res.status(200).json(arquidiocesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.getArquidiocesisById = async (req, res) => {
  try {
    const arquidiocesis = await Arquidiocesis.findById(req.params.id);
    if (!arquidiocesis) {
      return res.status(404).json({ message: 'Arquidiócesis no encontrada' });
    }
    res.status(200).json(arquidiocesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.createArquidiocesis = async (req, res) => {
  const arquidiocesis = new Arquidiocesis(req.body);
  try {
    const nuevaArquidiocesis = await arquidiocesis.save();
    res.status(201).json(nuevaArquidiocesis);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.updateArquidiocesis = async (req, res) => {
  try {
    const arquidiocesisActualizada = await Arquidiocesis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!arquidiocesisActualizada) {
      return res.status(404).json({ message: 'Arquidiócesis no encontrada' });
    }
    res.status(200).json(arquidiocesisActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.deleteArquidiocesis = async (req, res) => {
  try {
    const arquidiocesis = await Arquidiocesis.findByIdAndDelete(req.params.id);
    if (!arquidiocesis) {
      return res.status(404).json({ message: 'Arquidiócesis no encontrada' });
    }
    res.status(200).json({ message: 'Arquidiócesis eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;
const Arquidiocesis = require('../models/arquidiocesis.model');

const controllers = {};

controllers.getArquidiocesis = async (req, res) => {
  try {
    const arquidiocesis = await Arquidiocesis.find();
    res.status(200).json(arquidiocesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.getArquidiocesisById = async (req, res) => {
  try {
    const arquidiocesis = await Arquidiocesis.findById(req.params.id);
    if (!arquidiocesis) {
      return res.status(404).json({ message: 'Arquidiócesis no encontrada' });
    }
    res.status(200).json(arquidiocesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.createArquidiocesis = async (req, res) => {
  const arquidiocesis = new Arquidiocesis(req.body);
  try {
    const nuevaArquidiocesis = await arquidiocesis.save();
    res.status(201).json(nuevaArquidiocesis);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.updateArquidiocesis = async (req, res) => {
  try {
    const arquidiocesisActualizada = await Arquidiocesis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!arquidiocesisActualizada) {
      return res.status(404).json({ message: 'Arquidiócesis no encontrada' });
    }
    res.status(200).json(arquidiocesisActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.deleteArquidiocesis = async (req, res) => {
  try {
    const arquidiocesis = await Arquidiocesis.findByIdAndDelete(req.params.id);
    if (!arquidiocesis) {
      return res.status(404).json({ message: 'Arquidiócesis no encontrada' });
    }
    res.status(200).json({ message: 'Arquidiócesis eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;