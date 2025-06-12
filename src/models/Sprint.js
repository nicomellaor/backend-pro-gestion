const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    sprintNumber: { 
    type: Number, 
    required: true 
    },
    startDate: Date,
    endDate: Date
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Sprint', sprintSchema);