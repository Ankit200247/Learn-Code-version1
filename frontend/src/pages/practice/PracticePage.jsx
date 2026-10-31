import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TOPICS = [
  "Arrays",
  "Strings",
  "Hashing",
  "Two Pointers",
  "Binary Search",
  "Sorting",
  "Linked List",
  "Stack",
  "Queue",
  "Recursion",
  "Trees",
  "Graphs",
  "Dynamic Programming",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const QUESTIONS = [
  {
    id: "two-sum",
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find two numbers whose sum equals the target.",
    tags: ["Array", "Hashing"],
  },
  {
    id: "largest-element",
    title: "Largest Element in an Array",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find the largest element in an integer array.",
    tags: ["Array"],
  },
  {
    id: "second-largest",
    title: "Second Largest Element",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find the second-largest distinct element.",
    tags: ["Array"],
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest sum.",
    tags: ["Array", "Kadane's Algorithm"],
  },
  {
    id: "best-time-stock",
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Maximize profit by choosing one buying and one selling day.",
    tags: ["Array", "Greedy"],
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    topic: "Hashing",
    difficulty: "Easy",
    description: "Determine whether an array contains duplicate values.",
    tags: ["Hash Set"],
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    topic: "Strings",
    difficulty: "Easy",
    description: "Check whether two strings contain the same characters.",
    tags: ["String", "Hashing"],
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    topic: "Strings",
    difficulty: "Easy",
    description: "Reverse a string without using a built-in reverse method.",
    tags: ["String"],
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    topic: "Two Pointers",
    difficulty: "Easy",
    description: "Check whether a string is a palindrome.",
    tags: ["String", "Two Pointers"],
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    topic: "Two Pointers",
    difficulty: "Easy",
    description: "Move all zeroes to the end while preserving element order.",
    tags: ["Array", "Two Pointers"],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    topic: "Binary Search",
    difficulty: "Easy",
    description: "Find a target in a sorted array.",
    tags: ["Searching"],
  },
  {
    id: "search-rotated",
    title: "Search in Rotated Sorted Array",
    topic: "Binary Search",
    difficulty: "Medium",
    description: "Find a target in a rotated sorted array.",
    tags: ["Searching"],
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    topic: "Sorting",
    difficulty: "Easy",
    description: "Sort an integer array using Bubble Sort.",
    tags: ["Sorting"],
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    topic: "Sorting",
    difficulty: "Medium",
    description: "Merge all overlapping intervals.",
    tags: ["Sorting", "Intervals"],
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    topic: "Linked List",
    difficulty: "Easy",
    description: "Reverse a singly linked list.",
    tags: ["Linked List"],
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    topic: "Linked List",
    difficulty: "Easy",
    description: "Determine whether a linked list contains a cycle.",
    tags: ["Linked List", "Two Pointers"],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    description: "Check whether brackets are correctly balanced.",
    tags: ["Stack", "String"],
  },
  {
    id: "implement-queue",
    title: "Implement Queue Using Stacks",
    topic: "Queue",
    difficulty: "Easy",
    description: "Implement queue operations using stacks.",
    tags: ["Queue", "Stack"],
  },
  {
    id: "factorial",
    title: "Factorial Using Recursion",
    topic: "Recursion",
    difficulty: "Easy",
    description: "Calculate the factorial of a non-negative integer.",
    tags: ["Recursion"],
  },
  {
    id: "fibonacci",
    title: "Fibonacci Number",
    topic: "Recursion",
    difficulty: "Easy",
    description: "Find the nth Fibonacci number.",
    tags: ["Recursion", "Dynamic Programming"],
  },
  {
    id: "max-depth-tree",
    title: "Maximum Depth of Binary Tree",
    topic: "Trees",
    difficulty: "Easy",
    description: "Calculate the maximum depth of a binary tree.",
    tags: ["Tree", "DFS"],
  },
  {
    id: "level-order",
    title: "Binary Tree Level Order Traversal",
    topic: "Trees",
    difficulty: "Medium",
    description: "Return the nodes of a binary tree level by level.",
    tags: ["Tree", "BFS"],
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    description: "Count islands in a grid of land and water.",
    tags: ["Graph", "DFS", "BFS"],
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    topic: "Graphs",
    difficulty: "Medium",
    description: "Determine whether all courses can be completed.",
    tags: ["Graph", "Topological Sort"],
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    description: "Count the ways to climb a staircase taking one or two steps.",
    tags: ["Dynamic Programming"],
  },
  {
    id: "coin-change",
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Find the minimum coins needed to make a target amount.",
    tags: ["Dynamic Programming"],
  },
  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Find the length of the longest strictly increasing subsequence.",
    tags: ["Dynamic Programming", "Binary Search"],
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    topic: "Two Pointers",
    difficulty: "Hard",
    description: "Calculate how much rainwater can be trapped between bars.",
    tags: ["Two Pointers", "Array"],
  },
  {
    id: "median-two-arrays",
    title: "Median of Two Sorted Arrays",
    topic: "Binary Search",
    difficulty: "Hard",
    description: "Find the median of two sorted arrays efficiently.",
    tags: ["Binary Search"],
  },
  {
    id: "word-ladder",
    title: "Word Ladder",
    topic: "Graphs",
    difficulty: "Hard",
    description: "Find the shortest transformation sequence between words.",
    tags: ["Graph", "BFS"],
  },
];

const STORAGE_KEY = "techpath_solved_problems";
const FAVORITES_KEY = "techpath_favorite_problems";

function readStoredIds(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeStoredIds(key, ids) {
  localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </article>
  );
}

function DifficultyBadge({ difficulty }) {
  const styles = {
    Easy: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Medium: "border-amber-200 bg-amber-50 text-amber-700",
    Hard: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[difficulty] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {difficulty}
    </span>
  );
}

export default function PracticePage() {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [statusFilter, setStatusFilter] = useState("All");
  const [solvedIds, setSolvedIds] = useState(() => readStoredIds(STORAGE_KEY));
  const [favoriteIds, setFavoriteIds] = useState(() =>
    readStoredIds(FAVORITES_KEY)
  );

  useEffect(() => {
    const syncProgress = () => {
      setSolvedIds(readStoredIds(STORAGE_KEY));
      setFavoriteIds(readStoredIds(FAVORITES_KEY));
    };

    window.addEventListener("storage", syncProgress);
    window.addEventListener("focus", syncProgress);

    return () => {
      window.removeEventListener("storage", syncProgress);
      window.removeEventListener("focus", syncProgress);
    };
  }, []);

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return QUESTIONS.filter((question) => {
      const matchesSearch =
        !query ||
        question.title.toLowerCase().includes(query) ||
        question.description.toLowerCase().includes(query) ||
        question.topic.toLowerCase().includes(query) ||
        question.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesTopic =
        selectedTopic === "All Topics" || question.topic === selectedTopic;

      const matchesDifficulty =
        selectedDifficulty === "All Levels" ||
        question.difficulty === selectedDifficulty;

      const isSolved = solvedIds.includes(question.id);
      const isFavorite = favoriteIds.includes(question.id);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Solved" && isSolved) ||
        (statusFilter === "Unsolved" && !isSolved) ||
        (statusFilter === "Favorites" && isFavorite);

      return (
        matchesSearch &&
        matchesTopic &&
        matchesDifficulty &&
        matchesStatus
      );
    });
  }, [
    search,
    selectedTopic,
    selectedDifficulty,
    statusFilter,
    solvedIds,
    favoriteIds,
  ]);

  const solvedCount = QUESTIONS.filter((question) =>
    solvedIds.includes(question.id)
  ).length;

  const difficultyCounts = {
    Easy: QUESTIONS.filter(
      (question) =>
        question.difficulty === "Easy" && solvedIds.includes(question.id)
    ).length,
    Medium: QUESTIONS.filter(
      (question) =>
        question.difficulty === "Medium" && solvedIds.includes(question.id)
    ).length,
    Hard: QUESTIONS.filter(
      (question) =>
        question.difficulty === "Hard" && solvedIds.includes(question.id)
    ).length,
  };

  function toggleFavorite(id) {
    setFavoriteIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      writeStoredIds(FAVORITES_KEY, next);
      return next;
    });
  }

  function toggleSolved(id) {
    setSolvedIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      writeStoredIds(STORAGE_KEY, next);
      return next;
    });
  }

  function resetFilters() {
    setSearch("");
    setSelectedTopic("All Topics");
    setSelectedDifficulty("All Levels");
    setStatusFilter("All");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Practice • Improve • Repeat
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            DSA Questions
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Practice data structures and algorithms, track your solved
            questions, and build strong problem-solving skills.
          </p>
        </div>

        <Link
          to="/progress"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 sm:self-auto"
        >
          📊 My Progress <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Questions"
          value={QUESTIONS.length}
          subtitle="Across DSA topics"
          icon="📚"
        />
        <StatCard
          title="Solved"
          value={solvedCount}
          subtitle={`${Math.round((solvedCount / QUESTIONS.length) * 100)}% completed`}
          icon="✅"
        />
        <StatCard
          title="Easy Solved"
          value={difficultyCounts.Easy}
          subtitle="Build your fundamentals"
          icon="🟢"
        />
        <StatCard
          title="Medium + Hard"
          value={difficultyCounts.Medium + difficultyCounts.Hard}
          subtitle="Challenge yourself"
          icon="🔥"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search questions</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by question, topic, or keyword..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[570px]">
            <select
              value={selectedTopic}
              onChange={(event) => setSelectedTopic(event.target.value)}
              aria-label="Filter by topic"
              className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option>All Topics</option>
              {TOPICS.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(event) => setSelectedDifficulty(event.target.value)}
              aria-label="Filter by difficulty"
              className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option>All Levels</option>
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty}>{difficulty}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option value="All">All Questions</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
              <option value="Favorites">Favorites ⭐</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredQuestions.length}
            </span>{" "}
            of {QUESTIONS.length} questions
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-violet-700 hover:text-violet-900"
          >
            Reset filters
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-900">Practice Problems</h2>
            <p className="mt-1 text-xs text-slate-500">
              Select a question to open the coding editor.
            </p>
          </div>
          <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            {solvedCount}/{QUESTIONS.length} completed
          </span>
        </div>

        {filteredQuestions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredQuestions.map((question, index) => {
              const isSolved = solvedIds.includes(question.id);
              const isFavorite = favoriteIds.includes(question.id);

              return (
                <article
                  key={question.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-violet-50/40 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        isSolved
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isSolved ? "✓" : String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {question.title}
                        </h3>
                        <DifficultyBadge difficulty={question.difficulty} />
                        {isSolved && (
                          <span className="text-xs font-semibold text-emerald-700">
                            Solved
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        {question.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700">
                          {question.topic}
                        </span>
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(question.id)}
                      aria-label={
                        isFavorite ? "Remove from favorites" : "Add to favorites"
                      }
                      title={
                        isFavorite ? "Remove from favorites" : "Add to favorites"
                      }
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                        isFavorite
                          ? "border-amber-200 bg-amber-50 text-amber-600"
                          : "border-slate-200 bg-white text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                      }`}
                    >
                      {isFavorite ? "★" : "☆"}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSolved(question.id)}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                        isSolved
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"
                      }`}
                    >
                      {isSolved ? "Mark Unsolved" : "Mark Solved"}
                    </button>

                    <Link
                      to={`/ai-editor?problem=${encodeURIComponent(question.id)}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700"
                    >
                      Solve <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <div className="text-4xl">🔎</div>
            <h3 className="mt-4 font-bold text-slate-900">
              No questions found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-900">
              Keep your DSA streak going 🚀
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Start with Arrays and Strings, strengthen your fundamentals, and
              gradually move toward Trees, Graphs, and Dynamic Programming.
            </p>
          </div>
          <Link
            to="/progress"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            View My Progress →
          </Link>
        </div>
      </section>
    </div>
  );
}