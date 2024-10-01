const Miembro = require('../models/miembros.model');
const Administrador = require('../models/administradores.model');

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
      
    const miembro = await Miembro.findOne({idAdministrador: req.params.id});
    console.log("Este miembro: "+miembro);
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
  try {
    // Busca al miembro en la base de datos por correo electrónico
    const adminId = req.body._id || req.admin._id;
    // Verifica si el administrador está autenticado
    if (!adminId) {
      return res.status(401).send({ message: 'No autorizado. No se encontró el administrador.' });
    }
    // Busca al miembro en la base de datos por idAdministrador
    let miembro = await Miembro.findOne({ idAdministrador: adminId });

    // Si el miembro no existe, crea uno nuevo
    if (!miembro) {
      miembro = new Miembro({
        idAdministrador: adminId,
        direccion: req.body.direccion,
        estadoCivil: req.body.estadoCivil,
        cargo: req.body.cargo,
        nacionalidad: req.body.nacionalidad
      });

      // Guardar el nuevo miembro
      await miembro.save();
      console.log('Miembro creado:', miembro);
    } else {
      // Si el miembro ya existe, verificamos si le faltan datos
      console.log('Miembro ya existente:', miembro);

      // Si faltan datos adicionales, devuelvo un mensaje que lo indique
      if (!miembro.direccion || !miembro.estadoCivil || !miembro.cargo || !miembro.nacionalidad) {
        return res.status(200).send({
          miembro,
          requiresAdditionalData: true,
          message: 'El miembro ya existe, pero necesita más datos.'
        });
      }
    }

    // Responde con el miembro creado o existente
    res.status(200).send({ miembro });
  } catch (error) {
    console.error('Error en createMiembro:', error);
    res.status(400).send({ message: 'Error al crear el miembro.', error });
  }
};

// Actualiza completamente un miembro por ID (PUT)
controllers.updateMiembro = async (req, res) => {
  try {
    console.log(req.params);
    const adminId = req.params.id || req.admin._id; // Obtener el ID del administrador
    console.log(adminId);
    // Verifica si el administrador está autenticado
    if (!adminId) {
      return res.status(401).send({ message: 'No autorizado. No se encontró el administrador.' });
    }

    // Busca al miembro en la base de datos por idAdministrador
    let miembro = await Miembro.findById(adminId);

    // Si el miembro no existe, crea uno nuevo
    if (!miembro) {
      miembro = new Miembro({
        idAdministrador: req.admin._id,
        direccion: req.body.direccion,
        estadoCivil: req.body.estadoCivil,
        cargo: req.body.cargo,
        nacionalidad: req.body.nacionalidad
      });

      // Guardar el nuevo miembro
      await miembro.save();
      console.log('Miembro creado:', miembro);
    } else {
      // Si el miembro ya existe, actualiza sus datos
      miembro.direccion = req.body.direccion || miembro.direccion;
      miembro.estadoCivil = req.body.estadoCivil || miembro.estadoCivil;
      miembro.cargo = req.body.cargo || miembro.cargo;
      miembro.nacionalidad = req.body.nacionalidad || miembro.nacionalidad;

      // Guardar los cambios
      await miembro.save();
      console.log('Miembro actualizado:', miembro);
    }

    // Responde con el miembro creado o actualizado
    res.status(200).send({ miembro });
  } catch (error) {
    console.error('Error en updateMiembro:', error);
    res.status(400).send({ message: 'Error al actualizar o crear el miembro.', error });
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

// Actualiza parcialmente un miembro por ID (PATCH)
controllers.actualizarMiembro = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['direccion', 'estadoCivil', 'cargo', 'nacionalidad']; // Agrega los campos permitidos
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ message: 'Actualización no permitida' });
  }

  try {
    console.log(req.params.id);
    const miembro = await Miembro.findById(req.params.id);

    if (!miembro) {
      return res.status(404).send({ message: 'Miembro no encontrado' });
    }

    updates.forEach((update) => miembro[update] = req.body[update]);
    await miembro.save();

    res.status(200).send(miembro);
  } catch (error) {
    res.status(400).send({ message: 'Error al actualizar el miembro', error });
  }
};


module.exports = controllers;