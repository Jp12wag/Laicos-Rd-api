const Parroquia = require('../models/parroquia.model');
const Clero = require('../models/clero.model');

const controladoresParroquia = {};

// Obtener todas las parroquias (opcional, si se desea una vista separada de parroquias)
controladoresParroquia.getParroquias = async (req, res) => {
    try {
        const parroquias = await Parroquia.find().populate('clero').populate('diocesis');
        res.status(200).json(parroquias);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
controladoresParroquia.createParroquia = async (req, res) => {
  const { nombre, sacerdote } = req.body; // Asegúrate de recibir todos los campos necesarios

  const parroquia = new Parroquia({
      nombre,
      sacerdote,
  });

  try {
      const nuevaParroquia = await parroquia.save();
      res.status(201).json(nuevaParroquia);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
};


// Obtener una parroquia por ID
controladoresParroquia.getParroquiaById = async (req, res) => {
    try {
        const parroquia = await Parroquia.findById(req.params.id).populate('clero').populate('diocesis');
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
