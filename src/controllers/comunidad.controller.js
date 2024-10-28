const Comunidad = require('../models/comunidad.model');
const Admin = require('../models/administradores.model');
const controllers = {};

// Crear comunidad a partir de un administrador
controllers.crearComunidad = async (req, res) => {
  try {
    const { nombre, descripcion, visibilidad } = req.body;
    
    // Crear la comunidad asignando al administrador que hace la petición
    const comunidad = new Comunidad({
      nombre,
      descripcion,
      visibilidad: visibilidad || 'publica', // Asignar 'publica' si no se especifica
      administradores: [{
        administrador: req.administrador._id, // El administrador que crea la comunidad
        rol: 'admin' // Rol de admin por defecto
      }]
    });

    await comunidad.save();
    res.status(201).send(comunidad);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Agregar administrador o miembro a la comunidad
controllers.agregarMiembro = async (req, res) => {
  try {
    const { comunidadId, administradorId, rol } = req.body;

    const comunidad = await Comunidad.findById(comunidadId);
    const administrador = await Admin.findById(administradorId);

    if (!comunidad || !administrador) {
      return res.status(404).send({ error: 'Comunidad o administrador no encontrado' });
    }

    comunidad.administradores.push({ administrador: administrador._id, rol });
    await comunidad.save();

    res.send(comunidad);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Listar comunidades
controllers.listarComunidades = async (req, res) => {
  try {
    const comunidades = await Comunidad.find({
      $or: [
        { visibilidad: 'publica' }, // Comunidades públicas siempre se muestran
        { 'administradores.administrador': req.administrador._id } // Comunidades privadas donde el usuario es administrador o miembro
      ]
    });
    res.send(comunidades);
  } catch (e) {
    res.status(500).send(e);
  }
};


// Actualizar una comunidad
controllers.actualizarComunidad = async (req, res) => {
  try {
    const { comunidadId } = req.params;
    const { nombre, descripcion, visibilidad } = req.body;

    // Buscar la comunidad por su ID y verificar si el usuario es administrador de dicha comunidad
    const comunidad = await Comunidad.findOne({
      _id: comunidadId,
      'administradores.administrador': req.administrador._id
    });

    if (!comunidad) {
      return res.status(404).send({ error: 'Comunidad no encontrada o no tiene permisos para actualizarla' });
    }

    // Actualizar solo los campos proporcionados en el cuerpo de la solicitud
    if (nombre) comunidad.nombre = nombre;
    if (descripcion) comunidad.descripcion = descripcion;
    if (visibilidad) comunidad.visibilidad = visibilidad;

    await comunidad.save();
    res.send(comunidad);
  } catch (e) {
    res.status(400).send(e);
  }
};
// Eliminar una comunidad
controllers.eliminarComunidad = async (req, res) => {
  try {
    const { comunidadId } = req.params;

    // Buscar la comunidad por su ID y verificar si el usuario es el administrador principal (rol 'admin')
    const comunidad = await Comunidad.findOne({
      _id: comunidadId,
      'administradores.administrador': req.administrador._id,
      'administradores.rol': 'admin'
    });
    console.log(comunidad)

    if (!comunidad) {
      return res.status(404).send({ error: 'Comunidad no encontrada o no tiene permisos para eliminarla' });
    }

    await comunidad.remove();
    res.send({ message: 'Comunidad eliminada correctamente' });
  } catch (e) {
    res.status(500).send(e);
  }
};


module.exports = controllers;
