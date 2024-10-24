const Actividad = require('../models/activity.model');
require('dotenv').config();
const CryptoJS = require('crypto-js');



// Crear una actividad
exports.createActividad = async (req, res) => {
  try {
    const nuevaActividad = new Actividad(req.body);
     // Encriptar el ID de la actividad
     const idEncriptado = nuevaActividad._id.toString();
     console.log(idEncriptado)
     // Generar el enlace y actualizar el registro
     nuevaActividad.enlace = `http://localhost:3000/actividades/${idEncriptado}`;

    await nuevaActividad.save();
    res.status(201).json({ message: 'Actividad creada', actividad: nuevaActividad });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la actividad', error });
  }
};

// Obtener todas las actividades
exports.getActividades = async (req, res) => {
  try {
    const actividades = await Actividad.find();
    res.status(200).json(actividades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener actividades', error });
  }
};

// Obtener una actividad por ID
exports.getActividadById = async (req, res) => {
  try {

    const bytes = CryptoJS.AES.decrypt(req.params.id, process.env.JWT_SECRET);
   
    const actividadIdDesencriptado = req.params.id  ;
  
    if (!actividadIdDesencriptado) return res.status(400).json({ message: 'ID inválido' });

    const actividad = await Actividad.findById(actividadIdDesencriptado);

    if (!actividad) return res.status(404).json({ message: 'Actividad no encontrada' });

    res.status(200).json(actividad);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la actividad', error });
  }
};

// Modificar una actividad
exports.updateActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actividad) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.status(200).json({ message: 'Actividad actualizada', actividad });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la actividad', error });
  }
};

// Eliminar una actividad
exports.deleteActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndDelete(req.params.id);
    if (!actividad) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.status(200).json({ message: 'Actividad eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la actividad', error });
  }
};

exports.inscribirMiembro = async (req, res) => {
  const { miembroId } = req.body; // Obtener el ID del miembro del cuerpo de la solicitud
  try {
    const actividad = await Actividad.findById(req.params.id);
    if (!actividad) return res.status(404).json({ message: 'Actividad no encontrada' });
    
     // Verificar si el número máximo de participantes ha sido alcanzado
     if (actividad.maxParticipantes > 0 && actividad.inscritos.length >= actividad.maxParticipantes) {
      return res.status(400).json({ message: 'El número máximo de participantes ha sido alcanzado' });
    }
    
    // Agregar el miembro a la lista de inscritos si no está ya inscrito
    if (!actividad.inscritos.includes(miembroId)) {
      actividad.inscritos.push(miembroId);
      await actividad.save();
      return res.status(200).json({ message: 'Inscripción exitosa', actividad });
    } else {
      return res.status(400).json({ message: 'Ya estás inscrito en esta actividad' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al inscribir al miembro', error });
  }
};

// Controlador para cancelar inscripción de actividad
exports.cancelarInscripcion = async (req, res) => {
  const { id } = req.params; // ID de la actividad
  const { miembroId } = req.body; // ID del miembro que se desinscribe

  try {
    // Encontrar la actividad
    const actividad = await Actividad.findById(id);
    
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    // Eliminar al miembro de la lista de inscritos
    actividad.inscritos = actividad.inscritos.filter(inscrito => inscrito.toString() !== miembroId);

    await actividad.save(); // Guarda los cambios en la base de datos
    return res.status(200).json({ message: 'Desinscripción exitosa' });
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    return res.status(500).json({ message: 'Error al cancelar la inscripción' });
  }
};

