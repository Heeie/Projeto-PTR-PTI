// catalogoRoutes.js
const express = require('express');
const c = require('../controllers/CatalogoEquipamentosController');
const router = express.Router();

router.post('/', c.create);
router.get('/', c.list);
// Filtra o id para ser um ObjectId válido
router.get('/:id', (req, res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return next();
  c.getOne(req, res, next);
});
router.put('/:id', (req, res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return next();
  c.update(req, res, next);
});
router.delete('/:id', (req, res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return next();
  c.remove(req, res, next);
});

module.exports = router;
