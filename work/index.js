const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const medicosRoutes = require('./routes/medicos');
const consultasRoutes = require('./routes/consultas');
const sequelize = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());

// Configuração do Swagger mantida no index.js
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de Agendamento de Consultas',
        version: '1.0.0',
        description: 'Documentação da API para gestão de pacientes, médicos e consultas',
    },
    servers: [
        {
            url: `http://localhost:${PORT}`,
            description: 'Servidor local',
        },
    ],
};

// Carregar múltiplos ficheiros YAML
const pacientesDocs = yaml.load('./docs/pacientes.yaml');
const medicosDocs = yaml.load('./docs/medicos.yaml');
const consultasDocs = yaml.load('./docs/consultas.yaml');

// Combinar tudo num único objeto Swagger
const swaggerDocument = {
    ...swaggerDefinition,
    paths: {
        ...pacientesDocs.paths,
        ...medicosDocs.paths,
        ...consultasDocs.paths,
    },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sincronizar BD
sequelize.sync()
    .then(() => console.log('Base de dados sincronizada'))
    .catch(err => console.error('Erro ao sincronizar BD:', err));

// Rotas
app.use('/auth', authRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/medicos', medicosRoutes);
app.use('/consultas', consultasRoutes);

// Iniciar o servidor
app.listen(PORT, function () {
    console.log(`App running on http://localhost:${PORT}`);
});
