const Miembro = require('../models/miembros.model');

const controllers = {};

// Obtener todos los miembros
controllers.getMiembros = async (req, res) => {
  try {
    const miembros = await Miembro.find();
    res.status(200).json(miembros);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener un miembro por ID
controllers.getMiembroById = async (req, res) => {
  try {
    const miembro = await Miembro.findById(req.params.id);
    if (!miembro) {
      return res.status(404).json({ message: 'Miembro no encontrado' });
    }
    res.status(200).json(miembro);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un nuevo miembro
controllers.createMiembro = async (req, res) => {
  const miembro = new Miembro(req.body);
  try {
    const nuevoMiembro = await miembro.save();
    res.status(201).json(nuevoMiembro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar un miembro
controllers.updateMiembro = async (req, res) => {
  try {
    const miembroActualizado = await Miembro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!miembroActualizado) {
      return res.status(404).json({ message: 'Miembro no encontrado' });
    }
    res.status(200).json(miembroActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar un miembro
controllers.deleteMiembro = async (req, res) => {
  try {
    const miembro = await Miembro.findByIdAndDelete(req.params.id);
    if (!miembro) {
      return res.status(404).json({ message: 'Miembro no encontrado' });
    }
    res.status(200).json({ message: 'Miembro eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;