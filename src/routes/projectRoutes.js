const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { 
    getProjects, 
    postProject,
    putProject,
    deleteProject
} = require('../controllers/projectController');
const userStoryRoutes = require('../controllers/userStoryController'); 

// Todas estas rutas requieren estar autenticado
router.use(auth);

// /api/projects
router.get('/', getProjects);
router.post('/', postProject);
router.put('/:id', putProject);
router.delete('/:id', deleteProject);

// Anidar rutas de UserStories
router.use('/:projectId/userstories', userStoryRoutes);

module.exports = router;
