const Mensaje = require('../models/mensaje.model');



// Enviar un mensaje
const enviarMensaje = async (req, res) => {
  try {
    const { emisor, receptor, mensaje, fechaEnvio,leido} = req.body;
    console.log("Esto es una conversacion: "+req.body);
    // Crear nuevo mensaje
    const nuevoMensaje = new Mensaje({
      emisor,
      receptor,
      mensaje,
      fechaEnvio:new Date(),
      leido: false
    });



    await nuevoMensaje.save();
    
    // Verificar si el receptor está conectado
  const rece = usuariosConectados.find(user => user.id === receptorId);
  console.log(rece)
  if (rece) {
    // Emitir el mensaje si está conectado
    io.to(rece.socketId).emit('nuevoMensaje', {
      emisor,
      mensaje,
      fechaEnvio: new Date()
    });

    nuevoMensaje.entregado = true;
    await nuevoMensaje.save();
  }

    res.status(201).json({success: true,message: 'Mensaje enviado correctamente',data: nuevoMensaje});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error enviando el mensaje',
      error: error.message
    });
  }
};

// Obtener mensajes entre dos usuarios
const obtenerMensajes = async (req, res) => {
  try {
    const { emisorId, receptorId } = req.params;

    const mensajes = await Mensaje.find({
      $or: [
        { emisor: mongoose.Types.ObjectId(emisorId), receptor: mongoose.Types.ObjectId(receptorId) },
        { emisor: mongoose.Types.ObjectId(receptorId), receptor: mongoose.Types.ObjectId(emisorId) }
      ]
    }).sort({ fechaEnvio: 1 }); // Ordenar por fecha de envío

    res.status(200).json({
      success: true,
      message: 'Mensajes obtenidos correctamente',
      data: mensajes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo los mensajes',
      error: error.message
    });
  }
};

// Marcar un mensaje como leído
const marcarComoLeido = async (req, res) => {
  try {
    const { mensajeId } = req.params;

    const mensaje = await Mensaje.findByIdAndUpdate(
      mensajeId,
      { leido: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Mensaje marcado como leído',
      data: mensaje
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marcando el mensaje como leído',
      error: error.message
    });
  }
};

module.exports = {
  enviarMensaje,
  obtenerMensajes,
  marcarComoLeido
};