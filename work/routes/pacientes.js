const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');

// Rota para obter todos os pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.findAll();
        res.json(pacientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para obter um paciente pelo ID
router.get('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para criar um novo paciente
router.post('/', async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'O nome do paciente é obrigatório' });
        }
        const novoPaciente = await Paciente.create({ nome });
        res.status(201).json(novoPaciente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para atualizar um paciente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        const paciente = await Paciente.findByPk(id);

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        if (!nome) {
            return res.status(400).json({ message: 'O nome do paciente é obrigatório' });
        }

        paciente.nome = nome;
        await paciente.save();
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para deletar um paciente
router.delete('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        await paciente.destroy();
        res.json({ message: 'Paciente eliminado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;