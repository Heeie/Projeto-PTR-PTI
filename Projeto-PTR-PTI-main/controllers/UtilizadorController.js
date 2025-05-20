const Utilizador = require('../models/Utilizador'); // Certifique-se de que o caminho está correto

exports.criarUtilizador = async (req, res) => {
  try {
    console.log('Requisição recebida:', req.body);

    // Desestruturação dos campos recebidos
    const {
      nome,
      email,
      senha,
      telefone,
      nif,
      nic,
      morada,
      genero,
      role = 'cliente'
    } = req.body;

    // Validação simples para verificar se os campos obrigatórios estão presentes
    if (!nome || !senha) {
      throw new Error('Nome e Senha são obrigatórios.');
    }

    const novoUtilizador = new Utilizador({
      nome,
      email,
      senha,
      telefone,
      nif,
      nic,
      morada,
      genero,
      role
    });

    // Salvar o utilizador no banco de dados
    await novoUtilizador.save();

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Utilizador criado com sucesso!",
      utilizador: novoUtilizador
    });

  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    res.status(500).json({
      error: "Erro ao criar Utilizador",
      detalhes: error.message
    });
  }
};
