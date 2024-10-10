const express = require('express');
const http = require('http'); // Requerimos http para integrar socket.io
const cors = require('cors');
const socketIo = require('socket.io'); // Requerimos socket.io
const connectDB = require('./db/conexion'); // Conexión a la base de datos

// Rutas
const miembroRoutes = require('./routes/miembro.routes');
const administradorRoutes = require('./routes/administradores.routes');
const actividadRoutes = require('./routes/activity.routes');
const postRoutes = require('./routes/post.routes');
const arquidiocesisRoutes = require('./routes/arquidiocesis.routes');
const diocesisRoutes = require('./routes/diocesis.routes');
const parroquiaRoutes = require('./routes/parroquia.routes');
const Notificacion = require('./notificaciones/notificacion');

const app = express();
const server = http.createServer(app); // Usamos http.createServer para Socket.IO
const io = socketIo(server); // Inicializamos Socket.IO con el servidor HTTP

const PORT = process.env.PORT || 3001;

const allowedOrigins = ['http://localhost:3000', 'https://tu-frontend-en-produccion.com'];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Permitir origen
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
};

// Conexión a la base de datos
connectDB();

app.use(cors(corsOptions));
app.use(express.json()); // Para recibir y enviar JSON

// Configurar rutas
app.use('/api/miembros', miembroRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/post', postRoutes);
app.use('/api/', actividadRoutes);
app.use('/api/archdioceses', arquidiocesisRoutes);
app.use('/api/diocesis', diocesisRoutes);
app.use('/api/parroquia', parroquiaRoutes);

// Asociar Socket.IO al app para acceder desde los controladores
app.set('socketio', io);

// Escuchar eventos de conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado', socket.id);
    

    // Ejemplo: Manejar la desconexión de un cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
