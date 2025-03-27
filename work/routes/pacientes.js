const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente'); 

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Endpoints para gerir Pacientes
 */

/**
 * @swagger
 * path:
 *  /pacientes:
 *    get:
 *      summary: Retorna uma lista de pacientes
 *      tags: [Pacientes]
 *      responses:
 *        200:
 *          description: Lista de pacientes
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      description: O ID do paciente
 *                    nome:
 *                      type: string
 *                      description: O nome do paciente
 *        500:
 *          description: Erro ao buscar pacientes
 */
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.findAll(); // Recupera todos os pacientes
        res.json(pacientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * path:
 *  /pacientes/{id}:
 *    get:
 *      summary: Retorna um paciente pelo ID
 *      tags: [Pacientes]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID do paciente a ser retornado
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Paciente encontrado
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  nome:
 *                    type: string
 *        404:
 *          description: Paciente não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id); // Encontra paciente pelo ID
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * path:
 *  /pacientes:
 *    post:
 *      summary: Cria um novo paciente
 *      tags: [Pacientes]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                nome:
 *                  type: string
 *                  description: O nome do paciente
 *      responses:
 *        201:
 *          description: Paciente criado com sucesso
 *        400:
 *          description: Erro ao criar paciente
 */
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

/**
 * @swagger
 * path:
 *  /pacientes/{id}:
 *    put:
 *      summary: Atualiza os dados de um paciente
 *      tags: [Pacientes]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID do paciente a ser atualizado
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                nome:
 *                  type: string
 *                  description: O nome do paciente
 *      responses:
 *        200:
 *          description: Paciente atualizado com sucesso
 *        400:
 *          description: Erro ao atualizar paciente
 *        404:
 *          description: Paciente não encontrado
 */
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

/**
 * @swagger
 * path:
 *  /pacientes/{id}:
 *    delete:
 *      summary: Deleta um paciente pelo ID
 *      tags: [Pacientes]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID do paciente a ser eliminado
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Paciente removido com sucesso
 *        404:
 *          description: Paciente não encontrado
 */
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

