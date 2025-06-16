const Avaliacao = require('../models/Avaliacao');
const Utilizador = require('../models/Utilizador');

async function gerarNumeroPedidoOrcamento(lojaId) {
  const ultima = await Avaliacao.find({ lojaId })
    .sort({ numeroPedidoOrcamento: -1 })
    .limit(1);

  return ultima.length > 0 ? ultima[0].numeroPedidoOrcamento + 1 : 1;
}

function calcularCustoTotal(pecas = []) {
  return pecas.reduce((total, peca) => total + (peca.custoSubstituicao || 0), 0);
}

exports.criarAvaliacao = async (req, res) => {
  const {
    lojaId,
    clienteId,
    equipamento, // <-- Agora recebemos os dados do equipamento aqui
    numeroExemplar,
    descricaoProblema,
    pecasASubstituir = [],
    estadoEquipamento
  } = req.body;

  if (!lojaId || !clienteId || !equipamento || !numeroExemplar || !descricaoProblema) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  try {
    const numeroPedidoOrcamento = await gerarNumeroPedidoOrcamento(lojaId);
    const custoEstimadoReparacao = calcularCustoTotal(pecasASubstituir);

    const novaAvaliacao = await Avaliacao.create({
      lojaId,
      empregadoId: req.user.id, // do token autenticado
      clienteId,
      equipamento,
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



exports.listarAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find()
      .populate('empregadoId', 'nome email')  // corrigir nome de campo
      .populate('clienteId', 'nome email');

    res.json(avaliacoes);
  } catch (err) {
    console.error('Erro ao buscar avaliações:', err);
    res.status(500).json({ error: 'Erro ao buscar avaliações.' });
  }
};


exports.avaliacoesDoFuncionario = async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find({ empregadoId: req.user.id }) // corrigir campo
      .populate('clienteId', 'nome');

    res.json(avaliacoes);
  } catch (err) {
    console.error('Erro ao buscar avaliações:', err);
    res.status(500).json({ error: 'Erro ao buscar avaliações.' });
  }
};

