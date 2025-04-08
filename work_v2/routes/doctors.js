const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Doctor, Specialty } = require('../models');

// Lista todos os médicos
router.get('/', auth, async (req, res) => {
  const doctors = await Doctor.findAll({ include: Specialty });
  res.json(doctors);
});

// Adiciona médico (admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });

  const doctor = await Doctor.create(req.body);
  res.json(doctor);
});

module.exports = router;
