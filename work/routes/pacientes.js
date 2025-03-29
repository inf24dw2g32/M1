const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');

// Rota para obter todos os pacientes (com id, nome, idade)
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            attributes: ['id', 'nome', 'idade'] // Retorna apenas id, nome e idade
        });
        res.json(pacientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para obter um paciente pelo ID (com todos os dados, incluindo criado_em e atualizado_em)
router.get('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        // Retorna todos os dados do paciente, incluindo id, nome, idade, criado_em e atualizado_em
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para criar um novo paciente
router.post('/', async (req, res) => {
    try {
        const { nome, idade } = req.body; // Incluindo a idade como campo obrigatório
        if (!nome || !idade) {
            return res.status(400).json({ message: 'O nome e a idade do paciente são obrigatórios' });
        }
        const novoPaciente = await Paciente.create({ nome, idade });
        res.status(201).json(novoPaciente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para atualizar um paciente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, idade } = req.body;
        const paciente = await Paciente.findByPk(id);

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        if (!nome || !idade) {
            return res.status(400).json({ message: 'O nome e a idade do paciente são obrigatórios' });
        }

        paciente.nome = nome;
        paciente.idade = idade;
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
