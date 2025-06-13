const Catalogo = require('../models/CatalogoEquipamentos');

// POST /api/catalogos
exports.create = async (req, res) => {
  try {
    console.log('[DEBUG] Dados recebidos no POST /catalogos:', req.body); // ADICIONE ISSO

    const catalogo = await Catalogo.create(req.body);
    res.status(201).json(catalogo);
  } catch (err) {
    console.error('[ERRO]', err);
    res.status(400).json({ error: err.message });
  }
};


// GET /api/catalogos?marca=Apple&modelo=iPhone
exports.list = async (req, res) => {
  const query = {};
  ['marca', 'modelo', 'tipo', 'categoria'].forEach(k => {
    if (req.query[k]) query[k] = req.query[k];
  });
  if (req.query.search) query.$text = { $search: req.query.search };

  try {
    const catalogos = await Catalogo.find(query);
    res.json(catalogos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/catalogos/:id
exports.getOne = async (req, res) => {
  try {
    const catalogo = await Catalogo.findById(req.params.id);
    if (!catalogo) return res.status(404).json({ error: 'Não encontrado' });
    res.json(catalogo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/catalogos/:id
exports.update = async (req, res) => {
  try {
    const catalogo = await Catalogo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!catalogo) return res.status(404).json({ error: 'Não encontrado' });
    res.json(catalogo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/catalogos/:id
exports.remove = async (req, res) => {
  try {
    const result = await Catalogo.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Não encontrado' });
    res.json({ message: 'Catálogo apagado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
