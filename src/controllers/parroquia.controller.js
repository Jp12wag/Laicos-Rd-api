const Parroquia = require('../models/parroquia.model');
const controllers = {};


controllers.getParroquias = async (req, res) => {
  try {
    const parroquias = await Parroquia.find();
    res.status(200).json(parroquias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


controllers.getParroquiaById = async (req, res) => {
  try {
    const parroquia = await Parroquia.findById(req.params.id);
    if (!parroquia) {
      return res.status(404).json({ message: 'Parroquia no encontrada' });
    }
    res.status(200).json(parroquia);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


controllers.createParroquia = async (req, res) => {
  const parroquia = new Parroquia(req.body);
  try {
    const nuevaParroquia = await parroquia.save();
    res.status(201).json(nuevaParroquia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


controllers.updateParroquia = async (req, res) => {
  try {
    const parroquiaActualizada = await Parroquia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!parroquiaActualizada) {
      return res.status(404).json({ message: 'Parroquia no encontrada' });
    }
    res.status(200).json(parroquiaActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


controllers.deleteParroquia = async (req, res) => {
  try {
    const parroquia = await Parroquia.findByIdAndDelete(req.params.id);
    if (!parroquia) {
      return res.status(404).json({ message: 'Parroquia no encontrada' });
    }
    res.status(200).json({ message: 'Parroquia eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;
const Parroquia = require('../models/parroquia.model');
const controllers = {};


controllers.getParroquias = async (req, res) => {
  try {
    const parroquias = await Parroquia.find();
    res.status(200).json(parroquias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


controllers.getParroquiaById = async (req, res) => {
  try {
    const parroquia = await Parroquia.findById(req.params.id);
    if (!parroquia) {
      return res.status(404).json({ message: 'Parroquia no encontrada' });
    }
    res.status(200).json(parroquia);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


controllers.createParroquia = async (req, res) => {
  const parroquia = new Parroquia(req.body);
  try {
    const nuevaParroquia = await parroquia.save();
    res.status(201).json(nuevaParroquia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


controllers.updateParroquia = async (req, res) => {
  try {
    const parroquiaActualizada = await Parroquia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!parroquiaActualizada) {
      return res.status(404).json({ message: 'Parroquia no encontrada' });
    }
    res.status(200).json(parroquiaActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


controllers.deleteParroquia = async (req, res) => {
  try {
    const parroquia = await Parroquia.findByIdAndDelete(req.params.id);
    if (!parroquia) {
      return res.status(404).json({ message: 'Parroquia no encontrada' });
    }
    res.status(200).json({ message: 'Parroquia eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;