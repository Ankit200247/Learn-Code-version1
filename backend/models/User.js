import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
// BASIC USER INFORMATION
email: {
type: String,
required: [true, "Email is required"],
unique: true,
lowercase: true,
trim: true,
maxlength: 254,
},

name: {
  type: String,
  trim: true,
  default: "",
  maxlength: 100,
},

// Hashed password for normal email-password login.
passwordHash: {
  type: String,
  required: [true, "Password is required"],
  select: false,
},

// Retained for compatibility with existing project data.
emailVerified: {
  type: Boolean,
  default: false,
},

// POINTS SYSTEM
totalPoints: {
  type: Number,
  default: 0,
  min: 0,
},

totalProblemsSolved: {
  type: Number,
  default: 0,
  min: 0,
},

// STREAK SYSTEM
currentStreak: {
  type: Number,
  default: 0,
  min: 0,
},

longestStreak: {
  type: Number,
  default: 0,
  min: 0,
},

lastActivityDate: {
  type: String,
  default: "",
},

lastStreakBonusDate: {
  type: String,
  default: "",
},

// DAILY CHALLENGE
dailyChallengeCompletedDate: {
  type: String,
  default: "",
},

dailyChallengeBonusDate: {
  type: String,
  default: "",
},


},
{
timestamps: true,
versionKey: false,
}
);

const User =
mongoose.models.User ||
mongoose.model("User", userSchema);

export default User;
