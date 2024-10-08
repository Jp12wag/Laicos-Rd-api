const Post = require('../models/post.model');

// Crear una nueva publicación
const crearPost = async (req, res) => {
  try {
    const { content, media } = req.body;

    const nuevaPublicacion = new Post({
      content,
      media,
      AdminId: req.administrador._id
    });

    await nuevaPublicacion.save();
    const io = req.app.get('socketio');
    io.emit('nuevaPublicacion', nuevaPublicacion);

    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la publicación' });
  }
};

const obtenerFeed = async (req, res) => {
  try {
    const publicaciones = await Post.find()
      .populate('AdminId', 'nombre apellido')
      .sort({ createdAt: -1 });

    if (!publicaciones || publicaciones.length === 0) {
      return res.status(404).json({ message: 'No hay publicaciones disponibles.' });
    }

    res.status(200).json(publicaciones);
  } catch (error) {
    console.error('Error al obtener el feed:', error); // Registra el error en la consola
    res.status(500).json({ error: 'Error al obtener el feed' });
  }
};
// Dar like a una publicación
const darLike = async (req, res) => {
  try {
    const publicacion = await Post.findById(req.params.id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const yaDioLike = publicacion.likes.includes(req.administrador._id);

    if (!yaDioLike) {
      publicacion.likes.push(req.administrador._id);
      await publicacion.save();
      res.status(200).json({ message: 'Like añadido' });
    } else {
      res.status(400).json({ message: 'Ya diste like a esta publicación' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al dar like' });
  }
};

// Comentar en una publicación
const comentarPost = async (req, res) => {
  try {
    const { comment } = req.body;

    const publicacion = await Post.findById(req.params.id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    publicacion.comments.push({
      AdminId: req.administrador._id,
      comment
    });

    await publicacion.save();
    res.status(201).json({ message: 'Comentario agregado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
};
const editarPublicacion = async (req, res) => {
  try {
    const { content } = req.body;
    const publicacion = await Post.findById(req.params.id);

    // Verifica si la publicación existe
    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    // Verifica si el usuario es el creador de la publicación
    if (!publicacion.AdminId.equals(req.administrador._id)) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta publicación' });
    }

    // Actualiza el contenido de la publicación
    publicacion.content = content;
    await publicacion.save();
    res.status(200).json({ message: 'Publicación editada', publicacion });
  } catch (error) {
    res.status(500).json({ error: 'Error al editar la publicación' });
  }
};
// Borrar una publicación
const borrarPublicacion = async (req, res) => {
  try {
    const publicacion = await Post.findById(req.params.id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    // Verificar que el AdminId de la publicación coincida con el AdminId del usuario que está autenticado
    if (publicacion.AdminId.toString() !== req.administrador._id.toString()) {
      return res.status(403).json({ error: 'No tienes permiso para borrar esta publicación' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Publicación borrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar la publicación' });
  }
};

module.exports = {
  crearPost,
  obtenerFeed,
  darLike,
  comentarPost,
  editarPublicacion,
  borrarPublicacion,
};
