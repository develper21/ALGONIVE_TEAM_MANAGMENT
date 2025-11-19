import mongoose from 'mongoose';

const taskAttachmentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  storedName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['code', 'document', 'pdf', 'image', 'other'],
    default: 'other'
  },
  relativePath: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

taskAttachmentSchema.index({ task: 1, createdAt: -1 });

const TaskAttachment = mongoose.model('TaskAttachment', taskAttachmentSchema);

export default TaskAttachment;
