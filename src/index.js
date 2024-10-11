const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const connectDB = require('./db/conexion');

// Modelos
const Mensaje = require('./models/mensaje.model');
const Admin = require('./models/administradores.model');

// Rutas
const miembroRoutes = require('./routes/miembro.routes');
const administradorRoutes = require('./routes/administradores.routes');
const actividadRoutes = require('./routes/activity.routes');
const postRoutes = require('./routes/post.routes');
const arquidiocesisRoutes = require('./routes/arquidiocesis.routes');
const diocesisRoutes = require('./routes/diocesis.routes');
const parroquiaRoutes = require('./routes/parroquia.routes');
const routesMensaje = require('./routes/mensaje.routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

// Configuración CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

// Conexión a la base de datos
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

// Rutas de la API
app.use('/api/miembros', miembroRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/post', postRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/archidiocesis', arquidiocesisRoutes);
app.use('/api/diocesis', diocesisRoutes);
app.use('/api/parroquia', parroquiaRoutes);
app.use('/api/mensajes', routesMensaje);

// Middleware JWT para Socket.io
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Token no provisto'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded._id);

    if (!admin) return next(new Error('Administrador no encontrado'));

    socket.userId = admin._id;
    socket.userInfo = {
      _id: admin._id,
      nombre: admin.nombre,
      apellido: admin.apellido,
    };
    next();
  } catch (err) {
    next(new Error('Token inválido'));
  }
});

// Almacenar usuarios conectados
let usuariosConectados = {};

io.on('connection', (socket) => {
  const userId = socket.userInfo._id;

  if (!userId) return;
  socket.join(userId);

  // Agregar el usuario a la lista de conectados
  usuariosConectados[userId] = { socketId: socket.id, userInfo: socket.userInfo };
  console.log(usuariosConectados);

  // Emitir lista actualizada al usuario actual (sin incluir al propio usuario)
  socket.emit('actualizarUsuariosConectados', Object.values(usuariosConectados).filter(u => u.userInfo._id !== userId));

  // Cargar historial de chat cuando el usuario se conecta
  socket.on('cargarHistorial', async ({ receptorId }) => {
    try {
      const historial = await Mensaje.find({
        $or: [
          { emisor: userId, receptor: receptorId },
          { emisor: receptorId, receptor: userId },
        ],
      }).sort({ fechaEnvio: 1 });

      socket.emit('historialMensajes', historial);
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    }
  });

  // Enviar un mensaje
  socket.on('enviarMensaje', async ({ receptorId, mensaje }) => {
    try {
      const nuevoMensaje = new Mensaje({
        emisor: userId,
        receptor: receptorId,
        mensaje,
        fechaEnvio: new Date(),
      });

      await nuevoMensaje.save(); // Guardar en la base de datos

      if (usuariosConectados[receptorId]) {
        socket.to(usuariosConectados[receptorId].socketId).emit('nuevoMensaje', {
          emisorId: userId,
          mensaje,
          fechaEnvio: nuevoMensaje.fechaEnvio,
        });
      } else {
        console.log('Receptor no está conectado, el mensaje se guardará en la base de datos');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  });

  // Desconectar cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado', socket.id);
    if (userId) {
      delete usuariosConectados[userId]; // Eliminar de la lista de conectados
      io.emit('actualizarUsuariosConectados', Object.values(usuariosConectados));
    }
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
 