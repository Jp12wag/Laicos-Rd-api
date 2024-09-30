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
  try {
    // Primero, verifica las credenciales del administrador
    const admin = await Administrador.findByCredentials(req.body.email, req.body.password);

    // Busca al miembro en la base de datos por correo electrónico
    let miembro = await Miembro.findOne({ email: admin.email });

    // Si el miembro no existe, crea uno nuevo
    if (!miembro) {
      miembro = new Miembro({
        nombre: admin.nombre,
        apellido: admin.apellido,
        sexo: admin.sexo,
        email: admin.email,
        celular: admin.celular,
        fechaNacimiento: admin.nacimiento,
        direccion: req.body.direccion,      // Asignar desde req.body
        estadoCivil: req.body.estadoCivil,  // Asignar desde req.body
        cargo: req.body.cargo,              // Asignar desde req.body
        nacionalidad: req.body.nacionalidad, // Asignar desde req.body
        esLaico: true
      });

      console.log(miembro);
      // Guardar el nuevo miembro
      await miembro.save();
    } else {
      // Si el miembro ya existe, podrías realizar otra lógica aquí
      console.log('Miembro ya existente:', miembro);

      // Verificar si ya tiene todos los datos adicionales
      if (!miembro.direccion || !miembro.estadoCivil || !miembro.cargo || !miembro.nacionalidad) {
        // Puede devolver un estado o mensaje que indique que necesita más datos
        return res.status(200).send({
          admin,
          miembro,
          requiresAdditionalData: true
        });
      }
    }

    // Responde con el administrador y el miembro
    res.status(200).send({ admin, miembro });
  } catch (error) {
    console.error('Error en createMiembro:', error);
    res.status(400).send(error);
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

controllers.getMiembroPorCorreo = async (req, res) => {
  try {
    console.log(req.body.email);
    const miembro = await Miembro.findOne({ email: req.body.email });
    console.log(miembro);
    if (!miembro) {
      return res.status(404).json({ message: 'Miembro no encontrado' });
    }
    res.json(miembro).status(200);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}

module.exports = controllers;