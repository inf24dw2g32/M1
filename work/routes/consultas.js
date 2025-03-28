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

router.get('/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }
        res.json(consulta);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const { data, pacienteId, medicoId } = req.body;
        if (!data || !pacienteId || !medicoId) {
            return res.status(400).json({ message: 'Data, pacienteId e medicoId são obrigatórios' });
        }
        const consulta = await Consulta.create({ data, pacienteId, medicoId });
        res.status(201).json(consulta);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, pacienteId, medicoId } = req.body;

        const consulta = await Consulta.findByPk(id);
        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }

        if (!data || !pacienteId || !medicoId) {
            return res.status(400).json({ message: 'Data, pacienteId e medicoId são obrigatórios' });
        }

        consulta.data = data;
        consulta.pacienteId = pacienteId;
        consulta.medicoId = medicoId;
        await consulta.save();

        res.json(consulta);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }

        await consulta.destroy();
        res.json({ message: 'Consulta removida com sucesso' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;


