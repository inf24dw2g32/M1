const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Assumindo que este middleware verifica autenticação e adiciona user à requisição
const { User } = require('../models'); // Importa o modelo User

// Middleware de verificação de admin (aplicado a todas as rotas abaixo)
router.use(auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
  }
  next(); // Se for admin, continua para a próxima middleware/rota
});

// GET /users - Retorna uma lista de utilizadores (apenas id e nome)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name'] // Seleciona apenas id e nome
    });
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar utilizadores:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar utilizadores.' });
  }
});

// POST /users - Cria um novo utilizador
router.post('/', async (req, res) => {
  const { name, email, google_id, role } = req.body; // Pega os dados do corpo da requisição

  // Validação básica dos campos necessários (ajustar conforme sua necessidade de validação)
  if (!name || !email || !google_id) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando: name, email, google_id.' });
  }

  try {
    // Cria o novo utilizador no banco de dados
    const newUser = await User.create({
      name,
      email,
      google_id,
      role: role || 'user' // Usa a role do body se existir, caso contrário, 'user' (default do modelo também)
    });

    // Retorna o novo utilizador criado (pode escolher quais campos retornar)
    // Para consistência, talvez queira retornar apenas id e nome aqui também, ou o objeto completo (exceto google_id?)
    // Vou retornar um subconjunto para evitar expor google_id na resposta POST de criação
    res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email, // Talvez queira mostrar o email para confirmação
        role: newUser.role
    });

  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    // Verifica se é um erro de validação do Sequelize (ex: email ou google_id duplicado)
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Email ou Google ID já existem.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor ao criar utilizador.' });
  }
});

// GET /users/:id - Retorna um utilizador específico pelo ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id; // Pega o ID dos parâmetros do URL

  try {
    // Busca o utilizador pelo ID
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role'] // Pode escolher quais campos retornar para um único user
      // Para um único utilizador, pode ser útil retornar mais info para o admin, mas NÃO o google_id
    });

    // Se o utilizador não for encontrado
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    // Retorna o utilizador encontrado
    res.json(user);

  } catch (error) {
    console.error(`Erro ao buscar utilizador com ID ${userId}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar utilizador.' });
  }
});

// PUT /users/:id - Atualiza os dados de um utilizador pelo ID
router.put('/:id', async (req, res) => {
  const userId = req.params.id; // Pega o ID dos parâmetros do URL
  const { name, role } = req.body; // Pega os campos a serem atualizados do corpo da requisição
  // Nota: Não permitimos atualizar email ou google_id por esta via para simplificar e segurança.

  try {
    // Busca o utilizador pelo ID
    const user = await User.findByPk(userId);

    // Se o utilizador não for encontrado
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    // Atualiza os dados do utilizador
    // Cria um objeto com os campos a serem atualizados, apenas se existirem no body
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (role !== undefined) updateFields.role = role;

    // Realiza a atualização
    await user.update(updateFields);

    // Retorna o utilizador atualizado (pode escolher quais campos retornar)
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    });

  } catch (error) {
    console.error(`Erro ao atualizar utilizador com ID ${userId}:`, error);
    // Verifica se é um erro de validação do Sequelize (menos comum em update a não ser que tente mudar unique fields)
     if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Violação de restrição única.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar utilizador.' });
  }
});


// DELETE /users/:id - Deleta um utilizador pelo ID
router.delete('/:id', async (req, res) => {
  const userId = req.params.id; // Pega o ID dos parâmetros do URL

  try {
    // Deleta o utilizador pelo ID
    // A função destroy retorna o número de linhas afetadas
    const deletedRowCount = await User.destroy({
      where: { id: userId }
    });

    // Se nenhuma linha foi afetada, significa que o utilizador não foi encontrado
    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    // Retorna uma resposta de sucesso (200 OK ou 204 No Content)
    res.status(200).json({ message: 'Utilizador removido com sucesso.' });
    // Ou pode usar res.status(204).send(); // 204 No Content não envia corpo na resposta

  } catch (error) {
    console.error(`Erro ao deletar utilizador com ID ${userId}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor ao deletar utilizador.' });
  }
});


module.exports = router;