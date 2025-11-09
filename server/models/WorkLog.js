const mongoose = require("mongoose");

const WorkLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task ID is required"],
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    hoursWorked: {
      type: Number,
      required: [true, "Hours worked is required"],
      min: [0, "Hours cannot be negative"],
      max: [24, "Hours cannot exceed 24"],
    },
    description: {
      type: String,
      required: [true, "Work description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    activities: [{
      activity: String,
      time: String,
      completed: { type: Boolean, default: false }
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for efficient queries
WorkLogSchema.index({ userId: 1, date: -1 });
WorkLogSchema.index({ taskId: 1, date: -1 });
WorkLogSchema.index({ userId: 1, taskId: 1, date: -1 });

module.exports = mongoose.model("WorkLog", WorkLogSchema);
