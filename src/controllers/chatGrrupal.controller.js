const controllers = {};
const GrupoChat = require('../models/grupochat.model');
const Parroquia = require('../models/parroquia.model');
const Miembro = require('../models/administradores.model');

controllers.buscarGrupo = async (req, res) => {
  const { parroquiaId, miembroId } = req.body;

  try {
    let grupo = await GrupoChat.findOne({ parroquia: parroquiaId });

    if (!grupo) {
      grupo = new GrupoChat({ parroquia: parroquiaId, miembros: [miembroId] });
      await grupo.save();
    } else if (!grupo.miembros.includes(miembroId)) {
      grupo.miembros.push(miembroId);
      await grupo.save();
    }

    res.json(grupo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar o crear grupo de chat');
  }
}

controllers.EnviarMensajeGrupo = async (req, res) => {
  const { grupoId, emisorId, mensaje } = req.body;

  try {
    const nuevoMensaje = new Mensaje({
      emisor: emisorId,
      mensaje,
      fechaEnvio: new Date(),
    });

    await nuevoMensaje.save();

    const grupo = await GrupoChat.findById(grupoId);
    grupo.mensajes.push(nuevoMensaje);
    await grupo.save();

    res.json(nuevoMensaje);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar mensaje al grupo');
  }
}
module.exports = controllers;