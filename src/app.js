const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Definição das rotas
app.use('/api/users', userRoutes);

module.exports = app;
