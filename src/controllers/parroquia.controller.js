const Parroquia = require('../models/parroquia.model');
const controladoresParroquia = {};

// Obtener todas las parroquias
controladoresParroquia.getParroquias = async (req, res) => {
    try {
        const parroquias = await Parroquia.find().populate('dioesis'); // Población para obtener datos de diócesis
        res.status(200).json(parroquias);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crear nueva parroquia
controladoresParroquia.createParroquia = async (req, res) => {
    const { nombre, dioesis } = req.body;

    const parroquia = new Parroquia({ nombre, dioesis });

    try {
        const nuevaParroquia = await parroquia.save();
        res.status(201).json(nuevaParroquia);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
controladoresParroquia.getParroquiasByDiocesis = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la diócesis desde los parámetros de la URL
        console.log('ID de la diócesis:', id);

        // Filtrar las parroquias por el campo "diocesis"
        const parroquias = await Parroquia.find({ dioesis: id }); // Asegúrate de que "diocesis" es el nombre del campo en el modelo
        console.log('Parroquias encontradas:', parroquias);
        console.log(parroquias)
        res.status(200).json(parroquias || []);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las parroquias' });
    }
};

// Obtener una parroquia por ID
controladoresParroquia.getParroquiaById = async (req, res) => {
    try {
        const parroquia = await Parroquia.findById(req.params.id).populate('dioesis');
        if (!parroquia) {
            return res.status(404).json({ message: 'Parroquia no encontrada' });
        }
        res.status(200).json(parroquia);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener una parroquia por ID
controladoresParroquia.getParroquiaIdBy = async (req, res) => {
    try {
        const parroquia = await Parroquia.findById(req.params.id)
        if (!parroquia) {
            return res.status(404).json({ message: 'Parroquia no encontrada' });
        }
        res.status(200).json(parroquia);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Actualizar Parroquia
controladoresParroquia.updateParroquia = async (req, res) => {
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

// Eliminar Parroquia
controladoresParroquia.deleteParroquia = async (req, res) => {
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

module.exports = controladoresParroquia;
