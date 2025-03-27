const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', passport.authenticate('oauth2'));

router.get('/callback', passport.authenticate('oauth2', { session: false }), (req, res) => {
    res.json({ message: 'Autenticação bem-sucedida', user: req.user });
});

module.exports = router;