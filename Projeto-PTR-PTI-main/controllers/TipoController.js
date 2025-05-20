const Tipo = require("../models/Tipo");

exports.criarTipo = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    const novoTipo = new Tipo({ nome, descricao });
    await novoTipo.save();

    res.status(201).json({ message: "Tipo criado com sucesso!", tipo: novoTipo });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar tipo", detalhes: error.message });
  }
};
