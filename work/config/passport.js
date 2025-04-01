const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config(); // Para pegar as variáveis de ambiente

// Configura o Passport para usar o OAuth2 da Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Seu client ID do Google
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Seu client secret do Google
    callbackURL: process.env.GOOGLE_CALLBACK_URL, // URL de callback configurada no Google
}, (accessToken, refreshToken, profile, done) => {
    // Este callback será chamado após a autenticação bem-sucedida com o Google
    // O 'profile' contém as informações do usuário retornadas pelo Google
    return done(null, profile);
}));

// Configuração da serialização do usuário (opcional)
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});