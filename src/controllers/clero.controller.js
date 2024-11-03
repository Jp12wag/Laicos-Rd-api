
const Clero = require('../models/clero.model');
const logController = require('./log.controller');

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

    await logController.crearLog(
      "Creación",
      nuevoClero._id,
      "Se creó un clero",
      { nuevoClero}
    );
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
    await logController.crearLog(
      "Actualizacion",
      cleroActualizado._id,
      "Se actualizo un clero",
      { cleroActualizado}
    );
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
    await logController.crearLog(
      "Eliminado",
      clero._id,
      "Clero eliminado",
      { clero}
    );
    res.status(200).json({ message: 'Clero eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const Clero = require('../models/Clero');

const asignarParroquiaClero = async (req, res) => {
  try {
    const { cleroId, parroquiaId } = req.body;

    const cleroActualizado = await Clero.findByIdAndUpdate(
      cleroId,
      { parroquia: parroquiaId },
      { new: true }
    );

    res.status(200).json(cleroActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error asignando parroquia al clero' });
  }
};


module.exports = controllers;