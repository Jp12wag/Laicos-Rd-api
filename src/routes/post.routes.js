const express = require('express');
const controllers = require('../controllers/post.controller');
const auth = require('../middleware/auth');
const router = express.Router();

// Ruta para crear una nueva publicación
router.post('/', auth, controllers.crearPost);

// Ruta para obtener todas las publicaciones (feed)
router.get('/feed', auth, controllers.obtenerFeed);

// Ruta para dar "like" a una publicación
router.post('/like/:id', auth, controllers.darLike);

// Ruta para comentar en una publicación
router.post('/comentar/:id', auth, controllers.comentarPost);

router.delete('/:id', auth, controllers.borrarPublicacion); // Nueva ruta para borrar publicaciones

router.put('/:id', auth, controllers.editarPublicacion);

module.exports = router;
