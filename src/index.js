    const express = require('express');
    const cors = require('cors');
   // const memberRoutes = require('./routers/members');
    const userRoutes = require('./routers/userRouter');
    const connectDB = require('./db/conexion');
    const app = express();
    const PORT = process.env.PORT || 3001;
    const corsOptions = {
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization'
    };

    connectDB();
app.use(cors(corsOptions));
app.use(express.json());

app.use(userRoutes); // Asegúrate de que la ruta sea correcta

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
