const express = require('express');
const Consulta = require('../models/Consulta');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const consultas = await Consulta.findAll();
        res.json(consultas);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const consulta = await Consulta.create(req.body);
        res.status(201).json(consulta);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
