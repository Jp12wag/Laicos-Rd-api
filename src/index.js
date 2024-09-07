const express = require('express');
const cors = require('cors');
const memberRoutes = require('./routers/members');
const connectDB = require('./db/conexion');
const app = express();
const PORT = 5000;


connectDB();
// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/members', memberRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
