require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { sequelize } = require('./models');
const routes = require('./routes'); // <-- este importa automaticamente as rotas
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Passport Google OAuth
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${PORT}/auth/google/callback`, // URL do Google OAuth callback
},
(accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    nome: profile.displayName,
    email: profile.emails[0].value,
    foto: profile.photos[0].value,
    role: 'user', // ou definir baseado na BD se necessário
  };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware para inicializar o Passport e a sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: true,
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
      url: `http://localhost:${PORT}`, // Adicionando prefixo para rotas API
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      oauth2: {
        type: 'oauth2',
        flows: { // Corrigido de 'flow' para 'flows'
          implicit: { // Configuração do fluxo implicit
            authorizationUrl: `http://localhost:${PORT}/auth/google`, // URL para autorização com Google
            scopes: {
              'profile': 'Acesso ao perfil do utilizador',
              'email': 'Acesso ao email do utilizador'
            }
          }
        }
      }
    }
  },
  security: [
    {
      oauth2: ['profile', 'email']
    }
  ]
};

// Carregar múltiplos ficheiros YAML
const usersDocs = yaml.load('./docs/users.yaml');
const doctorsDocs = yaml.load('./docs/doctors.yaml');
const appointmentsDocs = yaml.load('./docs/appointments.yaml');

// Combinar tudo num único objeto Swagger
const swaggerDocument = {
  ...swaggerDefinition,
  paths: {
    ...usersDocs.paths,
    ...doctorsDocs.paths,
    ...appointmentsDocs.paths,
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  oauth2RedirectUrl: `http://localhost:${PORT}/api/oauth2-redirect`, // URL de redirecionamento após login
}));

// Middlewares
app.use(cors());
app.use(express.json());

// 📌 Usa todas as rotas definidas em routes/index.js
app.use('/', routes);

// Sincronizar BD e iniciar servidor
sequelize.sync({ alter: true }).then(() => {
  console.log('Base de dados sincronizada');
  app.listen(PORT, () => {
    console.log(` API disponível em http://localhost:${PORT}/api-docs`);
    console.log(` Login Google: http://localhost:${PORT}/auth/google`);
  });
});
