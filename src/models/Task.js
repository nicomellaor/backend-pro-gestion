const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    sprintId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sprint', 
        required: true 
    },
    taskNumber: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
        enum: ['Backlog', 'Por hacer', 'En proceso', 'Hecho']
    },
    description: String,
    managers: String,
    startDate: Date,
    endDate: Date
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);