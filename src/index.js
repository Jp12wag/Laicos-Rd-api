const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./db/conexion');

// Modelos
const Mensaje = require('./models/mensaje.model');
const Admin = require('./models/administradores.model');
const SolicitudRoutes = require('./routes/solicitud.routes');
const chat = require('./models/grupochat.model')

// Rutas
const miembroRoutes = require('./routes/miembro.routes');
const administradorRoutes = require('./routes/administradores.routes');
const actividadRoutes = require('./routes/activity.routes');
const postRoutes = require('./routes/post.routes');
const arquidiocesisRoutes = require('./routes/arquidiocesis.routes');
const diocesisRoutes = require('./routes/diocesis.routes');
const parroquiaRoutes = require('./routes/parroquia.routes');
const routesMensaje = require('./routes/mensaje.routes');
const routesConversaciones = require('./routes/conversacion.router');
const Notificacion = require('./notificaciones/notificacion');
const ChatGrupal = require('./routes/chatGrupal.routes');
const Comunidad = require('./routes/comunidad.routes');


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
app.use('/api/', routesConversaciones);
app.use('/api/solicitud', SolicitudRoutes);
app.use('/api/chatGrupal', ChatGrupal);
app.use('/api/comunidades', Comunidad)

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

const usuariosConectados = {};

// Evento principal de conexión
io.on('connection', (socket) => {
  const userId = socket.userInfo._id;
  console.log(`Nueva conexión de cliente: ${userId}`);
  
  if (!userId) return;
  socket.join(userId);

  // Agregar el usuario a la lista de conectados
  usuariosConectados[userId] = { socketId: socket.id, userInfo: socket.userInfo };
  io.emit('actualizarUsuariosConectados', Object.values(usuariosConectados));

  // Unir al grupo de su parroquia
  socket.on('unirseGrupoParroquia', async ({ parroquiaId }) => {
    const grupo = await chat.findOne({ parroquia: parroquiaId });
    if (grupo) {
      socket.join(grupo._id.toString());
    }
  });

  // Enviar mensaje al grupo parroquial
  socket.on('enviarMensajeGrupo', async ({ grupoId, mensaje }) => {
    const nuevoMensaje = new Mensaje({
      emisor: socket.userInfo._id,
      mensaje,
      fechaEnvio: new Date(),
    });

    await nuevoMensaje.save();

    const grupo = await chat.findById(grupoId);
    grupo.mensajes.push(nuevoMensaje);
    await grupo.save();

    io.to(grupoId).emit('nuevoMensajeGrupo', nuevoMensaje);
  });

  socket.on('join-channel', (channelId) => {
    socket.join(channelId);
    console.log(`Usuario ${socket.id} se unió al canal ${channelId}.`);

    // Notificar a los demás en el canal que un usuario se unió
    socket.broadcast.to(channelId).emit('user-joined', {
        signal: null, // No hay señal inicialmente cuando un usuario se une
        callerID: socket.id, // Usar socket.id como callerID
        userId: socket.userInfo._id // Opcional: incluir el ID del usuario
    });
    
    // También puedes enviar la lista de usuarios actuales en el canal
    const usersInChannel = [...io.sockets.adapter.rooms.get(channelId)];
    socket.emit('all-users', usersInChannel);

  console.log(`Usuario ${socket.id} se unió al canal ${channelId}`);

  socket.on('signal', (data) => {
    // Enviar la señal al usuario correspondiente
    io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    console.log(socket)
  });
  
  socket.on('leave-channel', (channelId) => {
    socket.leave(channelId);
    console.log(`Usuario ${socket.id} salió del canal ${channelId}.`);
    // Notifica a los demás usuarios en el canal que un usuario salió
    socket.broadcast.to(channelId).emit('user-left', socket.id);
  });
  

 // Desconectar al usuario
 socket.on('disconnect', () => {
  console.log(`Cliente desconectado: ${socket.id}`);
  if (userId) {
    delete usuariosConectados[userId]; // Eliminar de la lista de conectados
    io.emit('actualizarUsuariosConectados', Object.values(usuariosConectados));
  }
});

});


socket.on('leave-channel', (channelId) => {
  socket.leave(channelId);
  console.log(`Usuario ${socket.id} salió del canal ${channelId}.`);
  // Notifica a los demás usuarios en el canal que un usuario salió
  socket.broadcast.to(channelId).emit('user-left', socket.id);
});

  // Emitir lista actualizada de usuarios conectados (sin incluir al usuario actual)

  socket.emit('actualizarUsuariosConectados', Object.values(usuariosConectados).filter(u => u.userInfo._id !== userId));



  // Enviar los mensajes no leídos cuando el usuario se conecta
  (async () => {
    try {
      const mensajesNoLeidos = await Mensaje.find({ receptor: userId, leido: false });

      if (mensajesNoLeidos.length > 0) {
        // Emitir los mensajes no leídos al usuario conectado
        mensajesNoLeidos.forEach((mensaje) => {
          socket.emit('nuevoMensaje', {
            emisorId: mensaje.emisor,
            mensaje: mensaje.mensaje,
            fechaEnvio: mensaje.fechaEnvio
          });
        });

        // Marcar los mensajes como leídos
        await Mensaje.updateMany(
          { receptor: userId, leido: false },
          { $set: { leido: true } }
        );
      }
    } catch (err) {
      console.error('Error al buscar mensajes no leídos:', err);
    }
  })();

  // Cargar historial de chat cuando el usuario selecciona un receptor
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

  socket.on('cargarHistorialGrupal', async ({ receptorId }) => {
    try {
      // Buscar todos los mensajes donde el receptor es el grupo (receptorId)
      const historial = await Mensaje.find({
        receptor: receptorId // El receptor es el ID del grupo (chat grupal)
      }).sort({ fechaEnvio: 1 });

      // Enviar el historial de mensajes al cliente
      socket.emit('historialMensajes', historial);
     
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    }
  });
  // Enviar un mensaje a otro usuario
  socket.on('enviarMensaje', async ({ receptorId, mensaje }) => {
    try {
      const nuevoMensaje = new Mensaje({
        emisor: userId,
        receptor: receptorId,
        mensaje,
        fechaEnvio: new Date()
      });

      await nuevoMensaje.save(); // Guardar en la base de datos

      // Enviar el mensaje si el receptor está conectado
      if (usuariosConectados[receptorId]) {
        socket.to(usuariosConectados[receptorId].socketId).emit('nuevoMensaje', {
          emisor: userId,
          mensaje,
          fechaEnvio: nuevoMensaje.fechaEnvio,
          leido: true
        });
      
      } else {
        console.log('Receptor no está conectado, el mensaje se guardará en la base de datos');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  });

  socket.on('verificarConexion', (userId, callback) => {
    const isConnected = usuariosConectados.hasOwnProperty(userId);
    console.log(usuariosConectados)
    callback(isConnected);
});

  // Desconectar al usuario
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
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
