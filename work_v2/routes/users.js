const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models');

router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });

  const users = await User.findAll();
  res.json(users);
});

module.exports = router;
