const Diocesis = require('../models/diocesis.model');
const Parroquia = require('../models/parroquia.model');
const Clero = require('../models/clero.model');

const controladoresDiocesis = {};

// Obtener todas las diócesis con parroquias
controladoresDiocesis.getDiocesis = async (req, res) => {
    try {
        const diocesis = await Diocesis.find().populate('parroquias');
        res.status(200).json(diocesis);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crear una parroquia dentro de una diócesis
controladoresDiocesis.crearParroquia = async (req, res) => {
    const { nombre, sacerdote, diocesisId } = req.body;

    try {
        const diocesis = await Diocesis.findById(diocesisId);
        if (!diocesis) {
            return res.status(404).json({ message: 'Diócesis no encontrada' });
        }

        const nuevaParroquia = new Parroquia({ nombre, sacerdote, diocesis: diocesisId });
        const parroquiaGuardada = await nuevaParroquia.save();

        // Añadir parroquia a la diócesis
        diocesis.parroquias.push(parroquiaGuardada._id);
        await diocesis.save();

        res.status(201).json(parroquiaGuardada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Crear un miembro del clero dentro de una parroquia
controladoresDiocesis.crearClero = async (req, res) => {
    const { nombre, titulo, parroquiaId } = req.body;

    try {
        const parroquia = await Parroquia.findById(parroquiaId);
        if (!parroquia) {
            return res.status(404).json({ message: 'Parroquia no encontrada' });
        }

        const nuevoClero = new Clero({ nombre, titulo, parroquia: parroquiaId });
        const cleroGuardado = await nuevoClero.save();

        // Añadir clero a la parroquia
        parroquia.clero.push(cleroGuardado._id);
        await parroquia.save();

        res.status(201).json(cleroGuardado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Actualizar parroquia dentro de diócesis
controladoresDiocesis.actualizarParroquia = async (req, res) => {
    try {
        const parroquiaActualizada = await Parroquia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!parroquiaActualizada) {
            return res.status(404).json({ message: 'Parroquia no encontrada' });
        }
        res.status(200).json(parroquiaActualizada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Actualizar miembro del clero
controladoresDiocesis.actualizarClero = async (req, res) => {
    try {
        const cleroActualizado = await Clero.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cleroActualizado) {
            return res.status(404).json({ message: 'Miembro del clero no encontrado' });
        }
        res.status(200).json(cleroActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Eliminar parroquia de la diócesis
controladoresDiocesis.eliminarParroquia = async (req, res) => {
    try {
        const parroquiaEliminada = await Parroquia.findByIdAndDelete(req.params.id);
        if (!parroquiaEliminada) {
            return res.status(404).json({ message: 'Parroquia no encontrada' });
        }

        // Eliminar referencia de la diócesis
        const diocesis = await Diocesis.findById(parroquiaEliminada.diocesis);
        diocesis.parroquias.pull(parroquiaEliminada._id);
        await diocesis.save();

        res.status(200).json({ message: 'Parroquia eliminada' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Eliminar clero de la parroquia
controladoresDiocesis.eliminarClero = async (req, res) => {
    try {
        const cleroEliminado = await Clero.findByIdAndDelete(req.params.id);
        if (!cleroEliminado) {
            return res.status(404).json({ message: 'Miembro del clero no encontrado' });
        }

        // Eliminar referencia de la parroquia
        const parroquia = await Parroquia.findById(cleroEliminado.parroquia);
        parroquia.clero.pull(cleroEliminado._id);
        await parroquia.save();

        res.status(200).json({ message: 'Miembro del clero eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = controladoresDiocesis;
