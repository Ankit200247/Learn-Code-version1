import mongoose from "mongoose";

const learningDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // User-created roadmaps
    customRoadmaps: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    // Completed learning modules
    completedModules: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    // Roadmap learning progress
    roadmapLearningState: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Beginner Zone progress
    beginnerZoneData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Coding submissions
    submissions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // AI Assistant conversations
    aiAssistantChats: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    // AI Mentor conversations
    aiMentorChats: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LearningData =
  mongoose.models.LearningData ||
  mongoose.model("LearningData", learningDataSchema);

export default LearningData;
