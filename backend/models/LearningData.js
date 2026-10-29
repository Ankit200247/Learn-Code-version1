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

    customRoadmaps: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    completedModules: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    roadmapLearningState: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    beginnerZoneData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    submissions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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
