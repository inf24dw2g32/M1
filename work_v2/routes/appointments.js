const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Appointment, Doctor, User } = require('../models');

// Listar todas as consultas (admin) ou do próprio usuário
router.get('/', auth, async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
  const appointments = await Appointment.findAll({ where, include: [Doctor, User] });
  res.json(appointments);
});

// Criar consulta
router.post('/', auth, async (req, res) => {
  const appointment = await Appointment.create({ ...req.body, userId: req.user.id });
  res.json(appointment);
});

// Editar consulta
router.put('/:id', auth, async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);

  if (!appointment) return res.status(404).json({ error: 'Consulta não encontrada' });

  if (req.user.role !== 'admin' && appointment.userId !== req.user.id)
    return res.status(403).json({ error: 'Acesso negado' });

  await appointment.update(req.body);
  res.json(appointment);
});

// Eliminar consulta
router.delete('/:id', auth, async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);

  if (!appointment) return res.status(404).json({ error: 'Consulta não encontrada' });

  if (req.user.role !== 'admin' && appointment.userId !== req.user.id)
    return res.status(403).json({ error: 'Acesso negado' });

  await appointment.destroy();
  res.json({ message: 'Consulta removida' });
});

module.exports = router;

