const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: Number,
    required: true,
    unique: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  membersIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
