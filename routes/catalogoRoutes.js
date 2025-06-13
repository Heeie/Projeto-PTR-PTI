const express = require('express');
const c = require('../controllers/CatalogoEquipamentosController');
const router = express.Router();

router.route('/catalogos')
      .post(c.create)
      .get(c.list);

router.route('/catalogos/:id')
      .get(c.getOne)
      .put(c.update)
      .delete(c.remove);

module.exports = router;
