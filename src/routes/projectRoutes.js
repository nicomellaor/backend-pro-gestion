const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { 
    getProjects, 
    postProject,
    putProject,
    deleteProject
} = require('../controllers/projectController');
const userStoryRoutes = require('../routes/userStoryRoutes');
const sprintRoutes = require('../routes/sprintRoutes'); 

// Todas estas rutas requieren estar autenticado
router.use(auth);

// /api/projects
router.get('/', getProjects);
router.post('/', postProject);
router.put('/:id', putProject);
router.delete('/:id', deleteProject);

// Rutas anidadas
router.use('/:projectId/userstories', userStoryRoutes);
router.use('/:projectId/sprints', sprintRoutes);

module.exports = router;
