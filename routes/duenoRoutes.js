// pedidoRoutes.js
const express = require('express');
const router = express.Router();
const duenoController = require('../controllers/duenoController');


router.get('/', duenoController.getAllDueno);

router.get('/activosSinVacunar', duenoController.getDuenosActivoConPerrosSinVacunar);
router.get('/:idperro', duenoController.getDuenoByPerroId);
router.get('/buscarDueno/:id', duenoController.getDuenoById);
router.post('/EnviarCorreo', duenoController.enviarCorreo);
router.post('/', duenoController.createDueno);
router.delete('/:iddueno', duenoController.deleteDueno);
router.put('/:id', duenoController.updateDueno);

// router.get('/:idtipo', tipoController.getTipoById);
// router.post('/', tipoController.createTipo);
// router.put('/:idtipo', tipoController.updateTipo);
// router.delete('/:idtipo', tipoController.deleteTipo);

module.exports = router;
