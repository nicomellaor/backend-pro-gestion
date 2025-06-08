const express = require('express');
const router  = express.Router({ mergeParams: true });
const auth    = require('../middleware/auth');
const {
  getTasks,
  postTask,
  putTask,
  deleteTask
} = require('../controllers/taskController');

router.use(auth);

// /api/projects/:projectId/sprints/:sprintId/tasks
router.get('/',   getTasks);
router.post('/',  postTask);
router.put('/:taskId',   putTask);
router.delete('/:taskId', deleteTask);

module.exports = router;
