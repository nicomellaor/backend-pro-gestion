const Project = require('../models/Project');
const Sprint  = require('../models/Sprint');
const Task    = require('../models/Task');

const getTasks = async (req, res, next) => {
  try {
    const { projectId, sprintId } = req.params;

    const belongs = await Project.exists({
      _id: projectId,
      $or: [
        { ownerId: req.userId },
        { membersIds: req.userId }
      ]
    });
    if (!belongs) {
      return res.status(403).json({ msg: 'No autorizado en este proyecto' });
    }

    const validSprint = await Sprint.exists({
      _id: sprintId,
      project: projectId
    });
    if (!validSprint) {
      return res.status(404).json({ msg: 'Sprint no encontrado en este proyecto' });
    }

    const tasks = await Task.find({ sprint: sprintId })
      .sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const postTask = async (req, res, next) => {
  try {
    const { projectId, sprintId } = req.params;
    const { idNumber, name, state, description, managers, startDate, endDate } = req.body;

    const belongs = await Project.exists({
      _id: projectId,
      $or: [
        { ownerId: req.userId },
        { membersIds: req.userId }
      ]
    });
    if (!belongs) {
      return res.status(403).json({ msg: 'No autorizado en este proyecto' });
    }

    const validSprint = await Sprint.exists({
      _id: sprintId,
      project: projectId
    });
    if (!validSprint) {
      return res.status(404).json({ msg: 'Sprint no encontrado en este proyecto' });
    }

    const task = new Task(sprintId, idNumber, name, state, description, managers, startDate, endDate);
    await task.save();

    res.status(201).json({ msg: 'Tarea creada', task });
  } catch (err) {
    next(err);
  }
};

const putTask = async (req, res, next) => {
  try {
    const { projectId, sprintId, taskId } = req.params;
    const updates = req.body;

    const belongs = await Project.exists({ 
      _id: projectId,
      $or: [ { ownerId: req.userId }, { membersIds: req.userId } ]
    });
    if (!belongs) {
      return res.status(403).json({ msg: 'No autorizado en este proyecto' });
    }
    const validSprint = await Sprint.exists({ _id: sprintId, projectId });
    if (!validSprint) {
      return res.status(404).json({ msg: 'Sprint no encontrado en este proyecto' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, sprint: sprintId },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    res.json({ msg: 'Tarea actualizada', task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { projectId, sprintId, taskId } = req.params;

    const belongs = await Project.exists({ 
      _id: projectId,
      $or: [ { ownerId: req.userId }, { membersIds: req.userId } ]
    });
    if (!belongs) {
      return res.status(403).json({ msg: 'No autorizado en este proyecto' });
    }
    const validSprint = await Sprint.exists({ _id: sprintId, projectId });
    if (!validSprint) {
      return res.status(404).json({ msg: 'Sprint no encontrado en este proyecto' });
    }

    const result = await Task.findOneAndDelete({ _id: taskId, sprintId });
    if (!result) {
      return res.status(404).json({ msg: 'Tarea no encontrada' });
    }

    res.json({ msg: 'Tarea eliminada' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  postTask,
  putTask,
  deleteTask
};
