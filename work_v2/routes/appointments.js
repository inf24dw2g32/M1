const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Appointment, Doctor, User } = require('../models');

// Listar todas as consultas (admin) ou do próprio usuário
router.get('/', auth, async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Doctor, attributes: ['id', 'name'] }, // Inclui Doutor, pode limitar atributos
        { model: User, attributes: ['id', 'name'] }    // Inclui Utilizador, pode limitar atributos
      ]
    });
    res.json(appointments);
  } catch (error) {
    console.error('Erro ao listar consultas:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao listar consultas.' });
  }
});

// Criar consulta
router.post('/', auth, async (req, res) => {
  const { date, time, notes, doctor_id } = req.body; // Desestrutura para pegar apenas os campos esperados

  // Validação básica (pode expandir com mais verificações de formato, etc.)
  if (!date || !time || !doctor_id) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando: date, time, doctor_id.' });
  }

  try {
    // Opcional: Verificar se o doctor_id existe
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
        return res.status(400).json({ error: 'ID do médico inválido.' });
    }

    // Cria a consulta, associando ao utilizador autenticado
    const appointment = await Appointment.create({
      date,
      time,
      notes,
      doctor_id,
      userId: req.user.id // Garante que a consulta é associada ao utilizador logado
    });

    // Opcional: Buscar a consulta criada com os dados do médico e usuário para a resposta
    const createdAppointment = await Appointment.findByPk(appointment.id, {
        include: [
            { model: Doctor, attributes: ['id', 'name'] },
            { model: User, attributes: ['id', 'name'] }
        ]
    });


    res.status(201).json(createdAppointment); // 201 Created

  } catch (error) {
    console.error('Erro ao criar consulta:', error);
    // Pode adicionar tratamento para SequelizeUniqueConstraintError se adicionar restrições
    // Ou outros erros específicos (ex: data/hora inválida)
    res.status(500).json({ error: 'Erro interno do servidor ao criar consulta.' });
  }
});

// Editar consulta
router.put('/:id', auth, async (req, res) => {
  const appointmentId = req.params.id;
  // Decida quais campos podem ser atualizados e pegue-os do body
  const { date, time, notes, doctor_id } = req.body;

  try {
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    // Verificação de autorização
    if (req.user.role !== 'admin' && appointment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Não tem permissão para editar esta consulta.' });
    }

    // Opcional: Verificar se o novo doctor_id (se fornecido) existe
    if (doctor_id !== undefined) {
        const doctor = await Doctor.findByPk(doctor_id);
        if (!doctor) {
            return res.status(400).json({ error: 'ID do médico inválido.' });
        }
    }

    // Cria um objeto com os campos a serem atualizados, apenas se existirem no body
    const updateFields = {};
    if (date !== undefined) updateFields.date = date;
    if (time !== undefined) updateFields.time = time;
    if (notes !== undefined) updateFields.notes = notes;
    if (doctor_id !== undefined) updateFields.doctor_id = doctor_id;

     // Se não houver campos para atualizar no body, retorna 400
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'Nenhum campo de atualização fornecido.' });
    }


    await appointment.update(updateFields);

    // Opcional: Buscar a consulta atualizada com os dados do médico e usuário para a resposta
    const updatedAppointment = await Appointment.findByPk(appointment.id, {
        include: [
            { model: Doctor, attributes: ['id', 'name'] },
            { model: User, attributes: ['id', 'name'] }
        ]
    });

    res.json(updatedAppointment);

  } catch (error) {
    console.error(`Erro ao editar consulta com ID ${appointmentId}:`, error);
    // Pode adicionar tratamento para SequelizeForeignKeyConstraintError se mudar doctor_id para inválido
    res.status(500).json({ error: 'Erro interno do servidor ao editar consulta.' });
  }
});

// Eliminar consulta
router.delete('/:id', auth, async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    // Verificação de autorização
    if (req.user.role !== 'admin' && appointment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Não tem permissão para eliminar esta consulta.' });
    }

    await appointment.destroy();

    // Resposta de sucesso (usando 204 No Content)
    res.status(204).send(); // 204 significa sucesso e sem corpo na resposta

  } catch (error) {
    console.error(`Erro ao eliminar consulta com ID ${appointmentId}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao eliminar consulta.' });
  }
});

module.exports = router;

