const UserStory = require('../models/UserStory');
const Project = require('../models/Project');

const getUserStories = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        // Validar que el usuario pertenezca al proyecto
        const belongs = await Project.exists({
            _id: projectId,
            $or: [
                { ownerId: req.userId },
                { membersId: req.userId }
            ]
        });
        if (!belongs) {
            return res.status(403).json({ msg: 'No se tiene acceso a este proyecto' });
        }

        const stories = await UserStory.find({ projectId });

        res.json(stories);

    } catch (error) {
        next(error);
    }
};

const postUserStory = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { storyIdStr, story, priority, estimationPoints, criteria } = req.body;

        const belongs = await Project.exists({
            _id: projectId,
            $or: [
                { ownerId: req.userId },
                { membersId: req.userId }
            ]
        });
        if (!belongs) {
            return res.status(403).json({ msg: 'No se tiene acceso a este proyecto' });
        }

        const exists = await UserStory.findOne({ storyIdStr });
        if (exists) {
            return res.status(400).json({ msg: 'UserStory ya está registrado' });
        }

        const userstory = new UserStory({projectId, storyIdStr, story, priority, estimationPoints, criteria});
        await userstory.save();

        res.status(201).json({ msg: 'UserStory creado', userstory: userstory});
    } catch (error) {
        next(error);
    }
};

const putUserStory = async (req, res, next) => {
    try {
        const { projectId, storyId } = req.params;
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
        }

        const story = await UserStory.findOneAndUpdate(
            { _id: storyId, projectId },
            updates,
            { new: true, runValidators: true }
        );
        if(!story) {
            return res.status(404).json({ msg: 'UserStory no encontrado' });
        }

        res.json({ msg: 'UserStory actualizado', story });
    } catch (error) {
        next(error);
    }
};

const deleteUserStory = async (req, res, next) => {
    try {
        const { projectId, storyId } = req.params;

        const belongs = await Project.exists({
            _id: projectId,
            $or: [
                { ownerId: req.userId },
                { membersId: req.userId }
            ] 
        });
        if (!belongs) {
            return res.status(403).json({ msg: 'No se tiene acceso a este proyecto' });
        }

        const result = await UserStory.findOneAndDelete({_id: storyId, projectId });    
        if(!result){
            return res.status(404).json({ msg: 'UserStory no encontrado' });
        }

        res.json({ msg: 'UserStory eliminado' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserStories,
    postUserStory,
    putUserStory,
    deleteUserStory
};