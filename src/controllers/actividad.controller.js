const Actividad = require('../models/activity.model');

// Crear una actividad
exports.createActividad = async (req, res) => {
  try {
    const nuevaActividad = new Actividad(req.body);
    console.log(nuevaActividad);
    await nuevaActividad.save();
    res.status(201).json({ message: 'Actividad creada', actividad: nuevaActividad });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la actividad', error });
  }
};

// Obtener todas las actividades
exports.getActividades = async (req, res) => {
  try {
    const actividades = await Actividad.find();
    res.status(200).json(actividades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener actividades', error });
  }
};

// Obtener una actividad por ID
exports.getActividadById = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id);
    if (!actividad) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.status(200).json(actividad);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la actividad', error });
  }
};

// Modificar una actividad
exports.updateActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actividad) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.status(200).json({ message: 'Actividad actualizada', actividad });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la actividad', error });
  }
};

// Eliminar una actividad
exports.deleteActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndDelete(req.params.id);
    if (!actividad) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.status(200).json({ message: 'Actividad eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la actividad', error });
  }
};
