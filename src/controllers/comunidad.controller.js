const Comunidad = require('../models/comunidad.model');
const Admin = require('../models/administradores.model');
const Canal = require('../models/Canal.model');
const Mensaje = require('../models/mensaje.model');
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

    const canalesPorDefecto = [
      { nombre: 'General', tipo: 'texto', comunidad: comunidad._id },
      { nombre: 'Voz', tipo: 'voz', comunidad: comunidad._id },
    ];


    const canalesCreados = await Canal.insertMany(canalesPorDefecto);

    comunidad.canales = canalesCreados.map(canal => canal._id);
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

controllers.listarCanales = async (req, res) => {
  try {
    const { comunidadId } = req.params;
    const canales = await Canal.find({ comunidad: comunidadId });
    res.send(canales);
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
   
    if (!req.administrador || !req.administrador._id) {
      return res.status(403).send({ error: 'Acceso denegado. No se encontró el administrador.' });
    }

    // Buscar la comunidad por su ID y verificar si el usuario es el administrador principal (rol 'admin')
    const comunidad = await Comunidad.findOne({
      _id: comunidadId,
      'administradores.administrador': req.administrador._id,
      'administradores.rol': 'admin'
    });

    if (!comunidad) {
   
      return res.status(404).send({ error: 'Comunidad no encontrada o no tiene permisos para eliminarla' });
    }

    await Comunidad.findByIdAndDelete(comunidadId);

    res.send({ message: 'Comunidad eliminada correctamente' });
  } catch (e) {
    res.status(500).send(e);
  }
};

controllers.obtenerComunidadPorId = async (req, res) => {
  try {
      const { id } = req.params;
     
      const comunidad = await Comunidad.findById(id).populate('canales').populate({
        path: 'administradores.administrador', // Realizar populate en el campo 'administrador' de cada objeto en 'administradores'
        model: 'admin' // Nombre del modelo referenciado (Admin)
      });

      if (!comunidad) {
          return res.status(404).json({ message: 'Comunidad no encontrada' });
      }
      res.status(200).json(comunidad);
  } catch (error) {
      console.error('Error al obtener la comunidad por ID:', error);
      res.status(500).json({ message: 'Error al obtener la comunidad' });
  }

}

controllers.crearCanal = async (req, res) => {
  try {
    const { comunidadId, nombre, tipo } = req.body;
    const canal = new Canal({ nombre, tipo, comunidad: comunidadId });
    await canal.save();

    // Añadir el canal a la comunidad
    const comunidad = await Comunidad.findById(comunidadId);
    comunidad.canales.push(canal._id);
    await comunidad.save();

    res.status(201).json(canal);
  } catch (e) {
    res.status(400).json({ message: 'Error al crear el canal', error: e });
  }
};

// Actualizar canal por ID
controllers.actualizarCanal = async (req, res) => {
  try {
    const { canalId } = req.params;
    const { nombre, tipo } = req.body;

    const canal = await Canal.findByIdAndUpdate(canalId, { nombre, tipo }, { new: true });
    if (!canal) return res.status(404).json({ message: 'Canal no encontrado' });

    res.status(200).json(canal);
  } catch (e) {
    res.status(400).json({ message: 'Error al actualizar el canal', error: e });
  }
};

// Eliminar canal por ID
controllers.eliminarCanal = async (req, res) => {
  try {
    const { canalId } = req.params;

    const canal = await Canal.findByIdAndDelete(canalId);
    if (!canal) return res.status(404).json({ message: 'Canal no encontrado' });

    // Remover el canal de la comunidad
    await Comunidad.findByIdAndUpdate(canal.comunidad, { $pull: { canales: canalId } });

    res.status(200).json({ message: 'Canal eliminado correctamente' });
  } catch (e) {
    res.status(400).json({ message: 'Error al eliminar el canal', error: e });
  }
};

controllers.enviarMensaje = async (req, res) => {
  try {
    const { canalId } = req.params;
    const { emisor, receptor, mensaje } = req.body;

    // Crear un nuevo mensaje
    const nuevoMensaje = new Mensaje({
      emisor,
      receptor,
      mensaje,
    });
    const mensajeGuardado = await nuevoMensaje.save();

    // Agregar el mensaje al canal
    await Canal.findByIdAndUpdate(
      canalId,
      { $push: { mensajes: mensajeGuardado._id } },
      { new: true }
    );

    res.status(201).json(mensajeGuardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
};

controllers.obtenerMensajes = async (req, res) => {
  try {
    const { canalId } = req.params;

    // Encontrar el canal y cargar los mensajes
    const canal = await Canal.findById(canalId).populate({
      path: 'mensajes',
      populate: { path: 'emisor receptor', select: 'nombre' } // Opción para cargar datos del emisor y receptor
    });
    if (!canal) {
      return res.status(404).json({ error: 'Canal no encontrado' });
    }

    res.status(200).json(canal.mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes del canal' });
  }
};



module.exports = controllers;
