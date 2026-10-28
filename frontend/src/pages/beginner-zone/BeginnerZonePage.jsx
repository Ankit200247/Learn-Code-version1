
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "techpath_beginner_progress";

const MODULES = [
  {
    id: "java-basics",
    number: "01",
    title: "Java Fundamentals",
    description:
      "Start with variables, data types, operators, input, and output.",
    level: "Beginner",
    duration: "2 hours",
    lessons: 8,
    icon: "☕",
    accent: "border-orange-200",
    iconColor: "bg-orange-50 text-orange-600",
    path: "/beginner-zone/java",
    topics: ["Variables", "Data Types", "Operators", "Input/Output"],
  },
  {
    id: "conditions-loops",
    number: "02",
    title: "Conditions & Loops",
    description:
      "Learn decision-making, for loops, while loops, and nested loops.",
    level: "Beginner",
    duration: "2 hours",
    lessons: 7,
    icon: "🔄",
    accent: "border-indigo-200",
    iconColor: "bg-indigo-50 text-indigo-600",
    path: "/beginner-zone/java",
    topics: ["If-Else", "Switch", "For Loop", "While Loop"],
  },
  {
    id: "methods",
    number: "03",
    title: "Methods & Functions",
    description:
      "Understand reusable code, parameters, return values, and scope.",
    level: "Beginner",
    duration: "90 min",
    lessons: 6,
    icon: "⚙️",
    accent: "border-cyan-200",
    iconColor: "bg-cyan-50 text-cyan-600",
    path: "/beginner-zone/java",
    topics: ["Methods", "Parameters", "Return Values", "Scope"],
  },
  {
    id: "arrays-strings",
    number: "04",
    title: "Arrays & Strings",
    description:
      "Practice indexing, traversal, searching, and string manipulation.",
    level: "Beginner",
    duration: "3 hours",
    lessons: 10,
    icon: "🧩",
    accent: "border-emerald-200",
    iconColor: "bg-emerald-50 text-emerald-600",
    path: "/beginner-zone/java",
    topics: ["Arrays", "String Methods", "Searching", "Traversal"],
  },
  {
    id: "oop",
    number: "05",
    title: "Object-Oriented Programming",
    description:
      "Build a strong foundation in classes, objects, inheritance, and polymorphism.",
    level: "Beginner",
    duration: "4 hours",
    lessons: 12,
    icon: "🏗️",
    accent: "border-violet-200",
    iconColor: "bg-violet-50 text-violet-600",
    path: "/beginner-zone/java",
    topics: ["Classes", "Objects", "Inheritance", "Polymorphism"],
  },
  {
    id: "dsa-basics",
    number: "06",
    title: "DSA Fundamentals",
    description:
      "Begin solving problems using searching, sorting, and basic data structures.",
    level: "Beginner",
    duration: "5 hours",
    lessons: 15,
    icon: "🧠",
    accent: "border-pink-200",
    iconColor: "bg-pink-50 text-pink-600",
    path: "/practice",
    topics: ["Complexity", "Searching", "Sorting", "Basic DSA"],
  },
];

const ROADMAP_STAGES = [
  {
    id: "stage-1",
    title: "Programming Basics",
    description: "Learn syntax, variables, conditions, and loops.",
    modules: ["java-basics", "conditions-loops"],
  },
  {
    id: "stage-2",
    title: "Core Java",
    description: "Understand methods, arrays, strings, and OOP.",
    modules: ["methods", "arrays-strings", "oop"],
  },
  {
    id: "stage-3",
    title: "DSA Foundation",
    description: "Apply your programming knowledge to coding problems.",
    modules: ["dsa-basics"],
  },
];

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    return {
      completedModules: Array.isArray(saved.completedModules)
        ? [...new Set(saved.completedModules)].filter((id) =>
            MODULES.some((module) => module.id === id)
          )
        : [],
      completedLessons:
        saved.completedLessons &&
        typeof saved.completedLessons === "object" &&
        !Array.isArray(saved.completedLessons)
          ? saved.completedLessons
          : {},
    };
  } catch {
    return {
      completedModules: [],
      completedLessons: {},
    };
  }
}

function ProgressBar({ value, color = "bg-violet-600" }) {
  const percentage = Math.max(0, Math.min(100, value));

  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function StatCard({ title, value, icon, description, accent }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${accent}`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </article>
  );
}

export default function BeginnerZonePage() {
  const [progress, setProgress] = useState(readProgress);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [activeTab, setActiveTab] = useState("modules");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Unable to save Beginner Zone progress:", error);
    }
  }, [progress]);

  useEffect(() => {
    const syncProgress = (event) => {
      if (!event || event.key === STORAGE_KEY) {
        setProgress(readProgress());
      }
    };

    window.addEventListener("storage", syncProgress);

    return () => {
      window.removeEventListener("storage", syncProgress);
    };
  }, []);

  useEffect(() => {
    if (!showResetConfirm) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowResetConfirm(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showResetConfirm]);

  const filteredModules = useMemo(() => {
    const query = search.trim().toLowerCase();

    return MODULES.filter((module) => {
      const matchesSearch =
        !query ||
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        module.topics.some((topic) =>
          topic.toLowerCase().includes(query)
        );

      const matchesLevel =
        selectedLevel === "All Levels" ||
        module.level === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [search, selectedLevel]);

  const completedCount = progress.completedModules.length;

  const overallProgress = Math.round(
    (completedCount / MODULES.length) * 100
  );

  const totalLessons = MODULES.reduce(
    (sum, module) => sum + module.lessons,
    0
  );

  const completedLessons = Object.entries(
    progress.completedLessons
  ).reduce((sum, [moduleId, lessons]) => {
    if (!MODULES.some((module) => module.id === moduleId)) {
      return sum;
    }

    if (Array.isArray(lessons)) {
      return sum + lessons.length;
    }

    return sum;
  }, 0);

  const lessonProgressPercentage =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round((completedLessons / totalLessons) * 100)
        )
      : 0;

  const toggleModuleCompletion = (moduleId) => {
    setProgress((previous) => {
      const isCompleted = previous.completedModules.includes(moduleId);

      return {
        ...previous,
        completedModules: isCompleted
          ? previous.completedModules.filter((id) => id !== moduleId)
          : [...previous.completedModules, moduleId],
      };
    });
  };

  const resetProgress = () => {
    setProgress({
      completedModules: [],
      completedLessons: {},
    });

    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen space-y-7 bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8 lg:p-9">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-1/3 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-bold tracking-wide text-violet-700">
              <span>🌱</span>
              YOUR STARTING POINT
            </span>

            <h2 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Welcome to{" "}
              <span className="text-violet-600">Beginner Zone</span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Start with programming fundamentals, learn step by step, and
              gradually build the confidence to solve coding problems
              independently.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/beginner-zone/java"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
              >
                Start Java Learning
                <span>→</span>
              </Link>

              <Link
                to="/practice"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                Try Coding Practice
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span>✓ Beginner friendly</span>
              <span>✓ Learn at your own pace</span>
              <span>✓ Track your progress</span>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Overall Progress
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Your learning journey
                </p>
              </div>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                🏆
              </span>
            </div>

            <p className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900">
              {overallProgress}%
            </p>

            <div className="mt-4">
              <ProgressBar value={overallProgress} />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                {completedCount} of {MODULES.length} modules
              </span>

              <span className="font-bold text-violet-700">
                {MODULES.length - completedCount} remaining
              </span>
            </div>

            {overallProgress === 100 && (
              <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                🎉 Amazing! You have completed every module.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Learning Modules"
          value={MODULES.length}
          icon="📚"
          description="Structured beginner modules"
          accent="bg-violet-50"
        />

        <StatCard
          title="Modules Completed"
          value={`${completedCount}/${MODULES.length}`}
          icon="✅"
          description="Modules marked complete"
          accent="bg-emerald-50"
        />

        <StatCard
          title="Available Lessons"
          value={totalLessons}
          icon="📝"
          description="Lessons across all modules"
          accent="bg-indigo-50"
        />

        <StatCard
          title="Lessons Completed"
          value={completedLessons}
          icon="🎯"
          description={`${lessonProgressPercentage}% of total lessons`}
          accent="bg-amber-50"
        />
      </section>

      {/* Lesson progress */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Lesson Progress
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Your recorded lesson completion.
            </p>
          </div>

          <span className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700">
            {lessonProgressPercentage}%
          </span>
        </div>

        <ProgressBar
          value={lessonProgressPercentage}
          color="bg-violet-600"
        />

        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span>{completedLessons} recorded lessons completed</span>
          <span>{totalLessons} lessons available</span>
        </div>
      </section>

      {/* Navigation tabs */}
      <section className="flex flex-wrap gap-2">
        {[
          { id: "modules", label: "Learning Modules", icon: "📚" },
          { id: "roadmap", label: "Learning Roadmap", icon: "🗺️" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-violet-600 text-white shadow-md shadow-violet-100"
                : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </section>

      {activeTab === "modules" ? (
        <>
          {/* Search and filters */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search modules or topics..."
                  aria-label="Search learning modules"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
                />
              </div>

              <select
                value={selectedLevel}
                onChange={(event) => setSelectedLevel(event.target.value)}
                aria-label="Filter by level"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
              >
                <option>All Levels</option>
                <option>Beginner</option>
              </select>
            </div>

            {(search || selectedLevel !== "All Levels") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedLevel("All Levels");
                }}
                className="mt-3 text-xs font-semibold text-violet-700 transition hover:text-violet-900"
              >
                Clear search and filters ×
              </button>
            )}
          </section>

          {/* Module cards */}
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Learning Modules
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Choose a module and learn at your own pace.
                </p>
              </div>

              <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                {filteredModules.length} of {MODULES.length} modules
              </span>
            </div>

            {filteredModules.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredModules.map((module) => {
                  const isCompleted = progress.completedModules.includes(
                    module.id
                  );

                  return (
                    <article
                      key={module.id}
                      className={`group flex flex-col rounded-2xl border ${module.accent} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/40 sm:p-6`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${module.iconColor}`}
                        >
                          {module.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold tracking-wide text-slate-400">
                              MODULE {module.number}
                            </span>

                            {isCompleted && (
                              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                ✓ Completed
                              </span>
                            )}
                          </div>

                          <h4 className="mt-2 text-lg font-bold leading-snug text-slate-900">
                            {module.title}
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {module.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {module.topics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span>📖 {module.lessons} lessons</span>
                        <span>⏱️ {module.duration}</span>
                        <span>🌱 {module.level}</span>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                        <Link
                          to={module.path}
                          className="inline-flex flex-1 items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
                        >
                          {isCompleted ? "Review Module" : "Start Learning"}
                          <span className="ml-2">→</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleModuleCompletion(module.id)}
                          aria-pressed={isCompleted}
                          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                            isCompleted
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                          }`}
                        >
                          {isCompleted ? "✓ Completed · Undo" : "Mark Complete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                <span className="text-4xl">🔎</span>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No modules found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search term or clear your filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedLevel("All Levels");
                  }}
                  className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        </>
      ) : (
        /* Learning roadmap */
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">
                Your learning path
              </span>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Your Learning Roadmap
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Follow these stages in order to move from programming basics
                towards DSA problem solving.
              </p>
            </div>

            <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-medium text-violet-700">
                Overall completion
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {overallProgress}%
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {ROADMAP_STAGES.map((stage, index) => {
              const stageCompletedCount = stage.modules.filter((id) =>
                progress.completedModules.includes(id)
              ).length;

              const percentage = Math.round(
                (stageCompletedCount / stage.modules.length) * 100
              );

              const isStageCompleted =
                stageCompletedCount === stage.modules.length;

              return (
                <article
                  key={stage.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-200 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                        isStageCompleted
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-violet-50 text-violet-700"
                      }`}
                    >
                      {isStageCompleted
                        ? "✓"
                        : String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">
                            {stage.title}
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            {stage.description}
                          </p>
                        </div>

                        <span
                          className={`rounded-lg px-3 py-2 text-sm font-bold ${
                            isStageCompleted
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-violet-50 text-violet-700"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-4">
                        <ProgressBar
                          value={percentage}
                          color={
                            isStageCompleted
                              ? "bg-emerald-500"
                              : "bg-violet-600"
                          }
                        />
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        {stageCompletedCount} of {stage.modules.length} modules
                        completed
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {stage.modules.map((moduleId) => {
                          const module = MODULES.find(
                            (item) => item.id === moduleId
                          );

                          if (!module) return null;

                          const moduleCompleted =
                            progress.completedModules.includes(moduleId);

                          return (
                            <Link
                              key={moduleId}
                              to={module.path}
                              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-violet-200 hover:bg-violet-50"
                            >
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
                                  moduleCompleted
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-white text-slate-500"
                                }`}
                              >
                                {moduleCompleted ? "✓" : module.icon}
                              </span>

                              <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700">
                                {module.title}
                              </span>

                              <span className="text-slate-400">→</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Want to start fresh?
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Reset completed modules and recorded lesson progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Reset Progress
            </button>
          </div>
        </section>
      )}

      {/* Learning tip */}
      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
            💡
          </div>

          <div>
            <h3 className="font-bold text-slate-900">Learning Tip</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Don't rush through the modules. Write small programs, experiment
              with different inputs, and explain each concept in your own words
              before moving to the next topic.
            </p>
          </div>
        </div>
      </section>

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowResetConfirm(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
              ⚠️
            </div>

            <h3
              id="reset-dialog-title"
              className="mt-4 text-xl font-bold text-slate-900"
            >
              Reset your progress?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will clear your completed modules and recorded lesson
              progress from this device. This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={resetProgress}
                className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Yes, Reset Progress
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

