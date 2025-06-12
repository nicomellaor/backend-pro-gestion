const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const conectarDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middleware/errorHandler');

// Cargar variables de entorno
dotenv.config();

const app = express();

// 1) Conectar a la base de datos
conectarDB();

// 2) Middlewares globales
app.use(cors()); // habilita CORS para todas las rutas
app.use(express.json()); // parsea JSON en el body

// 3) Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// 4) Ruta por defecto (opcional: bienvenida o documentación mínima)
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Pro-Gestión!');
});

// 5) Middleware de manejo de errores (debe ir después de las rutas)
app.use(errorHandler);

// 6) Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
