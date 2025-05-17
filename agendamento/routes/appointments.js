const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware de autenticação
// Importa modelos. Assumimos que os aliases 'paciente', 'medico', 'specialty'
// estão definidos nas suas associações Sequelize.
const { Appointment, User, Doctor, Specialty } = require('../models');

// Aplicar middleware de autenticação a todas as rotas de agendamentos
router.use(auth);

// Helper para formatar a resposta da consulta para o formato da API (id, data, descricao, specialty)
// Ajuste os acessos a .medico e .specialty conforme os aliases definidos nos seus modelos.
const formatAppointmentResponse = (appointment) => {
    if (!appointment) return null;

    // Acessa as associações usando os aliases definidos nos modelos (ex: as: 'medico', as: 'specialty')
    const doctor = appointment.medico; // Assume que Appointment.belongsTo(Doctor, { as: 'medico', ... })
    const specialty = doctor && doctor.specialty; // Assume que Doctor.belongsTo(Specialty, { as: 'specialty', ... })

    // Combinar date e time da BD para 'data' (ISO 8601 string)
    // Adapte a formatação da hora conforme necessário, dependendo do formato da sua coluna TIME na DB.
    // Sequelize DataTypes.TIME geralmente armazena 'HH:MM:SS' ou 'HH:MM:SS.sss'.
    // Esta é uma forma simplificada, pode precisar de ajustar a formatação para 'HH:MM:SS' se necessário.
    // Se o seu campo time na DB for uma string 'HH:MM:SS', use appointment.time diretamente.
    // Se for um objeto Date/String que precisa de ser formatado, ajuste.
    // Assumindo que time é uma string 'HH:MM:SS' ou similar
    const timePart = appointment.time ? appointment.time : '00:00:00'; // Usa a string time diretamente se disponível
    // Adiciona 'Z' para indicar UTC, se a BD armazena em UTC. Se não, pode precisar de um offset de timezone.
    const apiData = appointment.date ? `${appointment.date}T${timePart}${timePart.includes('Z') ? '' : 'Z'}` : null;


    return {
        id: appointment.id,
        data: apiData, // Data e hora combinadas no formato ISO 8601
        descricao: appointment.notes, // Mapeia notes para descricao
        // Inclui a especialidade aninhada conforme o esquema OpenAPI do GET list
        specialty: specialty ? {
            id: specialty.id,
            name: specialty.name
        } : null
        // Não inclui pacienteId ou medicoId no nível superior para GETs conforme pedido no texto e YAML do GET list.
        // Se o GET por ID precisar deles (conforme o seu YAML da última vez), ajuste o handler do GET por ID ou formate aqui.
    };
};

// Helper para garantir que o utilizador autenticado é o dono da consulta ou é admin
const authorizeAppointmentAccess = (req, appointment) => {
    // Se não encontrou a consulta, não há acesso
    if (!appointment) return false;

    // Se o utilizador autenticado não existe ou não tem o campo 'role', nega o acesso (deveria ser tratado pelo middleware 'auth')
     if (!req.user || !req.user.role) return false;

    // Se o utilizador é admin, permite o acesso
    if (req.user.role === 'admin') {
        return true;
    }

    // Se a consulta pertence ao utilizador autenticado, permite o acesso
    // A coluna é user_id na BD. Assumimos que o modelo Sequelize mapeia user_id da BD
    // para a propriedade user_id na instância do modelo. Verifique se é 'user_id' ou 'userId'.
    const appointmentUserId = appointment.user_id; // Assumindo user_id na instância do modelo (verificar o seu modelo)

    if (req.user.id === appointmentUserId) {
        return true;
    }

    // Caso contrário, nega o acesso
    return false;
};


// GET /appointments - Retorna uma lista de consultas do utilizador autenticado (ou todas para admin), incluindo especialidade
// Corresponde ao esquema GET /appointments no OpenAPI (id, data, descricao, specialty)
router.get('/', async (req, res) => {
    try {
        // Filtra pelo ID do utilizador autenticado, a menos que seja admin
        const where = req.user.role === 'admin' ? {} : { user_id: req.user.id }; // Usa user_id conforme DB schema/modelo

        const appointments = await Appointment.findAll({
            where,
            // Seleciona os campos base necessários da tabela de agendamentos
            attributes: ['id', 'date', 'time', 'notes', 'user_id', 'doctor_id'], // Incluir FKs se necessário para lógica ou resposta detalhada
            include: [
                // Inclui Doutor e, através dele, a Especialidade para formatar a resposta
                // Adapte os aliases 'medico' e 'specialty' conforme as suas definições de associação
                {
                    model: Doctor,
                    as: 'medico', // Alias assumido para Appointment.belongsTo(Doctor)
                    attributes: ['id', 'name', 'specialty_id'], // Precisa de specialty_id do Doctor para incluir Specialty
                    include: [{
                        model: Specialty,
                        as: 'specialty', // Alias assumido para Doctor.belongsTo(Specialty)
                        attributes: ['id', 'name'] // Atributos da Especialidade
                    }]
                },
                // Opcional: Incluir o Utilizador (Paciente) - útil para admins ou para resposta detalhada.
                // Se não for necessário na resposta ou lógica, pode remover este include para performance.
                {
                     model: User,
                     as: 'paciente', // Alias assumido para Appointment.belongsTo(User)
                     attributes: ['id', 'name'] // Atributos do Utilizador (Paciente)
                }
            ],
            order: [['date', 'ASC'], ['time', 'ASC']] // Opcional: Ordenar resultados
        });

        // Formatar a lista de respostas para o formato da API desejado (id, data, descricao, specialty)
        const formattedAppointments = appointments.map(formatAppointmentResponse);

        res.json(formattedAppointments);

    } catch (error) {
        console.error('Erro ao listar consultas:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao listar consultas.' });
    }
});

// POST /appointments - Cria uma nova consulta
// Corresponde ao esquema POST /appointments no OpenAPI
router.post('/', async (req, res) => {
    // req.user é preenchido pelo middleware 'auth'
    const pacienteId = req.user.id; // ID do utilizador autenticado obtido do req.user
    // Desestrutura para pegar os campos esperados do body da requisição (conforme OpenAPI requestBody properties)
    // Assume que 'pacienteId' e 'descricao' no body são opcionais/ignorados se o user vier do auth
    const { data, medicoId, especialidadeId, descricao /*, pacienteId - ignorado se vier no body */ } = req.body;

    // Validação básica dos campos obrigatórios (conforme OpenAPI requestBody required)
    // Note que pacienteId não é validado aqui, pois vem do utilizador autenticado.
    if (!data || !medicoId || !especialidadeId) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando: data, medicoId, especialidadeId.' });
    }

    try {
        // Passo 1: Validar se o medicoId existe E se pertence à especialidadeId fornecida
        const doctor = await Doctor.findByPk(medicoId, {
             include: [{
                model: Specialty,
                as: 'specialty', // Alias assumido para Doctor.belongsTo(Specialty)
                attributes: ['id'] // Apenas precisamos do ID para validar
             }]
        });

        // Verifica se o médico foi encontrado E se a especialidade associada corresponde ao especialidadeId fornecido
        if (!doctor || !doctor.specialty || doctor.specialty.id !== especialidadeId) {
           return res.status(400).json({ error: 'Médico não encontrado ou não associado à especialidade fornecida.' });
        }

        // Passo 2: Preparar data e hora para inserção na BD
        // 'data' é uma string date-time (ISO 8601), precisamos separá-la em date e time
        const appointmentDateTime = new Date(data);

        // Verifica se a data é válida
        if (isNaN(appointmentDateTime.getTime())) {
             return res.status(400).json({ error: 'Formato de data e hora inválido.' });
        }

        const dbDate = appointmentDateTime.toISOString().split('T')[0]; // FormatoYYYY-MM-DD
        // Extrai a parte da hora e formata. O formato exato depende do tipo TIME da sua BD.
        // Sequelize DataTypes.TIME geralmente armazena 'HH:MM:SS' ou 'HH:MM:SS.sss'.
        // JavaScript Date.toTimeString() retorna algo como "HH:MM:SS GMT+..."
        // Precisamos apenas da parte HH:MM:SS.
        const dbTime = appointmentDateTime.toTimeString().split(' ')[0]; // Ex: "10:30:00"


        // Passo 3: Criar a consulta no banco de dados
        const appointment = await Appointment.create({
            date: dbDate, // Mapeia 'data' (parte da data) para 'date' na BD
            time: dbTime, // Mapeia 'data' (parte da hora formatada) para 'time' na BD
            notes: descricao, // Mapeia 'descricao' para 'notes' na BD
            user_id: pacienteId, // Mapeia 'pacienteId' (do auth) para 'user_id' na BD
            doctor_id: medicoId // Mapeia 'medicoId' para 'doctor_id' na BD
            // especialidadeId não é armazenado na tabela appointments, usado apenas para validação
        });

        // Passo 4: Buscar a consulta criada com os dados incluídos para retornar na resposta 201
        // O esquema OpenAPI 201 que forneceu inclui id, data, descricao, pacienteId, medicoId, especialidadeId.
        // Vamos buscar e retornar os detalhes completos incluindo associações para ser mais útil.
        const createdAppointmentDetails = await Appointment.findByPk(appointment.id, {
             // Seleciona os campos base da consulta criada
             attributes: ['id', 'date', 'time', 'notes', 'user_id', 'doctor_id'],
             include: [
                // Inclui o Médico e a Especialidade associada
                {
                    model: Doctor,
                    as: 'medico', // Alias assumido
                    attributes: ['id', 'name'],
                    include: [{
                        model: Specialty,
                        as: 'specialty', // Alias assumido
                        attributes: ['id', 'name']
                    }]
                },
                // Incluir o Utilizador (Paciente)
                 {
                     model: User,
                     as: 'paciente', // Alias assumido
                     attributes: ['id', 'name'] // Campos do Paciente
                 }
             ]
        });

        // Formata a resposta para o esquema OpenAPI 201.
        // O esquema 201 que forneceu é mais detalhado que o formato dos GETs.
        const detailedResponse = {
            id: createdAppointmentDetails.id,
            // Combina date e time da BD para 'data' (ISO 8601)
            data: `${createdAppointmentDetails.date}T${createdAppointmentDetails.time ? createdAppointmentDetails.time.toISOString().split('T')[1] : '00:00:00.000Z'}`,
            descricao: createdAppointmentDetails.notes, // Mapeia notes para descricao
            pacienteId: createdAppointmentDetails.user_id, // Incluir IDs brutos conforme o seu schema 201
            medicoId: createdAppointmentDetails.doctor_id, // Incluir IDs brutos
            especialidadeId: especialidadeId, // Incluir o especialidadeId que veio no request body (não armazenado na BD)

            // Opcional: Incluir objetos aninhados se o schema 201 os tiver
            // paciente: createdAppointmentDetails.paciente ? { id: createdAppointmentDetails.paciente.id, name: createdAppointmentDetails.paciente.name } : null,
            // medico: createdAppointmentDetails.medico ? { id: createdAppointmentDetails.medico.id, name: createdAppointmentDetails.medico.name } : null,
            // specialty: createdAppointmentDetails.medico && createdAppointmentDetails.medico.specialty ? { id: createdAppointmentDetails.medico.specialty.id, name: createdAppointmentDetails.medico.specialty.name } : null,
        };


        res.status(201).json(detailedResponse); // Retorna o objeto detalhado conforme o schema 201 desejado

    } catch (error) {
        console.error('Erro ao criar consulta:', error);
        // Tratamento de erro mais específico, ex: SequelizeForeignKeyConstraintError para doctor_id ou user_id inválido
        if (error.name === 'SequelizeForeignKeyConstraintError') {
             // Verifica qual FK falhou se possível, ou dá um erro genérico de FK
             return res.status(400).json({ error: 'ID de médico ou paciente inválido.' });
        }
        // Outros erros...
        res.status(500).json({ error: 'Erro interno do servidor ao criar consulta.' });
    }
});

// GET /appointments/:id - Retorna uma consulta específica pelo ID
// O esquema OpenAPI GET /appointments/{id} que forneceu na última vez inclui pacienteId, medicoId, mas não specialty aninhado.
// No entanto, o pedido original de texto era id, data, specialty para os GETs.
// Vamos seguir o pedido original de texto para consistência nos GETs (id, data, descricao, specialty).
// Se precisar de paciente/medico incluídos no GET por ID, ajuste a formatação da resposta.
router.get('/:id', async (req, res) => {
    const appointmentId = req.params.id; // Pega o ID dos parâmetros do URL

    try {
        // Busca a consulta pelo ID e inclui Doutor e Especialidade
        const appointment = await Appointment.findByPk(appointmentId, {
             // Seleciona os campos base necessários
             attributes: ['id', 'date', 'time', 'notes', 'user_id', 'doctor_id'], // Incluir FKs para autorização
             include: [
                {
                    model: Doctor,
                    as: 'medico', // Alias assumido
                    attributes: ['id', 'name'], // Atributos do Doutor
                    include: [{
                        model: Specialty,
                        as: 'specialty', // Alias assumido
                        attributes: ['id', 'name'] // Atributos da Especialidade
                    }]
                },
                // Incluir Utilizador para verificação de autorização e potencialmente para a resposta
                {
                     model: User,
                     as: 'paciente', // Alias assumido
                     attributes: ['id', 'name'] // Atributos do Utilizador
                }
             ]
        });

        // Se a consulta não for encontrada
        if (!appointment) {
            return res.status(404).json({ error: 'Consulta não encontrada.' });
        }

        // Verificação de autorização: o utilizador autenticado é o dono OU é admin
        if (!authorizeAppointmentAccess(req, appointment)) {
             return res.status(403).json({ error: 'Acesso negado. Não tem permissão para visualizar esta consulta.' });
        }

        // Formata a resposta para o formato da API desejado (id, data, descricao, specialty)
        // Se o esquema OpenAPI para GET por ID for diferente do GET list, ajuste aqui.
        const formattedAppointment = formatAppointmentResponse(appointment);

        // Se o esquema GET por ID incluir mais detalhes (paciente, medico), formate aqui. Ex:
        /*
        const detailedAppointment = {
           id: appointment.id,
           data: `${appointment.date}T${appointment.time ? appointment.time.toISOString().split('T')[1] : '00:00:00.000Z'}`,
           descricao: appointment.notes,
           paciente: appointment.paciente ? { id: appointment.paciente.id, name: appointment.paciente.name } : null,
           medico: appointment.medico ? {
               id: appointment.medico.id,
               name: appointment.medico.name,
               specialty: appointment.medico.specialty ? { id: appointment.medico.specialty.id, name: appointment.medico.specialty.name } : null
           } : null
        };
        res.json(detailedAppointment);
        */

        res.json(formattedAppointment); // Retorna o formato simplificado por padrão

    } catch (error) {
        console.error(`Erro ao buscar consulta com ID ${appointmentId}:`, error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar consulta.' });
    }
});

// PUT /appointments/:id - Atualiza os dados de uma consulta
// Corresponde ao esquema PUT /appointments/{id} no OpenAPI
router.put('/:id', async (req, res) => {
    const appointmentId = req.params.id; // Pega o ID dos parâmetros do URL
    const { data, descricao, medicoId, especialidadeId /*, pacienteId - ignorado do body */ } = req.body;

    try {
        const appointment = await Appointment.findByPk(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }

        // Verificação de autorização: o utilizador autenticado é o dono OU é admin
        if (!authorizeAppointmentAccess(req, appointment)) {
            return res.status(403).json({ error: 'Acesso negado. Não tem permissão para editar esta consulta.' });
        }

        // Prepara objeto com os campos a serem atualizados, mapeando API para BD
        const updateFields = {};

        // Se data for fornecida, processa e adiciona date e time aos updateFields
        if (data !== undefined) {
            const appointmentDateTime = new Date(data);
             if (isNaN(appointmentDateTime.getTime())) {
                 return res.status(400).json({ error: 'Formato de data e hora inválido.' });
             }
            updateFields.date = appointmentDateTime.toISOString().split('T')[0]; // Mapeia 'data' (parte da data) para 'date' na BD
            // Extrai a parte da hora e formata. Ajuste conforme o formato TIME da sua BD.
            updateFields.time = appointmentDateTime.toTimeString().split(' ')[0]; // Ex: "10:30:00" (pode precisar de mais formatação)
        }

        // Se descricao for fornecida, adiciona notes aos updateFields
        if (descricao !== undefined) {
            updateFields.notes = descricao; // Mapeia 'descricao' para 'notes' na BD
        }

        // Se medicoId for fornecido, valida e adiciona doctor_id aos updateFields
        if (medicoId !== undefined) {
            // Opcional/Recomendado: Verificar se o novo medicoId existe
            const doctor = await Doctor.findByPk(medicoId, {
                include: [{
                    model: Specialty,
                    as: 'specialty', // Alias assumido
                    attributes: ['id']
                }]
            });

            if (!doctor) {
                 return res.status(400).json({ error: 'ID do médico inválido.' });
            }

            // Se especialidadeId também for fornecida na atualização, valida o medicoId contra ela
            if (especialidadeId !== undefined) {
                 if (!doctor.specialty || doctor.specialty.id !== especialidadeId) {
                    return res.status(400).json({ error: 'Novo médico não associado à especialidade fornecida.' });
                 }
            }

            updateFields.doctor_id = medicoId; // Mapeia 'medicoId' para 'doctor_id' na BD
        }

        // pacienteId do body é ignorado. user_id na BD não deve ser alterado por PUT (a menos que seja admin com endpoint diferente).

        // Se não houver campos válidos para atualizar no body, retorna 400
        if (Object.keys(updateFields).length === 0) {
             return res.status(400).json({ error: 'Nenhum campo de atualização válido fornecido (data, descricao, medicoId).' });
        }

        // Atualiza os dados da consulta na base de dados
        await appointment.update(updateFields);

        // Opcional: Buscar a consulta atualizada com os dados incluídos para a resposta 200
        // O esquema OpenAPI 200 para PUT é o objeto atualizado. Vamos retorná-lo formatado.
        const updatedAppointmentDetails = await Appointment.findByPk(appointment.id, {
            // Incluir campos base
            attributes: ['id', 'date', 'time', 'notes', 'user_id', 'doctor_id'],
             include: [
                // Inclui o Médico e Especialidade (e Paciente se necessário)
                {
                    model: Doctor,
                    as: 'medico', // Alias assumido
                    attributes: ['id', 'name'],
                    include: [{
                        model: Specialty,
                        as: 'specialty', // Alias assumido
                        attributes: ['id', 'name']
                    }]
                },
                 {
                     model: User,
                     as: 'paciente', // Alias assumido
                     attributes: ['id', 'name']
                 }
             ]
        });

        // Formata a resposta
         // Se o esquema 200 do PUT no OpenAPI for mais detalhado que o GET, ajuste a formatação aqui.
         // Vamos retornar o objeto formatado similar ao GET list/ID por padrão.
         const formattedResponse = formatAppointmentResponse(updatedAppointmentDetails);

         // Se o esquema 200 do PUT for mais detalhado (incluir paciente, medico, etc.), formate aqui.

        res.json(formattedResponse); // Retorna o objeto atualizado formatado

    } catch (error) {
        console.error(`Erro ao editar consulta com ID ${appointmentId}:`, error);
        // Tratamento de erro mais específico, ex: SequelizeForeignKeyConstraintError
         if (error.name === 'SequelizeForeignKeyConstraintError') {
              return res.status(400).json({ error: 'ID de médico inválido na atualização.' });
         }
        res.status(500).json({ error: 'Erro interno do servidor ao editar consulta.' });
    }
});

// Eliminar consulta
// Corresponde ao esquema DELETE /appointments/{id} no OpenAPI (ajustando para 204)
router.delete('/:id', async (req, res) => {
    const appointmentId = req.params.id; // Pega o ID dos parâmetros do URL

    try {
        const appointment = await Appointment.findByPk(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }

        // Verificação de autorização: o utilizador autenticado é o dono OU é admin
        if (!authorizeAppointmentAccess(req, appointment)) {
            return res.status(403).json({ error: 'Acesso negado. Não tem permissão para eliminar esta consulta.' });
        }

        // Elimina a consulta
        await appointment.destroy();

        // Resposta de sucesso (usando 204 No Content) - Conforme prática RESTful, ajustado do 200 do seu OpenAPI
        res.status(204).send();

    } catch (error) {
        console.error(`Erro ao eliminar consulta com ID ${appointmentId}:`, error);
        // Considere tratamento de erro se a consulta tiver dados dependentes (embora improvável para Appointment)
        res.status(500).json({ error: 'Erro interno do servidor ao eliminar consulta.' });
    }
});


module.exports = router;