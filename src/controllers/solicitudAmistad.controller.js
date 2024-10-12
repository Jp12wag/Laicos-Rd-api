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


// Aceptar solicitud de amistad
controllers.AceptarSolicitud = async (req, res) => {
 const { solicitudId } = req.body;
 const receptorId = req.administrador._id;

  try {
    const solicitud = await SolicitudAmistad.findByIdAndUpdate( 
      { _id: solicitudId, receptor: receptorId }
      ,{ estado: 'aceptada' },
      { new: true } 
    );
    if (solicitud) {
      const amigo = await Administrador.findById(solicitud.emisor); // O la función que uses para obtener el amigo
      console.log("Encontre un amigo",amigo)
      res.status(200).json({ message: 'Solicitud de amistad aceptada.', amigo });
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
  const userId = req.administrador._id;

  try {
    const solicitudesAceptadas = await SolicitudAmistad.find({
      $or: [{ emisor: userId }, { receptor: userId }],
      estado: 'aceptada'
    });

    const amigoIds = solicitudesAceptadas.map(solicitud => (
      solicitud.emisor.toString() === userId ? solicitud.receptor : solicitud.emisor
    ));

    const amigos = await Admin.find({ _id: { $in: amigoIds } }, 'nombre apellido');

    res.status(200).json(amigos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de amigos.' });
  }
};

module.exports = controllers;