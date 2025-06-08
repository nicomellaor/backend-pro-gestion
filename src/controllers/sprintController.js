const Sprint = require('../models/Sprint');
const Project = require('../models/Project');

const getSprints = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const belongs = await Project.exists({
            _id: projectId,
            $or: [
                { ownerId: req.userId },
                { membersId: req.userId }
            ]
        });
        if (!belongs) {
            return res.status(403).json({ msg: 'No se tiene acceso a este proyecto' });
        };

        const sprints = await Sprint.find({ projectId });

        res.json(sprints);

    } catch (error) {
        next(error);
    }
};

const postSprint = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { sprintNumber, startDate, endDate } = req.body;

        const belongs = await Project.exists({
            _id: projectId,
            $or: [
                { ownerId: req.userId },
                { membersId: req.userId }
            ]
        });
        if (!belongs) {
            return res.status(403).json({ msg: 'No se tiene acceso a este proyecto' });
        };

        const exists = await Sprint.findOne({ sprintNumber });
        if (exists) {
            return res.status(400).json({ msg: 'Sprint ya está registrado' });
        };

        const sprint = new Sprint(projectId, sprintNumber, startDate, endDate);
        await sprint.save();

        res.status(201).json({ msg: 'Sprint creado', sprint: sprint});

    } catch (error) {
        next(error);
    }
};

const putSprint = async (req, res, next) => {
    try {
        const { projectId, sprintId } = req.params;
        const updates = req.body;

        const belongs = await Project.exists({
            _id: projectId,
            $or: [
                { ownerId: req.userId },
                { membersId: req.userId }
            ] 
        });
        if (!belongs) {
            return res.status(403).json({ msg: 'No se tiene acceso a este proyecto' });
        };

        const sprint = await Sprint.findOneAndUpdate(
            { _id: sprintId, projectId },
            updates,
            { new: true, runValidators: true }
        );
        if (!sprint) {
            return res.status(404).json({ msg: 'Sprint no encontrado' });
        };

        res.json({ msg: 'Sprint actualizado', sprint });
    } catch (error) {
        next(error);
    }
};

const deleteSprint = async (req, res, next) => {
    try {
        const { projectId, sprintId } = req.params;

        const belongs = await Project.exists({
            _id: projectId,
            $or: [
                { ownerId: req.userId },
                { membersId: req.userId }
            ] 
        });
        if (!belongs) {
            return res.status(403).json({ msg: 'No se tiene acceso a este proyecto' });
        };

        const result = await Sprint.findOneAndDelete({ _id: sprintId, projectId });
        if(!result){
            return res.status(404).json({ msg: 'Sprint no encontrado' });
        }

        res.json({ msg: 'Sprint eliminado' });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSprints,
    postSprint,
    putSprint,
    deleteSprint
};