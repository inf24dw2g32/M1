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

router.get('/:id', async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id);
        if (!medico) {
            return res.status(404).json({ message: 'Médico não encontrado' });
        }
        res.json(medico);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'O nome do médico é obrigatório' });
        }
        const medico = await Medico.create({ nome });
        res.status(201).json(medico);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        const medico = await Medico.findByPk(id);
        if (!medico) {
            return res.status(404).json({ message: 'Médico não encontrado' });
        }

        if (!nome) {
            return res.status(400).json({ message: 'O nome do médico é obrigatório' });
        }

        medico.nome = nome;
        await medico.save();
        res.json(medico);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id);
        if (!medico) {
            return res.status(404).json({ message: 'Médico não encontrado' });
        }

        await medico.destroy();
        res.json({ message: 'Médico removido com sucesso' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
