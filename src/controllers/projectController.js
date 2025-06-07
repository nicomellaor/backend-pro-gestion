const Project = require('../models/Project')

const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({
            $or: [
                { ownerId: req.userId },
                { membersIds: req.userId }
            ]
        })

        // Popular: reemplaza un ObjectId por el documento completo
        .populate('ownerId', 'username')
        .populate('membersIds', 'username');
        
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

const postProject = async (req, res, next) => {
    try {
        const { projectId, ownerId, membersIds } = req.body;

        // 1) Verificar si ya existe
        const exists = await Project.findOne({ projectId });
        if (exists) {
            return res.status(400).json({ msg: 'El proyecto ya está registrado' });
        }

        // 2) Crear instancia del proyecto
        const project = new Project(projectId, ownerId, membersIds);
        await project.save();

        // 3) Retornar
        res.status(201).json({ msg: 'Proyecto creado', project: project});
    } catch (error) {
        next(error);
    }
};

const putProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { projectId, membersIds } = req.body;

        // 1) Verificar que el proyecto exista
        const project = await Project.findById(id);
        if(!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        
        // 2) Validar si el projectId va a cambiar y si ya existe otro proyecto con ese Id
        if (projectId && projectId !== project.projectId) {
            const exists = await Project.findOne({ projectId });
            if (exists) {
                return res.status(400).json({ msg: 'El Id del proyecto ya está en uso' });
            }
        }

        // 3) Actualizar campos
        if (projectId) project.projectId = projectId;
        if (membersId) project.membersIds = membersIds;

        const updatedProject = await project.save();

        // 4) Retornar
        res.json({ msg: 'Proyecto actualizado', project: updatedProject});
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1) Verificar que el proyecto exista
        const project = await Project.findById(id);
        if(!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // 2) Eliminar
        await Project.findByIdAndDelete(id);

        res.json({msg: `Proyecto con Id ${id} eliminado correctamente`})
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects,
    postProject,
    putProject,
    deleteProject
};