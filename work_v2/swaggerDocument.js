// swaggerDocument.js
const yaml = require('yamljs');
require('dotenv').config();

const pacientes = yaml.load('./docs/pacientes.yaml');
const medicos = yaml.load('./docs/medicos.yaml');
const consultas = yaml.load('./docs/consultas.yaml');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Agendamento de Consultas',
    version: '1.0.0',
    description: 'Documentação da API para gestão de pacientes, médicos e consultas',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
    },
  ],
  components: {
    securitySchemes: {
      googleOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: {
              openid: 'Acesso ao perfil do usuário',
              email: 'Acesso ao email do usuário',
              profile: 'Acesso ao perfil público do usuário',
            },
          },
        },
      },
    },
  },
  security: [
    {
      googleOAuth: [],
    },
  ],
};

const swaggerDocument = {
  ...swaggerDefinition,
  paths: {
    ...pacientes.paths,
    ...medicos.paths,
    ...consultas.paths,
  },
};

module.exports = swaggerDocument;
