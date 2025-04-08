require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { sequelize, User } = require('./models');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Passport Google OAuth

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL, // Certifique-se de que esta variável está definida no .env
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Lógica para verificar ou criar o usuário na base de dados
    let user = await User.findOne({ where: { email: profile.emails[0].value } });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        google_id: profile.id,
        role: 'user',
      });
    }

    return done(null, user);
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return done(error, null);
  }
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

// Rotas de autenticação
app.use('/auth', authRoutes); // Usa as rotas de autenticação com o prefixo '/auth'


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
