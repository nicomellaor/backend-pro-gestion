const express = require('express');
const router  = express.Router({ mergeParams: true }); // Permite leer projectId de la ruta padre
const auth    = require('../middleware/auth');
const { getUserStories, postUserStory, putUserStory, deleteUserStory } = require('../controllers/userStoryController');

// Todas las rutas requieren autenticación
router.use(auth);

// /api/projects/:projectId/userstories
router.get('/', getUserStories);
router.post('/', postUserStory);
router.put('/:storyId', putUserStory);
router.delete('/:storyId', deleteUserStory);

module.exports = router;
