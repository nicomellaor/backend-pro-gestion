const express = require('express');
const router  = express.Router({ mergeParams: true }); // Permite leer projectId de la ruta padre
const auth    = require('../middleware/auth');
const { getSprints, postSprint, putSprint, deleteSprint } = require('../controllers/sprintController');

// Todas las rutas requieren autenticación
router.use(auth);

// /api/projects/:projectId/sprints
router.get('/', getSprints);
router.post('/', postSprint);
router.put('/:sprintId', putSprint);
router.delete('/:sprintId', deleteSprint);

module.exports = router;
