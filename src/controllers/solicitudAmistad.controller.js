const SolicitudAmistad= require('../models/solicitudAmistad.model');
const controllers = {};
const Administrador = require('../models/administradores.model');

controllers.SolicitudAmistad = async (req, res) => {
 
  const { receptor } = req.body;
  const emisor = req.administrador._id;

  try {
    const nuevaSolicitud = new SolicitudAmistad({ emisor, receptor });
    await nuevaSolicitud.save();
    res.status(200).json({ message: 'Solicitud de amistad enviada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar la solicitud de amistad.' });
  }

};
// Obtener todas las solicitudes pendientes para el usuario autenticado
controllers.getSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await SolicitudAmistad.find({ receptor: req.administrador._id, estado: 'pendiente' })
      .populate('emisor', 'nombre correo');  // Poblamos la información del emisor
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las solicitudes pendientes.' });
  }
};

// Obtener la lista de amigos (solicitudes aceptadas)
controllers.getAmigos = async (req, res) => {
  try {
    const amigos = await SolicitudAmistad.find({ $or: [{ emisor: req.administrador._id }, { receptor: req.administrador._id }], estado: 'aceptada' })
      .populate('emisor receptor', 'nombre correo');  // Poblamos la información de ambos usuarios
    res.status(200).json(amigos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de amigos.' });
  }
};


controllers.AceptarSolicitud = async (req, res) => {
  const { solicitudId } = req.body;
  const receptorId = req.administrador._id; // El usuario autenticado que está aceptando la solicitud

  try {
    // Actualizamos el estado de la solicitud a 'aceptada'
    const solicitud = await SolicitudAmistad.findByIdAndUpdate(
      { _id: solicitudId, receptor: receptorId },
      { estado: 'aceptada' },
      { new: true }
    );

    if (solicitud) {
      // Añadir al emisor en la lista de amigos del receptor
      await Administrador.findByIdAndUpdate(receptorId, { $push: { amigos: solicitud.emisor } });

      // Añadir al receptor en la lista de amigos del emisor
      await Administrador.findByIdAndUpdate(solicitud.emisor, { $push: { amigos: receptorId } });

       // Obtener la información tanto del emisor como del receptor para actualizar sus respectivas listas
       const emisor = await Administrador.findById(solicitud.emisor, 'nombre correo');
       const receptor = await Administrador.findById(receptorId, 'nombre correo');
      // Obtener la información del nuevo amigo para devolverla en la respuesta
      const amigo = await Administrador.findById(solicitud.emisor, 'nombre correo');

      // Devolver ambos amigos en la respuesta para que el frontend pueda actualizar ambas listas
      res.status(200).json({
        message: 'Solicitud de amistad aceptada.',
        emisor,     // Información del emisor (quien envió la solicitud)
        receptor    // Información del receptor (quien aceptó la solicitud)
      });

    } else {
      res.status(404).json({ error: 'Solicitud no encontrada.' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Error al aceptar la solicitud.' });
  }
};

// Rechazar solicitud de amistad

controllers.RecharSolicitud = async (req, res) => {
  const { solicitudId } = req.body;
  const receptorId = req.administrador._id;
  try {
    const solicitud = await SolicitudAmistad.findOneAndUpdate(
      { _id: solicitudId, receptor: receptorId },
      { estado: 'rechazada' },
      { new: true }
    );

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada.' });
    }

    res.status(200).json({ message: 'Solicitud de amistad rechazada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al rechazar la solicitud.' });
  }
}

controllers.SolicitudesPendientes = async (req, res) => {
  const receptorId = req.administrador._id;

  try {
    const solicitudes = await SolicitudAmistad.find({ receptor: receptorId, estado: 'pendiente' })
      .populate('emisor', 'nombre apellido');

    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las solicitudes pendientes.' });
  }
};

controllers.obtenerAmigos = async (req, res) => {
  const userId = req.administrador._id;  // El ID del usuario autenticado

  try {
    // Buscar solicitudes aceptadas donde el usuario es emisor o receptor
    const solicitudesAceptadas = await SolicitudAmistad.find({
      $or: [{ emisor: userId }, { receptor: userId }],
      estado: 'aceptada'
    });
    
    // Crear una lista de IDs de amigos excluyendo el propio ID del usuario
    const amigoIds = solicitudesAceptadas.map(solicitud => {
      return solicitud.emisor.toString() === userId.toString() 
        ? solicitud.receptor  // Si el usuario es el emisor, el amigo es el receptor
        : solicitud.emisor;   // Si el usuario es el receptor, el amigo es el emisor
    });
  
    // Buscar la información de los amigos usando los IDs
    const amigos = await Administrador.find({ _id: { $in: amigoIds } }, '_id nombre apellido correo');
   
    res.status(200).json(amigos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de amigos.' });
  }
};


module.exports = controllers;