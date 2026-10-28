import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import dns from "node:dns";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import User from "./models/User.js";
import Progress from "./models/Progress.js";

dotenv.config();

// DNS fix for environments where the default resolver fails.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const AI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const JUDGE0_API_URL = (
  process.env.JUDGE0_API_URL || "https://ce.judge0.com"
).replace(/\/+$/, "");

const JUDGE0_API_KEY =
  process.env.JUDGE0_API_KEY || "";

const JUDGE0_API_HOST =
  process.env.JUDGE0_API_HOST || "";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "";

const JWT_SECRET =
  process.env.JWT_SECRET || "";

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY })
  : null;

const LANGUAGE_MAP = {
  java: { id: 62, name: "Java" },
  cpp: { id: 54, name: "C++" },
  c: { id: 50, name: "C" },
  python: { id: 71, name: "Python" },
  javascript: { id: 63, name: "JavaScript" },
};

// --------------------------------------------------
// MONGODB CONNECTION
// --------------------------------------------------

let mongoConnected = false;
let mongoConnectionPromise = null;

async function connectMongoDB() {
  const mongoURI =
    process.env.MONGODB_URI?.trim() ||
    process.env.MONGO_URI?.trim();

  if (!mongoURI) {
    console.warn(
      "MongoDB URI missing. Add MONGODB_URI to server/.env."
    );

    return false;
  }

  if (mongoose.connection.readyState === 1) {
    mongoConnected = true;
    return true;
  }

  if (mongoConnectionPromise) {
    return mongoConnectionPromise;
  }

  mongoConnectionPromise = (async () => {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
      });

      mongoConnected = true;

      console.log("MongoDB connected successfully.");

      return true;
    } catch (error) {
      mongoConnected = false;

      console.error(
        "MongoDB connection failed:",
        error.message
      );

      if (error.code) {
        console.error("MongoDB error code:", error.code);
      }

      return false;
    } finally {
      mongoConnectionPromise = null;
    }
  })();

  return mongoConnectionPromise;
}

mongoose.connection.on("connected", () => {
  mongoConnected = true;
  console.log("MongoDB connection established.");
});

mongoose.connection.on("disconnected", () => {
  mongoConnected = false;
  console.warn("MongoDB disconnected.");
});

mongoose.connection.on("error", (error) => {
  mongoConnected = false;

  console.error(
    "MongoDB connection error:",
    error.message
  );
});

function databaseReady(res) {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  res.status(503).json({
    success: false,
    message:
      "Database is not connected. Please try again shortly.",
  });

  return false;
}

// --------------------------------------------------
// JWT AUTHENTICATION
// --------------------------------------------------

function requireAuth(req, res, next) {
  try {
    if (!JWT_SECRET) {
      return res.status(503).json({
        success: false,
        message:
          "JWT_SECRET is not configured in server/.env.",
      });
    }

    const authorization =
      req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please log in to continue.",
      });
    }

    const token = authorization.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      !decoded.sub ||
      !mongoose.isValidObjectId(decoded.sub)
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid session. Please log in again.",
      });
    }

    req.userId = decoded.sub;
    req.userEmail = decoded.email || "";

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message:
        "Your session is invalid or expired. Please log in again.",
    });
  }
}

// --------------------------------------------------
// COMMON HELPERS
// --------------------------------------------------

function createError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeOutput(value) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function decodeOutput(value) {
  if (!value) return "";

  return Buffer.from(value, "base64").toString("utf8");
}

function getLanguage(language) {
  const normalized = String(language || "")
    .trim()
    .toLowerCase();

  const aliases = {
    "c++": "cpp",
    cpp17: "cpp",
    "java 17": "java",
    js: "javascript",
    node: "javascript",
    py: "python",
  };

  return (
    LANGUAGE_MAP[aliases[normalized] || normalized] ||
    null
  );
}

function getJudge0Headers() {
  const headers = {
    "Content-Type": "application/json",
  };

  if (JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
  }

  if (JUDGE0_API_HOST) {
    headers["X-RapidAPI-Host"] = JUDGE0_API_HOST;
  }

  return headers;
}

function getJudge0SubmissionUrl() {
  return `${JUDGE0_API_URL}/submissions`;
}




// --------------------------------------------------
// NORMAL EMAIL + PASSWORD AUTHENTICATION
// --------------------------------------------------

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password;

    if (!name || !email || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8 || password.length > 128) {
  return res.status(400).json({
    success: false,
    message: "Password must be between 8 and 128 characters.",
  });
}

    if (!JWT_SECRET) {
      return res.status(503).json({
        success: false,
        message: "JWT_SECRET is not configured.",
      });
    }

    await connectMongoDB();

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Check MONGODB_URI.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      emailVerified: false,
    });

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create your account.",
    });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password;

    if (!email || typeof password !== "string" || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (!JWT_SECRET) {
      return res.status(503).json({
        success: false,
        message: "JWT_SECRET is not configured.",
      });
    }

    await connectMongoDB();

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Check MONGODB_URI.",
      });
    }

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name || "",
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again.",
    });
  }
});

// --------------------------------------------------
// FORGOT PASSWORD - EMAIL OTP
// --------------------------------------------------

const passwordResetOtps = new Map();

const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure:
    process.env.SMTP_SECURE === "true" ||
    Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// SEND OTP
app.post("/api/auth/forgot-password/send-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your registered email.",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(503).json({
        success: false,
        message: "Email service is not configured. Check your .env file.",
      });
    }

    await connectMongoDB();

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected.",
      });
    }

    const user = await User.findOne({ email });

    // Do not disclose whether an email is registered.
    if (!user) {
      return res.json({
        success: true,
        message: "If the account exists, an OTP will be sent.",
      });
    }

    const existing = passwordResetOtps.get(email);

    if (existing && existing.resendAfter > Date.now()) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP.",
      });
    }

    const otp = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    passwordResetOtps.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      resendAfter: Date.now() + 60 * 1000,
      attempts: 0,
      verified: false,
      userId: user._id.toString(),
    });

    try {
      await mailTransporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: "Learn Code - Password Reset OTP",
        text: `Your Learn Code password reset OTP is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
      });
    } catch (mailError) {
      passwordResetOtps.delete(email);
      console.error("OTP email error:", mailError.message);

      return res.status(502).json({
        success: false,
        message: "Unable to send OTP. Check your email configuration.",
      });
    }

    return res.json({
      success: true,
      message: "OTP sent to your registered email address.",
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP right now.",
    });
  }
});

// VERIFY OTP
app.post("/api/auth/forgot-password/verify-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();
    const record = passwordResetOtps.get(email);

    if (!record || record.expiresAt < Date.now()) {
      passwordResetOtps.delete(email);

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.attempts >= 5) {
      passwordResetOtps.delete(email);

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Request a new OTP.",
      });
    }

    record.attempts += 1;

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    record.verified = true;
    record.verifiedAt = Date.now();

    return res.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP.",
    });
  }
});

// RESET PASSWORD
app.post("/api/auth/forgot-password/reset-password", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const newPassword = req.body?.newPassword;
    const record = passwordResetOtps.get(email);

    if (
      !record ||
      !record.verified ||
      record.expiresAt < Date.now() ||
      Date.now() - (record.verifiedAt || 0) > 5 * 60 * 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Verify a valid OTP before resetting your password.",
      });
    }

    if (
      typeof newPassword !== "string" ||
      newPassword.length < 6 ||
      newPassword.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 6 and 128 characters.",
      });
    }

    await connectMongoDB();

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected.",
      });
    }

    const user = await User.findOne({
      _id: record.userId,
      email,
    }).select("+passwordHash");

    if (!user) {
      passwordResetOtps.delete(email);

      return res.status(400).json({
        success: false,
        message: "Account not found. Please request a new OTP.",
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    passwordResetOtps.delete(email);

    return res.json({
      success: true,
      message: "Password reset successfully. Please log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password right now.",
    });
  }
});
// --------------------------------------------------
// GET CURRENT USER
// --------------------------------------------------

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    if (!databaseReady(res)) return;

    const user = await User.findById(req.userId).select(
      "email name emailVerified createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account was not found.",
      });
    }

    return res.json({
      success: true,

      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || "",
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch account details.",
    });
  }
});
// --------------------------------------------------
// GET USER PROGRESS
// --------------------------------------------------

app.get("/api/progress", requireAuth, async (req, res) => {
  try {
    if (!databaseReady(res)) return;

    const progress = await Progress.find({
      user: req.userId,
    }).sort({ solvedAt: -1 });

    const topicProgress = {};

    for (const item of progress) {
      const topic = item.topic || "Other";

      topicProgress[topic] =
        (topicProgress[topic] || 0) + 1;
    }

    return res.json({
      success: true,

      summary: {
        solvedCount: progress.length,
        topicProgress,
      },

      progress,
    });
  } catch (error) {
    console.error(
      "Fetch progress error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch progress.",
    });
  }
});

// --------------------------------------------------
// SAVE SOLVED PROBLEM
// --------------------------------------------------

app.post(
  "/api/progress/solve",
  requireAuth,
  async (req, res) => {
    try {
      if (!databaseReady(res)) return;

      const {
        problemId,
        title,
        topic,
        difficulty,
        language,
      } = req.body || {};

      if (
        typeof problemId !== "string" ||
        !problemId.trim() ||
        problemId.length > 150
      ) {
        return res.status(400).json({
          success: false,
          message: "A valid problemId is required.",
        });
      }

      const allowedDifficulties = [
        "Easy",
        "Medium",
        "Hard",
      ];

      const safeDifficulty =
        allowedDifficulties.includes(difficulty)
          ? difficulty
          : "Easy";

      const allowedLanguages = [
        "java",
        "cpp",
        "c",
        "python",
        "javascript",
      ];

      const normalizedLanguage =
        typeof language === "string"
          ? language.toLowerCase()
          : "";

      const safeLanguage =
        allowedLanguages.includes(normalizedLanguage)
          ? normalizedLanguage
          : "java";

      const progress = await Progress.findOneAndUpdate(
        {
          user: req.userId,
          problemId: problemId.trim(),
        },
        {
          $set: {
            title:
              typeof title === "string"
                ? title.slice(0, 200)
                : "",

            topic:
              typeof topic === "string"
                ? topic.slice(0, 100)
                : "",

            difficulty: safeDifficulty,
            language: safeLanguage,
            status: "solved",
            solvedAt: new Date(),
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      return res.json({
        success: true,
        message: "Progress saved successfully.",
        progress,
      });
    } catch (error) {
      console.error(
        "Save progress error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to save progress.",
      });
    }
  }
);

// --------------------------------------------------
// JUDGE0 CODE EXECUTION HELPER
// --------------------------------------------------

async function executeCode({
  code,
  language,
  input = "",
}) {
  const languageInfo = getLanguage(language);

  if (!languageInfo) {
    throw createError(
      "Unsupported language. Use Java, C++, C, Python, or JavaScript.",
      400
    );
  }

  if (
    typeof code !== "string" ||
    !code.trim()
  ) {
    throw createError(
      "Code cannot be empty.",
      400
    );
  }

  if (code.length > 100000) {
    throw createError(
      "Code is too large.",
      400
    );
  }

  const submissionUrl =
    getJudge0SubmissionUrl();

  const controller = new AbortController();

  const timeout = setTimeout(
  () => controller.abort(),
  45000
);

  try {
    const payload = {
      source_code: Buffer.from(
        code,
        "utf8"
      ).toString("base64"),

      language_id: languageInfo.id,

      stdin: Buffer.from(
        String(input),
        "utf8"
      ).toString("base64"),

      cpu_time_limit: 5,
      wall_time_limit: 10,
      memory_limit: 128000,
    };

    const submitResponse = await fetch(
      `${submissionUrl}?base64_encoded=true&wait=false`,
      {
        method: "POST",
        headers: getJudge0Headers(),
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    const submitData =
      await submitResponse.json().catch(() => ({}));

    if (
      !submitResponse.ok ||
      !submitData.token
    ) {
      console.error(
        "Judge0 submission error:",
        submitData
      );

      throw createError(
        submitData.message ||
          `Judge0 rejected the submission (HTTP ${submitResponse.status}).`,
        502
      );
    }

    const token = submitData.token;

    let result = null;

    // Poll Judge0 until execution completes.
    for (let attempt = 0; attempt < 60; attempt++) {
  const delay =
    attempt < 5 ? 300 :
    attempt < 30 ? 500 :
    800;

  await new Promise((resolve) =>
    setTimeout(resolve, delay)
  );

      const resultResponse = await fetch(
        `${submissionUrl}/${token}?base64_encoded=true`,
        {
          method: "GET",
          headers: getJudge0Headers(),
          signal: controller.signal,
        }
      );

      const resultData =
        await resultResponse.json().catch(() => ({}));

      if (!resultResponse.ok) {
        console.error(
          "Judge0 result error:",
          resultData
        );

        throw createError(
          resultData.message ||
            `Unable to retrieve execution result (HTTP ${resultResponse.status}).`,
          502
        );
      }

      const statusId = resultData.status?.id;

      // 1 = In Queue, 2 = Processing.
      if (statusId !== 1 && statusId !== 2) {
        result = resultData;
        break;
      }
    }

    if (!result) {
      throw createError(
        "Code execution timed out while waiting for Judge0.",
        504
      );
    }

    return {
      language: languageInfo.name,

      statusId: result.status?.id ?? null,

      status:
        result.status?.description || "Unknown",

      stdout: decodeOutput(result.stdout),

      stderr: decodeOutput(result.stderr),

      compileOutput: decodeOutput(
        result.compile_output
      ),

      message: decodeOutput(result.message),

      time: result.time ?? null,

      memory: result.memory ?? null,

      token,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw createError(
        "Execution request timed out. Please try again.",
        504
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// --------------------------------------------------
// RUN CODE
// POST /api/run
// --------------------------------------------------

app.post("/api/run", async (req, res) => {
  try {
    const {
      code,
      language,
      input = "",
    } = req.body || {};

    const result = await executeCode({
      code,
      language,
      input,
    });

    const output = [
      result.compileOutput,
      result.stdout,
      result.stderr,
      result.message,
    ]
      .filter(Boolean)
      .join("\n")
      .trim();

    return res.json({
      success: true,

      output,

      stdout: result.stdout,

      stderr: result.stderr,

      compileOutput: result.compileOutput,

      status: result.status,

      time: result.time,

      memory: result.memory,
    });
  } catch (error) {
    console.error(
      "Run code error:",
      error.message
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message || "Code execution failed.",
    });
  }
});

// --------------------------------------------------
// SUBMIT SOLUTION AND CHECK TEST CASES
// POST /api/submit
// --------------------------------------------------

app.post("/api/submit", async (req, res) => {
  try {
    const {
      code,
      language,
      testCases,
    } = req.body || {};

    if (
      typeof code !== "string" ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide your solution code.",
      });
    }

    if (
      !Array.isArray(testCases) ||
      testCases.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No test cases were provided.",
      });
    }

    if (testCases.length > 10) {
      return res.status(400).json({
        success: false,
        message:
          "A maximum of 10 test cases is allowed per submission.",
      });
    }

    for (const testCase of testCases) {
      if (
        typeof testCase?.input !== "string" ||
        typeof testCase?.expectedOutput !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each test case must include string input and expectedOutput values.",
        });
      }

      if (
        testCase.input.length > 2000 ||
        testCase.expectedOutput.length > 5000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A test case exceeds the allowed size.",
        });
      }
    }

    const results = [];

    for (
      let index = 0;
      index < testCases.length;
      index++
    ) {
      const testCase = testCases[index];

      let execution;

      try {
        execution = await executeCode({
          code,
          language,
          input: testCase.input,
        });
      } catch (error) {
        results.push({
          testCase: index + 1,
          passed: false,
          status: "Execution Error",
          expectedOutput:
            testCase.expectedOutput,
          actualOutput: "",
          message: error.message,
        });

        break;
      }

      // Compilation error.
      if (execution.statusId === 6) {
        return res.json({
          success: true,
          verdict: "Compilation Error",
          passed: 0,
          total: testCases.length,

          results: [
            {
              testCase: index + 1,
              passed: false,
              status: "Compilation Error",

              expectedOutput:
                testCase.expectedOutput,

              actualOutput:
                execution.compileOutput,

              message:
                execution.compileOutput ||
                execution.status,
            },
          ],
        });
      }

      // Time limit exceeded.
      if (execution.statusId === 5) {
        results.push({
          testCase: index + 1,
          passed: false,
          status: "Time Limit Exceeded",

          expectedOutput:
            testCase.expectedOutput,

          actualOutput: execution.stdout,

          message: execution.status,
        });

        break;
      }

      // Any status other than Accepted (3).
      if (execution.statusId !== 3) {
        results.push({
          testCase: index + 1,
          passed: false,
          status: "Runtime Error",

          expectedOutput:
            testCase.expectedOutput,

          actualOutput: execution.stdout,

          message:
            execution.stderr ||
            execution.message ||
            execution.status,
        });

        break;
      }

      const expected = normalizeOutput(
        testCase.expectedOutput
      );

      const actual = normalizeOutput(
        execution.stdout
      );

      const passed = actual === expected;

      results.push({
        testCase: index + 1,
        passed,

        status: passed
          ? "Passed"
          : "Wrong Answer",

        expectedOutput: expected,

        actualOutput: actual,

        time: execution.time,

        memory: execution.memory,
      });

      // Stop on first failed test.
      if (!passed) break;
    }

    const passedCount = results.filter(
      (result) => result.passed
    ).length;

    const allPassed =
      results.length === testCases.length &&
      passedCount === testCases.length;

    const failedResult = results.find(
      (result) => !result.passed
    );

    const verdict = allPassed
      ? "Accepted"
      : failedResult?.status || "Wrong Answer";

    return res.json({
      success: true,
      verdict,
      passed: passedCount,
      total: testCases.length,
      results,
    });
  } catch (error) {
    console.error(
      "Submission evaluation error:",
      error.message
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        "Unable to evaluate the submission.",
    });
  }
});
// --------------------------------------------------
// GEMINI AI HELPER
// --------------------------------------------------


async function generateAIResponse(prompt) {
  if (!ai) {
    throw createError(
      "Gemini API is not configured. Check GEMINI_API_KEY in server/.env.",
      503
    );
  }

  const primaryModel = AI_MODEL;
  const fallbackModel = "gemini-2.5-flash";

  const modelsToTry = [
    primaryModel,
    ...(fallbackModel !== primaryModel ? [fallbackModel] : []),
  ];

  let lastError;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      });

      const answer = response.text?.trim();

const finishReason =
  response.candidates?.[0]?.finishReason;

console.log("AI response length:", answer?.length);
console.log("AI finish reason:", finishReason);

if (finishReason === "MAX_TOKENS") {
  console.error(
    "AI response was truncated because the output token limit was reached."
  );
}

if (answer) {
  return answer;
}

      throw createError(
        "AI returned an empty response. Please try again.",
        502
      );
    } catch (error) {
      lastError = error;

      console.error(
        `AI model ${model} failed:`,
        error.message
      );
    }
  }

  const errorMessage = lastError?.message || "";

  if (
    /DEADLINE_EXCEEDED|timed out|timeout|504|503|429|500|502/i.test(
      errorMessage
    )
  ) {
    throw createError(
      "AI is temporarily busy. Please try again in a few seconds.",
      504
    );
  }

  throw createError(
    errorMessage || "AI request failed. Please try again.",
    502
  );
}





// --------------------------------------------------
// AI CHAT WITH CONVERSATION HISTORY
// POST /api/ai/chat
// --------------------------------------------------

app.post("/api/ai/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
    } = req.body || {};

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "A message is required.",
      });
    }

    if (message.length > 12000) {
      return res.status(413).json({
        success: false,
        message: "Message is too long.",
      });
    }

    if (
      !Array.isArray(history) ||
      history.length > 20
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Conversation history is invalid or too long.",
      });
    }

    // Keep recent messages so follow-up questions
    // can refer to earlier answers.
    const safeHistory = history
      .slice(-12)
      .filter(
        (item) =>
          item &&
          ["user", "model", "assistant"].includes(
            item.role
          )
      )
      .map((item) => ({
        role:
          item.role === "user"
            ? "User"
            : "Assistant",

        text: String(
          item.text ?? item.content ?? ""
        ).slice(0, 5000),
      }))
      .filter((item) => item.text.trim());

    const conversation = safeHistory
      .map(
        (item) =>
          `${item.role}: ${item.text}`
      )
      .join("\n\n");

    const prompt = `
You are TechPath AI, a helpful programming and learning assistant.

IMPORTANT CONVERSATION RULES:
1. Maintain context from the entire supplied conversation.
2. Answer follow-up questions using previous messages.
3. Resolve references such as "it", "that code",
   "the previous answer", "explain this" and "continue".
4. Do not treat every message as a new conversation.
5. If the user asks to modify earlier code, use the
   earlier code and requirements as context.
6. Do not invent details that are not available.
7. Explain programming concepts clearly.
8. Use examples when helpful.
9. Answer the latest question directly.
10. If earlier context is insufficient, ask a focused
    clarification instead of guessing.
IMPORTANT ANSWER COMPLETION RULES:
1. Answer the user's question completely.
2. When providing code, always provide a complete, runnable solution.
3. Include all required imports, class declarations, methods,
   main function when applicable, and closing braces.
4. Never stop in the middle of a code block.
5. Do not replace the remaining code with comments such as
   "// rest of the code".
6. Keep explanations concise when necessary to ensure the
   complete code is included.
7. Before finishing, verify that all code blocks are closed
   and the solution is complete.
CONVERSATION HISTORY:
${conversation || "(No previous conversation)"}

LATEST USER MESSAGE:
${message.trim()}

Respond to the latest user message while preserving
the conversation's context.
`;

    const answer = await generateAIResponse(prompt);

    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(
      "AI chat error:",
      error.message
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message || "AI request failed.",
    });
  }
});

// --------------------------------------------------
// AI CODE FEEDBACK
// POST /api/ai-feedback
// --------------------------------------------------

app.post("/api/ai-feedback", async (req, res) => {
  try {
    const {
      code,
      language,
      action = "review",
      problem = null,
    } = req.body || {};

    if (
      typeof code !== "string" ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide code for feedback.",
      });
    }

    if (code.length > 30000) {
      return res.status(413).json({
        success: false,
        message:
          "Code is too long for feedback.",
      });
    }

    const allowedActions = [
      "review",
      "explain",
      "debug",
      "fix",
      "optimize",
      "complexity",
      "line-by-line",
    ];

    const selectedAction =
      allowedActions.includes(action)
        ? action
        : "review";

    const prompts = {
      review:
        "Review the code for correctness, readability, and best practices.",

      explain:
        "Explain what the code does step by step in beginner-friendly language.",

      debug:
        "Find likely bugs and explain why they occur.",

      fix:
        "Provide corrected code and explain the changes.",

      optimize:
        "Suggest optimizations for time and memory efficiency.",

      complexity:
        "Analyze time and space complexity.",

      "line-by-line":
        "Explain the code line by line.",
    };

    const problemDetails = problem
      ? JSON.stringify(problem).slice(0, 8000)
      : "No problem statement provided.";

    const prompt = `
You are an expert programming mentor for TechPath AI.

PROGRAMMING LANGUAGE:
${language || "Unknown"}

REQUESTED TASK:
${prompts[selectedAction]}

PROBLEM DETAILS:
${problemDetails}

USER CODE:
\`\`\`${language || ""}
${code}
\`\`\`

INSTRUCTIONS:
- Be accurate and beginner-friendly.
- Explain the reason behind errors.
- When correcting code, preserve the requested language.
- Do not claim that code was executed unless it actually was.
- For complexity analysis, explain time and space complexity.
- Format the response with headings and code blocks where useful.
`;

    const feedback =
      await generateAIResponse(prompt);

    return res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(
      "AI feedback error:",
      error.message
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        "Unable to generate AI feedback.",
    });
  }
});

// --------------------------------------------------
// HEALTH CHECK
// GET /api/health
// --------------------------------------------------

app.get("/api/health", (_req, res) => {
  return res.json({
    success: true,

    message:
      "TechPath AI backend is running.",

    aiConfigured:
      Boolean(GEMINI_API_KEY),

    

    submissionEvaluationAvailable: true,

    judge0Configured:
      Boolean(JUDGE0_API_URL),

    mongoConnected:
      mongoose.connection.readyState === 1,

    mongoState:
      mongoose.connection.readyState,

    authenticationConfigured:
      Boolean(JWT_SECRET),
  });
});

// --------------------------------------------------
// UNKNOWN API ROUTES
// --------------------------------------------------

app.use("/api", (_req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use(
  (error, _req, res, _next) => {
    console.error(
      "Unhandled server error:",
      error.message
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        "Internal server error.",
    });
  }
);

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

async function startServer() {
  // Try MongoDB connection before starting.
  // The API server can still run if MongoDB is offline.
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(
      `\nTechPath AI backend running on http://localhost:${PORT}`
    );

    console.log(
      `Health check: http://localhost:${PORT}/api/health`
    );

    console.log(
      `Code execution: http://localhost:${PORT}/api/run`
    );

    console.log(
      `Submission evaluation: http://localhost:${PORT}/api/submit`
    );

    console.log(`AI model: ${AI_MODEL}`);

    

    console.log(
      `Gemini configured: ${Boolean(GEMINI_API_KEY)}`
    );

    console.log(
      `MongoDB connected: ${mongoConnected}\n`
    );
  });
}

startServer();
