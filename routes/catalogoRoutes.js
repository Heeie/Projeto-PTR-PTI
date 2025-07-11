const express = require('express');
const c = require('../controllers/CatalogoEquipamentosController');
const router = express.Router();

router.post('/', c.create);
router.get('/', c.list);
router.get('/:id', c.getOne);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
