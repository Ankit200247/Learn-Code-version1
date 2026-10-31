import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "techpath_beginner_progress";
const ROADMAP_KEY = "techpath_custom_roadmaps";

const DEFAULT_MODULES = [
  {
    id: "java",
    title: "Java Programming",
    icon: "☕",
    topics: ["Variables and Data Types", "Conditions and Loops", "OOP Concepts"],
  },
  {
    id: "cpp",
    title: "C++ Programming",
    icon: "⚙️",
    topics: ["Syntax and Variables", "Functions", "Pointers and OOP"],
  },
  {
    id: "dsa",
    title: "Data Structures",
    icon: "🧩",
    topics: ["Arrays and Strings", "Stacks and Queues", "Searching and Sorting"],
  },
  {
    id: "dbms",
    title: "Database Management",
    icon: "🗄️",
    topics: ["SQL Basics", "Keys and Normalization", "Transactions"],
  },
  {
    id: "os",
    title: "Operating Systems",
    icon: "💻",
    topics: ["Processes and Threads", "CPU Scheduling", "Memory Management"],
  },
  {
    id: "networks",
    title: "Computer Networks",
    icon: "🌐",
    topics: ["OSI Model", "TCP/IP", "Networking Protocols"],
  },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function ProgressBar({ value }) {
  return (
    <div
      className="h-2.5 overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}% completed`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function BeginnerZoneProgress() {
  const [progress, setProgress] = useState(() =>
    readStorage(STORAGE_KEY, {})
  );

  const [roadmaps, setRoadmaps] = useState(() =>
    readStorage(ROADMAP_KEY, [])
  );

  const [topicName, setTopicName] = useState("");
  const [selectedModules, setSelectedModules] = useState(["java", "dsa"]);
  const [showRoadmapForm, setShowRoadmapForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmaps));
  }, [roadmaps]);

  const moduleStats = useMemo(() => {
    return DEFAULT_MODULES.map((module) => {
      const completedTopics = progress[module.id] || [];

      const completed = module.topics.filter((topic) =>
        completedTopics.includes(topic)
      ).length;

      const percentage = Math.round(
        (completed / module.topics.length) * 100
      );

      return {
        ...module,
        completed,
        total: module.topics.length,
        percentage,
      };
    });
  }, [progress]);

  const totalTopics = moduleStats.reduce(
    (sum, module) => sum + module.total,
    0
  );

  const completedTopics = moduleStats.reduce(
    (sum, module) => sum + module.completed,
    0
  );

  const overallPercentage = totalTopics
    ? Math.round((completedTopics / totalTopics) * 100)
    : 0;

  const completedModules = moduleStats.filter(
    (module) => module.percentage === 100
  ).length;

  function toggleTopic(moduleId, topic) {
    setProgress((previous) => {
      const currentTopics = previous[moduleId] || [];

      const updatedTopics = currentTopics.includes(topic)
        ? currentTopics.filter((item) => item !== topic)
        : [...currentTopics, topic];

      return {
        ...previous,
        [moduleId]: updatedTopics,
      };
    });
  }

  function toggleSelectedModule(moduleId) {
    setSelectedModules((previous) =>
      previous.includes(moduleId)
        ? previous.filter((id) => id !== moduleId)
        : [...previous, moduleId]
    );
  }

  function createRoadmap(event) {
    event.preventDefault();

    const title = topicName.trim();

    if (!title) {
      return;
    }

    if (selectedModules.length === 0) {
      window.alert("Please select at least one learning module.");
      return;
    }

    const roadmap = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      modules: selectedModules,
      completed: [],
      createdAt: new Date().toISOString(),
    };

    setRoadmaps((previous) => [...previous, roadmap]);
    setTopicName("");
    setSelectedModules(["java", "dsa"]);
    setShowRoadmapForm(false);
  }

  function toggleRoadmapModule(roadmapId, moduleId) {
    setRoadmaps((previous) =>
      previous.map((roadmap) => {
        if (roadmap.id !== roadmapId) {
          return roadmap;
        }

        const completed = roadmap.completed || [];

        return {
          ...roadmap,
          completed: completed.includes(moduleId)
            ? completed.filter((id) => id !== moduleId)
            : [...completed, moduleId],
        };
      })
    );
  }

  function deleteRoadmap(roadmapId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this roadmap?"
    );

    if (!confirmed) {
      return;
    }

    setRoadmaps((previous) =>
      previous.filter((roadmap) => roadmap.id !== roadmapId)
    );
  }

  return (
    <div className="space-y-8">
      {/* Heading */}
      <section>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
            📈
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Your Learning Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track completed topics and plan what to learn next.
            </p>
          </div>
        </div>
      </section>

      {/* Overall Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="🎯"
          label="Overall Progress"
          value={`${overallPercentage}%`}
          detail="Across all learning modules"
        />

        <StatCard
          icon="✅"
          label="Topics Completed"
          value={`${completedTopics}/${totalTopics}`}
          detail="Topics marked as completed"
        />

        <StatCard
          icon="🏆"
          label="Modules Completed"
          value={`${completedModules}/${DEFAULT_MODULES.length}`}
          detail="Modules at 100% completion"
        />

        <StatCard
          icon="🗺️"
          label="Custom Roadmaps"
          value={roadmaps.length}
          detail="Your personalized learning plans"
        />
      </section>

      {/* Overall Progress */}
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-indigo-700">
              YOUR LEARNING JOURNEY
            </p>

            <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
              {overallPercentage === 100
                ? "Amazing! Everything is completed."
                : overallPercentage >= 50
                  ? "You're making great progress!"
                  : "Every small step counts."}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {completedTopics} of {totalTopics} learning topics completed.
            </p>
          </div>

          <div className="text-4xl font-black text-indigo-600">
            {overallPercentage}%
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </section>

      {/* Topic-wise Progress */}
      <section>
        <div className="mb-5">
          <h3 className="text-lg font-extrabold text-slate-900">
            Topic-wise Progress
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Expand a module and mark topics as completed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {moduleStats.map((module) => (
            <details
              key={module.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl">
                    {module.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-900">
                        {module.title}
                      </h4>

                      <span className="text-sm font-bold text-indigo-600">
                        {module.percentage}%
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {module.completed} of {module.total} topics completed
                    </p>

                    <div className="mt-3">
                      <ProgressBar value={module.percentage} />
                    </div>
                  </div>

                  <span className="text-slate-400 transition group-open:rotate-180">
                    ▾
                  </span>
                </div>
              </summary>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                {module.topics.map((topic) => {
                  const checked = (progress[module.id] || []).includes(topic);

                  return (
                    <label
                      key={topic}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                        checked
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTopic(module.id, topic)}
                        className="h-4 w-4 accent-indigo-600"
                      />

                      <span
                        className={`flex-1 text-sm ${
                          checked
                            ? "font-medium text-emerald-800 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {topic}
                      </span>

                      {checked && (
                        <span className="text-sm font-bold text-emerald-600">
                          ✓
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Custom Roadmap */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🗺️</span>

              <h3 className="text-xl font-extrabold text-slate-900">
                Custom Learning Roadmap
              </h3>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create a learning plan for a topic you want to master.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRoadmapForm((previous) => !previous)}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            {showRoadmapForm ? "Cancel" : "+ Create Roadmap"}
          </button>
        </div>

        {showRoadmapForm && (
          <form
            onSubmit={createRoadmap}
            className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5"
          >
            <label
              htmlFor="roadmap-topic"
              className="block text-sm font-bold text-slate-800"
            >
              What do you want to learn?
            </label>

            <input
              id="roadmap-topic"
              value={topicName}
              onChange={(event) => setTopicName(event.target.value)}
              placeholder="Example: DSA for placements"
              maxLength={100}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />

            <p className="mt-5 text-sm font-bold text-slate-800">
              Select learning modules
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {DEFAULT_MODULES.map((module) => (
                <label
                  key={module.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${
                    selectedModules.includes(module.id)
                      ? "border-indigo-300 bg-indigo-100 text-indigo-800"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(module.id)}
                    onChange={() => toggleSelectedModule(module.id)}
                    className="accent-indigo-600"
                  />

                  <span>{module.icon}</span>
                  <span>{module.title}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Save My Roadmap
            </button>
          </form>
        )}

        {/* Saved Roadmaps */}
        <div className="mt-6 space-y-4">
          {roadmaps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
              <div className="text-3xl">🌱</div>

              <p className="mt-3 font-bold text-slate-800">
                Your roadmap starts here
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first roadmap to organize your learning goals.
              </p>
            </div>
          ) : (
            roadmaps.map((roadmap) => {
              const completed = roadmap.completed || [];

              const percentage = Math.round(
                (completed.length / roadmap.modules.length) * 100
              );

              return (
                <article
                  key={roadmap.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {roadmap.title}
                      </h4>

                      <p className="mt-1 text-xs text-slate-500">
                        {completed.length} of {roadmap.modules.length} modules
                        completed
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-indigo-600">
                        {percentage}%
                      </span>

                      <button
                        type="button"
                        onClick={() => deleteRoadmap(roadmap.id)}
                        aria-label={`Delete ${roadmap.title}`}
                        className="rounded-lg px-2 py-1 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <ProgressBar value={percentage} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {roadmap.modules.map((moduleId) => {
                      const module = DEFAULT_MODULES.find(
                        (item) => item.id === moduleId
                      );

                      if (!module) return null;

                      const isComplete = completed.includes(moduleId);

                      return (
                        <label
                          key={moduleId}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${
                            isComplete
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-slate-100 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isComplete}
                            onChange={() =>
                              toggleRoadmapModule(roadmap.id, moduleId)
                            }
                            className="accent-indigo-600"
                          />

                          <span>{module.icon}</span>
                          <span className="flex-1">{module.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Note */}
      <p className="text-center text-xs leading-5 text-slate-400">
        Your progress and custom roadmaps are saved in this browser. They are
        not yet synchronized with an account or database.
      </p>
    </div>
  );
}

function StatCard({ icon, label, value, detail }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
    </article>
  );
}