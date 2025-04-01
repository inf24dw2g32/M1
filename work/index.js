const express = require('express');
const passport = require('passport');
const session = require('express-session'); // Para gerenciar sessões
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

// Configuração do Passport Google OAuth
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configuração do Passport (Autenticação via Google)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/auth/google/callback`,
  },
  (accessToken, refreshToken, profile, done) => {
    // Salvar ou atualizar informações do usuário no banco de dados (opcional)
    const user = {
      id: profile.id,
      nome: profile.displayName,
      email: profile.emails[0].value,
      foto: profile.photos[0].value
    };
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware para inicializar o Passport e a sessão
app.use(session({
  secret: 'secret_key', // Troque por uma chave segura
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Configuração do Swagger
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
app.use('/auth', authRoutes); // Rota de autenticação
app.use('/pacientes', pacientesRoutes); // Rota de pacientes
app.use('/medicos', medicosRoutes); // Rota de médicos
app.use('/consultas', consultasRoutes); // Rota de consultas

// Iniciar o servidor
app.listen(PORT, function () {
    console.log(`App running on http://localhost:${PORT}/api-docs`);
});
