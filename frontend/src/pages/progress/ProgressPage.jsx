import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { dsaPatterns, dsaQuestions } from "../../data/dsaPatterns";

const SOLVED_STORAGE_KEY = "techpath_dsa_solved_questions";

function getSolvedQuestions() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(SOLVED_STORAGE_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value, color = "bg-violet-600" }) {
  const percentage = Math.max(0, Math.min(100, value));

  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function ProgressPage() {
  const [solvedQuestions, setSolvedQuestions] = useState(
    getSolvedQuestions
  );

  const [activeTab, setActiveTab] = useState("topics");

  useEffect(() => {
    function refreshProgress() {
      setSolvedQuestions(getSolvedQuestions());
    }

    window.addEventListener("storage", refreshProgress);

    window.addEventListener(
      "techpath:progress-updated",
      refreshProgress
    );

    window.addEventListener("focus", refreshProgress);

    return () => {
      window.removeEventListener("storage", refreshProgress);

      window.removeEventListener(
        "techpath:progress-updated",
        refreshProgress
      );

      window.removeEventListener("focus", refreshProgress);
    };
  }, []);

  const questions = Array.isArray(dsaQuestions)
    ? dsaQuestions
    : [];

  const solvedSet = useMemo(
    () => new Set(solvedQuestions.map(String)),
    [solvedQuestions]
  );

  const isQuestionSolved = (question) =>
    solvedSet.has(String(question.id ?? question.title));

  const totalQuestions = questions.length;

  const solvedCount = questions.filter(isQuestionSolved).length;

  const remainingCount = Math.max(
    0,
    totalQuestions - solvedCount
  );

  const overallProgress =
    totalQuestions > 0
      ? Math.round((solvedCount / totalQuestions) * 100)
      : 0;

  const difficultyStats = useMemo(() => {
    return ["Easy", "Medium", "Hard"].map((difficulty) => {
      const difficultyQuestions = questions.filter(
        (question) => question.difficulty === difficulty
      );

      const solved = difficultyQuestions.filter(
        isQuestionSolved
      ).length;

      return {
        difficulty,
        total: difficultyQuestions.length,
        solved,
        remaining: difficultyQuestions.length - solved,
        percentage:
          difficultyQuestions.length > 0
            ? Math.round(
                (solved / difficultyQuestions.length) * 100
              )
            : 0,
      };
    });
  }, [questions, solvedSet]);

  const topicStats = useMemo(() => {
    return dsaPatterns
      .map((pattern) => {
        const topicQuestions = questions.filter(
          (question) =>
            question.pattern === pattern ||
            question.topic === pattern
        );

        const solved = topicQuestions.filter(
          isQuestionSolved
        ).length;

        const total = topicQuestions.length;

        return {
          pattern,
          total,
          solved,
          remaining: total - solved,
          percentage:
            total > 0
              ? Math.round((solved / total) * 100)
              : 0,
        };
      })
      .filter((topic) => topic.total > 0)
      .sort((a, b) => {
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }

        return b.solved - a.solved;
      });
  }, [questions, solvedSet]);

  const recentlySolved = useMemo(() => {
    return questions
      .filter(isQuestionSolved)
      .slice(-5)
      .reverse();
  }, [questions, solvedSet]);

  const nextQuestions = useMemo(() => {
    return questions
      .filter((question) => !isQuestionSolved(question))
      .slice(0, 5);
  }, [questions, solvedSet]);

  const strongestTopic = topicStats.find(
    (topic) => topic.solved > 0
  );

  const weakestTopic = [...topicStats]
    .filter((topic) => topic.remaining > 0)
    .sort((a, b) => a.percentage - b.percentage)[0];

  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-10">
      {/* Header */}

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
            TECHPATH AI · ANALYTICS
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Progress
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Track your coding practice, monitor topic-wise progress
            and identify areas where you can improve.
          </p>
        </div>

        <Link
          to="/practice"
          className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          Continue Practicing →
        </Link>
      </header>

      {/* Overall Progress */}

      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-6 text-white shadow-lg sm:p-8">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold text-violet-200">
              YOUR CODING JOURNEY
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {overallProgress === 100
                ? "Amazing work! 🎉"
                : overallProgress >= 50
                  ? "You're making progress! 🚀"
                  : "Every question counts! 💪"}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">
              {solvedCount} out of {totalQuestions} available coding
              questions solved. Keep practicing to strengthen your
              problem-solving skills.
            </p>

            <div className="mt-6 max-w-xl">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-indigo-100">
                  Overall completion
                </span>

                <span className="font-bold">
                  {overallProgress}%
                </span>
              </div>

              <div
                className="h-3 overflow-hidden rounded-full bg-white/20"
                role="progressbar"
                aria-valuenow={overallProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-white/20 bg-white/10 sm:h-44 sm:w-44">
              <span className="text-4xl font-bold sm:text-5xl">
                {overallProgress}%
              </span>

              <span className="mt-1 text-sm text-indigo-100">
                Completed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Questions Solved"
          value={solvedCount}
          subtitle="Accepted coding questions"
          icon="✅"
          color="bg-emerald-50"
        />

        <StatCard
          title="Remaining Questions"
          value={remainingCount}
          subtitle="Available questions to solve"
          icon="🎯"
          color="bg-violet-50"
        />

        <StatCard
          title="Topics Available"
          value={topicStats.length}
          subtitle="Topics with questions"
          icon="📚"
          color="bg-blue-50"
        />

        <StatCard
          title="Completion"
          value={`${overallProgress}%`}
          subtitle="Overall coding progress"
          icon="📈"
          color="bg-amber-50"
        />
      </section>

      {/* Difficulty Progress */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Difficulty Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Understand your progress across different difficulty
            levels.
          </p>
        </div>

        <div className="space-y-6">
          {difficultyStats.map((item) => {
            const color =
              item.difficulty === "Easy"
                ? "bg-emerald-500"
                : item.difficulty === "Medium"
                  ? "bg-amber-500"
                  : "bg-red-500";

            const badgeColor =
              item.difficulty === "Easy"
                ? "bg-emerald-50 text-emerald-700"
                : item.difficulty === "Medium"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-700";

            return (
              <div key={item.difficulty}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor}`}
                    >
                      {item.difficulty}
                    </span>

                    <span className="text-sm text-slate-600">
                      {item.solved} / {item.total} solved
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-800">
                    {item.percentage}%
                  </span>
                </div>

                <ProgressBar
                  value={item.percentage}
                  color={color}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Topic Analytics */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Topic-wise Analytics
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Find your strongest topics and areas that need more
              practice.
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("topics")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                activeTab === "topics"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              All Topics
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("remaining")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                activeTab === "remaining"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              To Improve
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {topicStats
            .filter(
              (topic) =>
                activeTab === "topics" || topic.remaining > 0
            )
            .map((topic) => (
              <div
                key={topic.pattern}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-200 hover:bg-violet-50/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {topic.pattern}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {topic.solved} solved · {topic.remaining}{" "}
                      remaining
                    </p>
                  </div>

                  <span className="text-lg font-bold text-violet-700">
                    {topic.percentage}%
                  </span>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    value={topic.percentage}
                    color={
                      topic.percentage === 100
                        ? "bg-emerald-500"
                        : "bg-violet-600"
                    }
                  />
                </div>
              </div>
            ))}

          {topicStats.filter(
            (topic) =>
              activeTab === "topics" || topic.remaining > 0
          ).length === 0 && (
            <div className="rounded-xl bg-emerald-50 p-6 text-center md:col-span-2">
              <p className="font-bold text-emerald-700">
                All available topics completed! 🎉
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              🏆
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Strongest Topic
              </h2>

              <p className="text-xs text-slate-500">
                Based on completed questions
              </p>
            </div>
          </div>

          {strongestTopic ? (
            <div className="mt-5">
              <h3 className="text-2xl font-bold text-emerald-800">
                {strongestTopic.pattern}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {strongestTopic.solved} of {strongestTopic.total}{" "}
                questions solved.
              </p>

              <div className="mt-4">
                <ProgressBar
                  value={strongestTopic.percentage}
                  color="bg-emerald-500"
                />
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Solve your first coding question to start identifying
              your strongest topic.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-xl">
              💡
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Focus Area
              </h2>

              <p className="text-xs text-slate-500">
                A topic you can work on next
              </p>
            </div>
          </div>

          {weakestTopic ? (
            <div className="mt-5">
              <h3 className="text-2xl font-bold text-amber-800">
                {weakestTopic.pattern}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {weakestTopic.remaining} questions remaining.
                Practice this topic to improve your coverage.
              </p>

              <Link
                to="/practice"
                className="mt-4 inline-flex rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
              >
                Practice Now →
              </Link>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Great work! There are no remaining questions in the
              currently available topic list.
            </p>
          )}
        </div>
      </section>

      {/* Recently Solved and Next Questions */}

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Recently Solved
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Questions marked as solved in your current progress.
          </p>

          <div className="mt-5 space-y-3">
            {recentlySolved.length > 0 ? (
              recentlySolved.map((question) => (
                <div
                  key={question.id ?? question.title}
                  className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700">
                    ✓
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {question.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {question.pattern || question.topic || "General"}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700">
                    Solved
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
                <p className="text-2xl">🧩</p>

                <p className="mt-2 font-semibold text-slate-700">
                  No solved questions yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your completed questions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Recommended Next
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Continue your practice with these unsolved questions.
          </p>

          <div className="mt-5 space-y-3">
            {nextQuestions.length > 0 ? (
              nextQuestions.map((question) => (
                <div
                  key={question.id ?? question.title}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    →
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {question.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {question.pattern || question.topic || "General"}
                      {" · "}
                      {question.difficulty || "Practice"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-emerald-50 p-6 text-center">
                <p className="font-bold text-emerald-700">
                  All questions completed! 🎉
                </p>
              </div>
            )}
          </div>

          <Link
            to="/practice"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            Explore Coding Practice →
          </Link>
        </div>
      </section>

      {/* Footer Note */}

      <p className="text-center text-xs leading-5 text-slate-400">
        Progress is currently calculated from your locally saved solved
        question IDs and the questions available in your DSA question
        bank.
      </p>
    </main>
  );
}