// pedidoRoutes.js
const express = require('express');
const router = express.Router();
const perroController = require('../controllers/perroController');


router.get('/', perroController.getAllPerro);
router.get('/grafica', perroController.getPerrosPorRaza);
router.get('/:nombre', perroController.getPerroByNombre);
router.post('/', perroController.createPerro);
router.delete('/:nombre', perroController.deletePerro);
router.put('/:id', perroController.updatePerro);

//router.get('/:idperro', duenoController.getDuenoByPerroId);
//router.get('/activosSinVacunar', duenoController.getDuenosActivoConPerrosSinVacunar);
//router.post('/EnviarCorreo', duenoController.enviarCorreo);
//router.post('/', duenoController.createDueno);

// router.get('/:idtipo', tipoController.getTipoById);
// router.post('/', tipoController.createTipo);
// router.put('/:idtipo', tipoController.updateTipo);
// router.delete('/:idtipo', tipoController.deleteTipo);

module.exports = router;
