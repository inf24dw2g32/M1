const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) throw new Error('Usuário inválido');

    req.user = user;
    console.log('Usuário autenticado:', user.email);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

