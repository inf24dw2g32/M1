const express = require('express');
const Consulta = require('../models/Consulta');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Consultas
 *   description: Endpoints para gerenciar consultas
 */

/**
 * @swagger
 * path:
 *  /consultas:
 *    get:
 *      summary: Retorna uma lista de consultas
 *      tags: [Consultas]
 *      responses:
 *        200:
 *          description: Lista de consultas
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      description: O ID da consulta
 *                    data:
 *                      type: string
 *                      format: date
 *                      description: A data da consulta
 *                    pacienteId:
 *                      type: integer
 *                      description: O ID do paciente relacionado
 *                    medicoId:
 *                      type: integer
 *                      description: O ID do médico relacionado
 *        500:
 *          description: Erro ao buscar consultas
 */
router.get('/', async (req, res) => {
    try {
        const consultas = await Consulta.findAll(); // Recupera todas as consultas
        res.json(consultas);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * path:
 *  /consultas/{id}:
 *    get:
 *      summary: Retorna uma consulta pelo ID
 *      tags: [Consultas]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID da consulta a ser retornada
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Consulta encontrada
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  data:
 *                    type: string
 *                    format: date
 *                  pacienteId:
 *                    type: integer
 *                  medicoId:
 *                    type: integer
 *        404:
 *          description: Consulta não encontrada
 */
router.get('/:id', async (req, res) => {
    try {
        const consulta = await Consulta.findByPk(req.params.id); // Encontra consulta pelo ID
        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada' });
        }
        res.json(consulta);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * path:
 *  /consultas:
 *    post:
 *      summary: Cria uma nova consulta
 *      tags: [Consultas]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  format: date
 *                  description: A data da consulta
 *                pacienteId:
 *                  type: integer
 *                  description: O ID do paciente relacionado
 *                medicoId:
 *                  type: integer
 *                  description: O ID do médico relacionado
 *      responses:
 *        201:
 *          description: Consulta criada com sucesso
 *        400:
 *          description: Dados inválidos ou ausentes
 */
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

/**
 * @swagger
 * path:
 *  /consultas/{id}:
 *    put:
 *      summary: Atualiza os dados de uma consulta
 *      tags: [Consultas]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID da consulta a ser atualizada
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  format: date
 *                pacienteId:
 *                  type: integer
 *                medicoId:
 *                  type: integer
 *      responses:
 *        200:
 *          description: Consulta atualizada com sucesso
 *        400:
 *          description: Dados inválidos ou ausentes
 *        404:
 *          description: Consulta não encontrada
 */
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

/**
 * @swagger
 * path:
 *  /consultas/{id}:
 *    delete:
 *      summary: Deleta uma consulta pelo ID
 *      tags: [Consultas]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID da consulta a ser eliminada
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Consulta removida com sucesso
 *        404:
 *          description: Consulta não encontrada
 */
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

