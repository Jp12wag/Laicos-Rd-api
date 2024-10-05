const express = require('express');
const cors = require('cors');
const connectDB = require('./db/conexion'); // Conexión a la base de datos
const miembroRoutes = require('./routes/miembro.routes');
const administradorRoutes = require('./routes/administradores.routes');
const actividadRoutes = require('./routes/activity.routes');
const post= require('./routes/post.routes');
const arquidiocesis=require('./routes/arquidiocesis.routes');
const notificacion= require('./notificaciones/notificacion');

const app = express();
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
// app.use('/api/members', memberRoutes);
app.use('/api/miembros', miembroRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/post', post);
app.use('/api/', actividadRoutes);
app.use('/api/', arquidiocesis);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});