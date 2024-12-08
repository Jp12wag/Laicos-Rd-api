const Post = require('../models/post.model');






// Crear una nueva publicación
const crearPost = async (req, res) => {
  try {
    const { content } = req.body;
    const media = req.file ? `/uploads/${req.file.filename}` : null;
    const nuevaPublicacion = new Post({
      content,
      media,
      AdminId: req.administrador._id
    });
    await nuevaPublicacion.save();
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la publicación' });
  }
};

const obtenerFeed = async (req, res) => {
  try {
    const publicaciones = await Post.find()
      .populate('AdminId', 'nombre apellido foto').populate({
        path: 'comments.AdminId',
        select: 'nombre apellido foto' 
      })
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

    const userId = req.administrador._id;
    const yaDioLike = publicacion.likes.includes(userId);

    if (!yaDioLike) {
      publicacion.likes.push(userId);
      await publicacion.save();
      res.status(200).json({ message: 'Like añadido' });
    } else {
      publicacion.likes = publicacion.likes.filter(id => id.toString() !== userId.toString());
      await publicacion.save();
      res.status(200).json({ message: 'Like eliminado', likes: publicacion.likes });

    }
  } catch (error) {
    res.status(500).json({ error: 'Error al dar like' });
  }
};

// Comentar en una publicación
const comentarPost = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "El comentario no puede estar vacío." });
    }

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

const obtenerFeedPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params; // Obtenemos el userId de los parámetros de la ruta

    const publicaciones = await Post.find({ AdminId: userId })
      .populate('AdminId', 'nombre apellido foto')
      .populate({
        path: 'comments.AdminId',
        select: 'nombre apellido foto'
      })
      .sort({ createdAt: -1 });

    if (!publicaciones || publicaciones.length === 0) {
      return res.status(404).json({ message: 'No hay publicaciones disponibles para este usuario.' });
    }

    res.status(200).json(publicaciones);
  } catch (error) {
    console.error('Error al obtener el feed por usuario:', error);
    res.status(500).json({ error: 'Error al obtener el feed por usuario' });
  }
};

const obtenerComentarios = async (req, res) => {
  try {
    const { id } = req.params; 
    const publicacion = await Post.findById(id).populate({
      path: 'comments.AdminId',
      select: 'nombre apellido foto'
    });

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    res.status(200).json(publicacion.comments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
};

module.exports = {
  crearPost,
  obtenerFeed,
  darLike,
  comentarPost,
  editarPublicacion,
  borrarPublicacion,
  obtenerFeedPorUsuario,
  obtenerComentarios,
};
