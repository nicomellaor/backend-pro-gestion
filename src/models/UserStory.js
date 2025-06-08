const mongoose = require('mongoose');

const userStorySchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  storyIdStr: { 
    type: String, 
    required: true 
  },
  story: {
    type: String,
    required: true
  },
  priority: { 
    type: String, 
    enum: ['Alta','Media','Baja'] 
  },
  estimationPoints: { 
    type: Number 
  },
  criteria: {
    type: String
  }
}, { 
    versionKey: false,
    timestamps: true 
});

module.exports = mongoose.model('UserStory', userStorySchema);