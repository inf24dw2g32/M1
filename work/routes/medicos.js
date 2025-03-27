const express = require('express');
const Medico = require('../models/Medico');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const medicos = await Medico.findAll();
        res.json(medicos);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const medico = await Medico.create(req.body);
        res.status(201).json(medico);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;