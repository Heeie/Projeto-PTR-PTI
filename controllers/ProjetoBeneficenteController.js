const ProjetoBeneficente = require("../models/ProjetoBeneficente");

// Criar projeto (você já tem)
exports.criarProjeto = async (req, res) => {
  try {
    const { nome, descricao, organizador_id } = req.body;
    const novoProjeto = new ProjetoBeneficente({ nome, descricao, organizador_id });
    await novoProjeto.save();
    res.status(201).json({ message: "Projeto beneficente criado com sucesso!", projeto: novoProjeto });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar projeto beneficente", detalhes: error.message });
  }
};

// Buscar todos os projetos
exports.listarProjetos = async (req, res) => {
  try {
    const projetos = await ProjetoBeneficente.find()
      .populate('organizador_id', 'nome email')   // populando organizador (exemplo)
      .populate('doadores', 'nome email')
      .populate('loja', 'nome')
      .populate('equipamentos');
    res.status(200).json(projetos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar projetos", detalhes: error.message });
  }
};

// Editar projeto por ID
exports.editarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const projetoAtualizado = await ProjetoBeneficente.findByIdAndUpdate(id, dadosAtualizados, { new: true });
    if (!projetoAtualizado) return res.status(404).json({ error: "Projeto não encontrado" });
    res.status(200).json({ message: "Projeto atualizado com sucesso!", projeto: projetoAtualizado });
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar projeto", detalhes: error.message });
  }
};

// Apagar projeto por ID
exports.apagarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const projetoRemovido = await ProjetoBeneficente.findByIdAndDelete(id);
    if (!projetoRemovido) return res.status(404).json({ error: "Projeto não encontrado" });
    res.status(200).json({ message: "Projeto apagado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar projeto", detalhes: error.message });
  }
};
