const express = require('express');
const controllers = require('../controllers/post.controller');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Aquí guardaremos los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Genera un nombre único
  }
});

const upload = multer({ storage: storage });

// Ruta para crear una nueva publicación
router.post('/', auth, upload.single('media'), controllers.crearPost);

// Ruta para obtener todas las publicaciones (feed)
router.get('/feed', auth, controllers.obtenerFeed);

// Ruta para dar "like" a una publicación
router.post('/like/:id', auth, controllers.darLike);

// Ruta para comentar en una publicación
router.post('/comentar/:id', auth, controllers.comentarPost);

router.delete('/:id', auth, controllers.borrarPublicacion); // Nueva ruta para borrar publicaciones

router.put('/:id', auth, controllers.editarPublicacion);
// Ruta para obtener publicaciones por usuario
router.get('/feed/user/:userId', auth, controllers.obtenerFeedPorUsuario);


module.exports = router;
