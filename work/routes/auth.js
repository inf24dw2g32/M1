const express = require('express');
const passport = require('passport');
const router = express.Router();

// Rota para redirecionar para o Google OAuth
router.get('/login', passport.authenticate('google', {
    scope: ['profile', 'email'] // Define os escopos de acesso que você deseja
}));

// Rota de callback após a autenticação do Google
router.get('/callback', passport.authenticate('google', { session: false }), (req, res) => {
    // Se a autenticação for bem-sucedida, 'req.user' terá as informações do usuário
    res.json({
        message: 'Autenticação bem-sucedida',
        user: req.user, // Aqui você pode pegar as informações do usuário
    });
});

module.exports = router;
