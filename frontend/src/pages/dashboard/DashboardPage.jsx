import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://https://leancode.onrender.com"
).replace(/\/$/, "");

const DAILY_CHALLENGES = [
  {
    id: "two-sum",
    title: "Two Sum",
    topic: "Arrays & Hashing",
    difficulty: "Easy",
    description:
      "Find two elements in an array whose sum equals a given target.",
    path: "/ai-editor?problem=two-sum",
    hint: "Think about storing previously visited numbers in a hash map.",
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    topic: "Strings",
    difficulty: "Easy",
    description:
      "Reverse a string without relying on built-in reverse methods.",
    path: "/ai-editor?problem=reverse-string",
    hint: "Try traversing the string from the last index to the first.",
  },
  {
    id: "binary-search",
    title: "Binary Search",
    topic: "Searching",
    difficulty: "Easy",
    description: "Find a target value efficiently in a sorted array.",
    path: "/ai-editor?problem=binary-search",
    hint: "Compare the target with the middle element and eliminate half the search range.",
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    description:
      "Determine whether opening and closing brackets are balanced.",
    path: "/ai-editor?problem=valid-parentheses",
    hint: "Use a stack to match each closing bracket with its opening bracket.",
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    topic: "Arrays",
    difficulty: "Medium",
    description:
      "Find the maximum sum of a non-empty contiguous subarray.",
    path: "/ai-editor?problem=maximum-subarray",
    hint: "Explore Kadane's algorithm and decide whether to extend or restart the current subarray.",
  },
];

const QUICK_ACTIONS = [
  {
    title: "Coding Practice",
    description: "Solve DSA questions and improve your problem-solving skills.",
    icon: "code",
    path: "/practice",
    label: "Practice now",
    color: "violet",
  },
  {
    title: "Beginner Zone",
    description: "Build your programming foundation step by step.",
    icon: "book",
    path: "/beginner-zone",
    label: "Start learning",
    color: "emerald",
  },
  {
    title: "AI Assistant",
    description: "Ask questions and understand difficult concepts.",
    icon: "sparkles",
    path: "/ai-assistant",
    label: "Ask AI",
    color: "blue",
  },
  {
    title: "Learning Resources",
    description: "Explore learning materials and useful references.",
    icon: "library",
    path: "/resources",
    label: "Explore resources",
    color: "amber",
  },
];

const TOPIC_GOALS = [
  { name: "Arrays", goal: 10, aliases: ["array"] },
  { name: "Strings", goal: 8, aliases: ["string"] },
  {
    name: "Hashing",
    goal: 6,
    aliases: ["hash map", "hash maps", "arrays & hashing"],
  },
  {
    name: "Linked List",
    goal: 6,
    aliases: ["linked lists", "linkedlist"],
  },
  { name: "Trees", goal: 8, aliases: ["tree", "binary tree"] },
];

const ROADMAP_STEPS = [
  {
    number: "01",
    title: "Programming Fundamentals",
    description: "Variables, conditions, loops, functions and OOP.",
    status: "Start here",
    icon: "book",
  },
  {
    number: "02",
    title: "Data Structures & Algorithms",
    description: "Arrays, strings, hashing, linked lists and trees.",
    status: "Build skills",
    icon: "code",
  },
  {
    number: "03",
    title: "Interview Preparation",
    description: "Coding rounds, MCQs and interview practice.",
    status: "Get ready",
    icon: "target",
  },
];

function Icon({ name, size = 20, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </>
    ),
    code: (
      <>
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m14 5-4 14" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" />
        <path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 21" />
        <path d="M9 7h7M9 11h7" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2z" />
        <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2z" />
      </>
    ),
    library: (
      <>
        <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v16H5.5A1.5 1.5 0 0 0 4 20.5z" />
        <path d="M4 4.5v16" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    flame: (
      <>
        <path d="M12 22c4.5 0 7-3.2 7-7 0-3-2-5-4-7-.2 2-1.5 3-2 3-1-4-3-6-5-8 0 4-1 6-3 9-2 4-.5 10 7 10z" />
        <path d="M12 22c-2 0-3.5-1.5-3.5-3.5 0-1.5 1-3 2.5-4.5.3 2 1.5 2.5 2 2.5 1 2 .5 4-1 5.5z" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
        <path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  };

  return <svg {...common}>{paths[name] || paths.code}</svg>;
}

function getSavedSolvedIds() {
  try {
    const value = JSON.parse(
      localStorage.getItem("techpath_solved_problems") || "[]"
    );

    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

function getUserName() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.name?.trim()) return user.name.trim();

    if (user.email) return user.email.split("@")[0];
  } catch {
    // Use the default greeting.
  }

  return "there";
}

function getDailyChallenge() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayNumber = Math.floor(
    (now - startOfYear) / (1000 * 60 * 60 * 24)
  );

  return DAILY_CHALLENGES[dayNumber % DAILY_CHALLENGES.length];
}

function normalizeTopic(topic) {
  return String(topic || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");
}

function getTopicCount(progress, topic) {
  const aliases = [topic.name, ...(topic.aliases || [])].map(normalizeTopic);

  return progress.filter((item) => {
    const itemTopic = normalizeTopic(item.topic);

    return aliases.some(
      (alias) =>
        itemTopic === alias ||
        itemTopic.includes(alias) ||
        alias.includes(itemTopic)
    );
  }).length;
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  to,
  loading = false,
}) {
  const className =
    "group block h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/50 sm:p-6";

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {loading ? (
              <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-slate-100" />
            ) : (
              value
            )}
          </p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">
          <Icon name={icon} size={22} />
        </span>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">{description}</p>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-violet-600">
            {eyebrow}
          </p>
        )}

        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function LoadingProgress() {
  return (
    <div className="space-y-5" aria-label="Loading topic progress">
      {TOPIC_GOALS.map((topic) => (
        <div key={topic.name}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">{topic.name}</span>
            <span className="h-3 w-10 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-violet-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [progress, setProgress] = useState([]);
  const [localSolvedIds, setLocalSolvedIds] = useState(getSavedSolvedIds);
  const [loading, setLoading] = useState(true);
  const [serverAvailable, setServerAvailable] = useState(false);
  const [error, setError] = useState("");
  const [hintVisible, setHintVisible] = useState(false);

  const token = localStorage.getItem("token") || "";

  const userName = useMemo(() => getUserName(), []);
  const dailyChallenge = useMemo(() => getDailyChallenge(), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      setLoading(true);
      setError("");

      if (!token) {
        setProgress([]);
        setServerAvailable(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        });

        if (cancelled) return;

        const data = response.data || {};

        if (data.success === false) {
          throw new Error(data.message || "Unable to load progress.");
        }

        setProgress(Array.isArray(data.progress) ? data.progress : []);
        setServerAvailable(true);
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
            err.message ||
            "Account progress is temporarily unavailable. Showing local statistics."
        );

        setProgress([]);
        setServerAvailable(false);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    function refreshLocalProgress() {
      setLocalSolvedIds(getSavedSolvedIds());
    }

    window.addEventListener("storage", refreshLocalProgress);
    window.addEventListener("focus", refreshLocalProgress);
    window.addEventListener("techpath-progress-updated", refreshLocalProgress);

    return () => {
      window.removeEventListener("storage", refreshLocalProgress);
      window.removeEventListener("focus", refreshLocalProgress);
      window.removeEventListener(
        "techpath-progress-updated",
        refreshLocalProgress
      );
    };
  }, []);

  const solvedCount = serverAvailable
    ? new Set(progress.map((item) => item.problemId).filter(Boolean)).size
    : new Set(localSolvedIds).size;

  const topicProgress = useMemo(() => {
    return TOPIC_GOALS.reduce((result, topic) => {
      result[topic.name] = getTopicCount(progress, topic);
      return result;
    }, {});
  }, [progress]);

  const dailyChallengeCompleted = localSolvedIds.includes(dailyChallenge.id);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="min-h-screen space-y-8 bg-slate-50/80 p-4 text-slate-900 sm:p-6 lg:p-8">
      {/* Welcome banner */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-8 lg:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              YOUR LEARNING SPACE
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {getGreeting()}, {userName}!
              <span className="ml-2 inline-block" aria-hidden="true">
                👋
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Every problem you solve makes you stronger. Keep learning, build
              consistency, and prepare for your next coding interview.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/practice"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
              >
                Start coding
                <Icon name="arrow" size={17} />
              </Link>

              <Link
                to="/beginner-zone"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-100"
              >
                <Icon name="book" size={17} />
                Explore Beginner Zone
              </Link>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-5 sm:max-w-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon name="calendar" size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">TODAY</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {today}
                </p>
              </div>
            </div>

            <div className="my-4 border-t border-slate-100" />

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Daily challenge
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {dailyChallenge.topic}
                </p>
              </div>

              <span
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                  dailyChallenge.difficulty === "Easy"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {dailyChallenge.difficulty}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* API notice */}
      {error && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
        >
          <span className="mt-0.5">
            <Icon name="clock" size={19} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-medium">Progress connection notice</p>
            <p className="mt-1 break-words">{error}</p>
            <p className="mt-1 text-xs text-amber-700">
              Local statistics remain available. Account statistics may be
              unavailable until the connection is restored.
            </p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <section>
        <SectionHeading
          eyebrow="Your journey"
          title="Learning overview"
          description="A quick look at your current learning activity."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Problems solved"
            value={solvedCount}
            description={
              serverAvailable
                ? "Unique problems in your account progress"
                : "Unique problems recorded in this browser"
            }
            icon="check"
            to="/progress"
            loading={loading}
          />

          <SummaryCard
            title="Learning tracks"
            value="3"
            description="Programming fundamentals, DSA and interview prep"
            icon="book"
            to="/beginner-zone"
          />

          <SummaryCard
            title="Daily challenge"
            value={dailyChallengeCompleted ? "Completed" : "Pending"}
            description={
              dailyChallengeCompleted
                ? "Today's challenge is on your local solved list"
                : "Take a few minutes to practice today's problem"
            }
            icon="target"
            to={dailyChallenge.path}
          />

          <SummaryCard
            title="AI learning"
            value="Explore"
            description="Ask questions and work through difficult concepts"
            icon="sparkles"
            to="/ai-assistant"
          />
        </div>
      </section>

      {/* Daily challenge */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Icon name="target" size={25} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Daily coding challenge
                </h2>

                <span
                  className={`rounded-md px-2 py-1 text-xs font-semibold ${
                    dailyChallenge.difficulty === "Easy"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {dailyChallenge.difficulty}
                </span>
              </div>

              <h3 className="mt-2 text-base font-semibold text-violet-700">
                {dailyChallenge.title}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {dailyChallenge.description}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-400">
                Topic: {dailyChallenge.topic}
              </p>

              <button
                type="button"
                onClick={() => setHintVisible((visible) => !visible)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2"
                aria-expanded={hintVisible}
              >
                {hintVisible ? "Hide hint ↑" : "Need a hint? ↓"}
              </button>

              {hintVisible && (
                <p className="mt-2 rounded-xl border border-violet-100 bg-violet-50 p-3 text-sm leading-6 text-violet-800">
                  <span className="font-semibold">Hint: </span>
                  {dailyChallenge.hint}
                </p>
              )}
            </div>
          </div>

          <Link
            to={dailyChallenge.path}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 md:self-center"
          >
            {dailyChallengeCompleted ? "Practice again" : "Solve challenge"}
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>

      {/* Quick access */}
      <section>
        <SectionHeading
          eyebrow="Get started"
          title="Quick access"
          description="Jump straight into the area you want to work on."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map((action) => {
            const iconColors = {
              violet:
                "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
              emerald:
                "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
              blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
              amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
            };

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/40 focus:outline-none focus:ring-4 focus:ring-violet-100"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${iconColors[action.color]}`}
                >
                  <Icon name={action.icon} size={23} />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {action.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-semibold text-violet-700">
                    {action.label}
                  </span>

                  <Icon
                    name="arrow"
                    size={17}
                    className="text-violet-600 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Progress and roadmap */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Topic-wise progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
          <SectionHeading
            title="Topic-wise progress"
            description="Review the number of problems recorded for each topic."
            action={
              <Link
                to="/progress"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900"
              >
                View all
                <Icon name="chevron" size={16} />
              </Link>
            }
          />

          {loading ? (
            <LoadingProgress />
          ) : !serverAvailable ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Icon name="dashboard" size={18} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Account topic statistics unavailable
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {token
                      ? "Connect to the progress API to load your topic-wise statistics."
                      : "Your browser's solved count is available above. Sign in to load account-based progress."}
                  </p>
                </div>
              </div>

              <Link
                to="/practice"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
              >
                Browse problems
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {TOPIC_GOALS.map((topic) => {
                const count = topicProgress[topic.name] || 0;
                const percentage = Math.min(
                  100,
                  Math.round((count / topic.goal) * 100)
                );

                return (
                  <div key={topic.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-700">
                        {topic.name}
                      </span>

                      <span className="text-xs font-medium text-slate-500">
                        {count} / {topic.goal}
                      </span>
                    </div>

                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`${topic.name} progress`}
                      aria-valuemin={0}
                      aria-valuemax={topic.goal}
                      aria-valuenow={Math.min(count, topic.goal)}
                    >
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-5 text-xs leading-5 text-slate-400">
            Topic goals are reference targets. Actual counts depend on the
            records returned by your progress API.
          </p>
        </div>

        {/* Learning roadmap */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
          <SectionHeading
            title="Learning roadmap"
            description="A suggested path from fundamentals to interview preparation."
            action={
              <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700">
                3 stages
              </span>
            }
          />

          <div className="space-y-1">
            {ROADMAP_STEPS.map((step, index) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      index === 0
                        ? "border-violet-100 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <Icon name={step.icon} size={20} />
                  </div>

                  {index < ROADMAP_STEPS.length - 1 && (
                    <div className="my-2 min-h-6 w-px flex-1 bg-slate-200" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                      {step.title}
                    </h3>

                    <span
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                        index === 0
                          ? "bg-violet-50 text-violet-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/beginner-zone"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            Explore Beginner Zone
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>

      {/* Motivation banner */}
      <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Icon name="flame" size={23} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Consistency beats intensity.
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Even 30 minutes of focused practice each day can help you build
              strong fundamentals. Understand the solution, write it yourself,
              and revisit the problems you found difficult.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}