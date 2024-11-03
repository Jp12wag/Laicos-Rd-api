const Diócesis = require('../models/diocesis.model');
const logController = require('./log.controller');  

// Crear una nueva diócesis
exports.createDiocesis = async (req, res) => {
    try {
        const { nombre, parroquias } = req.body;
        const nuevaDiocesis = new Diócesis({ nombre, parroquias });
        await nuevaDiocesis.save();
        await logController.crearLog(
            "Creación",
            nuevaDiocesis._id,
            "Se creó una nueva diocesis",
            {nuevaDiocesis }
          );
        res.status(201).json(nuevaDiocesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la diócesis' });
    }
};

// Obtener todas las diócesis
exports.getAllDiocesis = async (req, res) => {
    try {
        const diocesis = await Diócesis.find().populate('parroquias');
        res.json(diocesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las diócesis' });
    }
};

// Obtener una diócesis por ID
exports.getDiocesisById = async (req, res) => {
    try {
        const diocesis = await Diócesis.findById(req.params.id).populate('parroquias');
        if (!diocesis) {
            return res.status(404).json({ message: 'Diócesis no encontrada' });
        }
        res.json(diocesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la diócesis' });
    }
};

// Actualizar una diócesis
exports.updateDiocesis = async (req, res) => {
    try {
        const { nombre, parroquias } = req.body;
        const diocesis = await Diócesis.findByIdAndUpdate(req.params.id, { nombre, parroquias }, { new: true });
        if (!diocesis) {
            return res.status(404).json({ message: 'Diócesis no encontrada' });
        }
        await logController.crearLog(
            "Actualizacion",
            diocesis._id,
            "Se actualizo diocesis",
            {diocesis }
          );
        res.json(diocesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la diócesis' });
    }
};

// Eliminar una diócesis
exports.deleteDiocesis = async (req, res) => {
    try {
        const diocesis = await Diócesis.findByIdAndDelete(req.params.id);
        if (!diocesis) {
            return res.status(404).json({ message: 'Diócesis no encontrada' });
        }

        await logController.crearLog(
            "Elimino",
            diocesis._id,
            "Diócesis eliminada",
            { diocesis }
          );
        res.json({ message: 'Diócesis eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la diócesis' });
    }
};