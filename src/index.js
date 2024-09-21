const express = require('express');
const cors = require('cors');
const connectDB = require('./db/conexion'); // Conexión a la base de datos
// const userRoutes = require('./routes/userRoutes'); 
// const memberRoutes = require('./routes/memberRoutes'); 
const miembroRoutes = require('./routes/miembro.routes');
const administradorRoutes = require('./routes/administradores.routes');
const cleroRoutes = require('./routes/clero.routes');
const parroquiaRoutes = require('./routes/parroquia.routes');
//const unidadEpiscopalRoutes = require('./routes/unidadEpiscopal.routes');
const arquidiocesisRoutes = require('./routes/arquidiocesis.routes');
const obispoRoutes = require('./routes/obispo.routes');
const diocesisRoutes = require('./routes/diocesis.routes');


const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

// Conexión a la base de datos
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Para recibir y enviar JSON



// app.use('/api/members', memberRoutes);
app.use('/api/miembros', miembroRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/clero', cleroRoutes);
app.use('/api/parroquias', parroquiaRoutes);
//app.use('/api/unidades-episcopales', unidadEpiscopalRoutes);
app.use('/api/arquidiocesis', arquidiocesisRoutes);
app.use('/api/obispos', obispoRoutes);
app.use('/api/diocesis', diocesisRoutes);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});