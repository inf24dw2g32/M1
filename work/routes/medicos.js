const express = require('express');
const Medico = require('../models/Medico');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Médicos
 *   description: Endpoints para gerenciar médicos
 */

/**
 * @swagger
 * path:
 *  /medicos:
 *    get:
 *      summary: Retorna uma lista de médicos
 *      tags: [Médicos]
 *      responses:
 *        200:
 *          description: Lista de médicos
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      description: O ID do médico
 *                    nome:
 *                      type: string
 *                      description: O nome do médico
 *        500:
 *          description: Erro ao buscar médicos
 */
router.get('/', async (req, res) => {
    try {
        const medicos = await Medico.findAll(); // Recupera todos os médicos
        res.json(medicos);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * path:
 *  /medicos/{id}:
 *    get:
 *      summary: Retorna um médico pelo ID
 *      tags: [Médicos]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID do médico a ser retornado
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Médico encontrado
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
 *          description: Médico não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id); // Encontra o médico pelo ID
        if (!medico) {
            return res.status(404).json({ message: 'Médico não encontrado' });
        }
        res.json(medico);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * path:
 *  /medicos:
 *    post:
 *      summary: Cria um novo médico
 *      tags: [Médicos]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                nome:
 *                  type: string
 *                  description: O nome do médico
 *      responses:
 *        201:
 *          description: Médico criado com sucesso
 *        400:
 *          description: Dados inválidos ou ausentes
 */
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

/**
 * @swagger
 * path:
 *  /medicos/{id}:
 *    put:
 *      summary: Atualiza os dados de um médico
 *      tags: [Médicos]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID do médico a ser atualizado
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
 *                  description: O nome do médico
 *      responses:
 *        200:
 *          description: Médico atualizado com sucesso
 *        400:
 *          description: Erro ao atualizar médico
 *        404:
 *          description: Médico não encontrado
 */
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

/**
 * @swagger
 * path:
 *  /medicos/{id}:
 *    delete:
 *      summary: Deleta um médico pelo ID
 *      tags: [Médicos]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID do médico a ser eliminado
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Médico removido com sucesso
 *        404:
 *          description: Médico não encontrado
 */
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
