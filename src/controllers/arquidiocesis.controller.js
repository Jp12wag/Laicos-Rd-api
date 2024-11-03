const Arquidiocesis = require('../models/arquidiocesis.model');
const logController = require('./log.controller');

const controllers = {};

// Obtener todas las Arquidiócesis
controllers.getArquidiocesis = async (req, res) => {
  try {
    const arquidiocesis = await Arquidiocesis.find();
    res.status(200).json(arquidiocesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener Arquidiócesis por ID
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

// Crear nueva Arquidiócesis
controllers.createArquidiocesis = async (req, res) => {
  const arquidiocesis = new Arquidiocesis(req.body);
  
  try {
    const nuevaArquidiocesis = await arquidiocesis.save();
    await logController.crearLog(
      "Creacion",
      nuevaArquidiocesis._id,
      "Creacion Arquidiocesis",
      { nuevaArquidiocesis }
    );

    res.status(201).json(nuevaArquidiocesis);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar Arquidiócesis
controllers.updateArquidiocesis = async (req, res) => {
  try {
    const arquidiocesisActualizada = await Arquidiocesis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!arquidiocesisActualizada) {
      return res.status(404).json({ message: 'Arquidiócesis no encontrada' });
    }
    await logController.crearLog(
      "Actualizacion",
      arquidiocesisActualizada._id,
      "Actualizacion Arquidiocesis",
      { arquidiocesisActualizada }
    );
    res.status(200).json(arquidiocesisActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar Arquidiócesis
controllers.deleteArquidiocesis = async (req, res) => {
  try {
    const arquidiocesis = await Arquidiocesis.findByIdAndDelete(req.params.id);
    if (!arquidiocesis) {
      return res.status(404).json({ message: 'Arquidiócesis no encontrada' });
    }
    await logController.crearLog(
      "Eliminacion",
      arquidiocesis._id,
      "Eliminacion Arquidiocesis",
      { arquidiocesis }
    );
    res.status(200).json({ message: 'Arquidiócesis eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;
