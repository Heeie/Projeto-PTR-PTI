const Avaliacao = require('../models/Avaliacao');
const Cliente = require('../models/Cliente');
const Equipamento = require('../models/Equipamento');

// Função auxiliar para gerar número de pedido sequencial por loja
async function gerarNumeroPedidoOrcamento(lojaId) {
  const ultima = await Avaliacao.find({ lojaId })
    .sort({ numeroPedidoOrcamento: -1 })
    .limit(1);

  return ultima.length > 0 ? ultima[0].numeroPedidoOrcamento + 1 : 1;
}

// Função para calcular custo total com base nas peças
function calcularCustoTotal(pecas = []) {
  return pecas.reduce((total, peca) => total + (peca.custoSubstituicao || 0), 0);
}


exports.criarAvaliacao = async (req, res) => {
  const {
    lojaId,
    clienteId,
    equipamentoId,
    numeroExemplar,
    descricaoProblema,
    numeroPedidoOrcamento,
    custoEstimadoReparacao,
    pecasASubstituir,
    estadoEquipamento,
  } = req.body;

  if (!lojaId || !clienteId || !equipamentoId || !numeroExemplar || !descricaoProblema || !numeroPedidoOrcamento) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  try {
    const novaAvaliacao = await Avaliacao.create({
      lojaId,
      empregadoId: req.user.id, // do token autenticado
      clienteId,
      equipamentoId,
      numeroExemplar,
      descricaoProblema,
      numeroPedidoOrcamento,
      custoEstimadoReparacao,
      pecasASubstituir,
      estadoEquipamento,
      dataEntrega: new Date()
    });

    res.status(201).json(novaAvaliacao);
  } catch (err) {
    console.error('Erro ao criar avaliação:', err);
    res.status(500).json({ error: 'Erro ao salvar avaliação.' });
  }
};




// Listar todas as avaliações (admin/funcionário)
exports.listarAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find()
      .populate('funcionario', 'nome email')
      .populate('clienteId', 'nome email')
      .populate('equipamentoId', 'marca modelo tipo');

    res.json(avaliacoes);
  } catch (err) {
    console.error('Erro ao buscar avaliações:', err);
    res.status(500).json({ error: 'Erro ao buscar avaliações.' });
  }
};

// Listar avaliações por funcionário logado
exports.avaliacoesDoFuncionario = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find({ funcionario: req.user.id })
      .populate('clienteId', 'nome')
      .populate('equipamentoId', 'modelo');

    res.json(avaliacoes);
  } catch (err) {
    console.error('Erro ao buscar avaliações:', err);
    res.status(500).json({ error: 'Erro ao buscar avaliações.' });
  }
};
