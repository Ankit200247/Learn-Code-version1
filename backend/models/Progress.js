import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      default: "General",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    language: {
      type: String,
      enum: ["java", "cpp", "c", "python", "javascript"],
      default: "java",
    },

    status: {
      type: String,
      enum: ["solved"],
      default: "solved",
    },

    solvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// A user can have only one progress record per problem.
progressSchema.index(
  { user: 1, problemId: 1 },
  { unique: true }
);

const Progress =
  mongoose.models.Progress ||
  mongoose.model("Progress", progressSchema);

export default Progress;