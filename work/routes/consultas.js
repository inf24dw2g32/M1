const express = require('express');
const Consulta = require('../models/Consulta');
const Paciente = require('../models/Paciente');
const Medico = require('../models/Medico');

const router = express.Router();

// 🔍 Buscar todas as consultas, incluindo os dados do paciente e do médico
router.get('/', async (req, res) => {
    try {
        const consultas = await Consulta.findAll({
            include: [
                { model: Paciente, as: 'paciente' },
                { model: Medico, as: 'medico' }
            ]
        });
        res.json(consultas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔍 Buscar uma consulta pelo ID, incluindo paciente e médico
router.get('/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id, {
            include: [
                { model: Paciente, as: 'paciente' },
                { model: Medico, as: 'medico' }
            ]
        });

        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }

        res.json(consulta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📅 Criar nova consulta
router.post('/', async (req, res) => {
    try {
        const { data, pacienteId, medicoId, descricao } = req.body;

        if (!data || !pacienteId || !medicoId) {
            return res.status(400).json({ message: 'Data, pacienteId e medicoId são obrigatórios' });
        }

        const consulta = await Consulta.create({ data, pacienteId, medicoId, descricao });

        res.status(201).json(consulta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✏️ Atualizar uma consulta
router.put('/:id', async (req, res) => {
    try {
        const { data, pacienteId, medicoId, descricao } = req.body;
        const { id } = req.params;

        const consulta = await Consulta.findByPk(id);
        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }

        if (!data || !pacienteId || !medicoId) {
            return res.status(400).json({ message: 'Data, pacienteId e medicoId são obrigatórios' });
        }

        await consulta.update({ data, pacienteId, medicoId, descricao });

        res.json(consulta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🗑 Excluir uma consulta
router.delete('/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id);
        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }

        await consulta.destroy();
        res.json({ message: 'Consulta removida com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
