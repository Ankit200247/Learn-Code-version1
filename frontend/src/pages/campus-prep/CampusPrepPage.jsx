import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const QUESTIONS = [
  {
    id: 1,
    topic: "Java",
    difficulty: "Easy",
    question: "Which concept allows a class to acquire properties of another class?",
    options: [
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Abstraction",
    ],
    answer: 1,
    explanation:
      "Inheritance allows a child class to reuse accessible properties and methods of a parent class.",
  },
  {
    id: 2,
    topic: "Java",
    difficulty: "Easy",
    question: "Which keyword is used to create an object in Java?",
    options: ["class", "static", "new", "this"],
    answer: 2,
    explanation:
      "The new keyword creates an object and invokes the class constructor.",
  },
  {
    id: 3,
    topic: "Java",
    difficulty: "Medium",
    question: "Which statement about Java interfaces is correct?",
    options: [
      "An interface cannot contain methods",
      "A class can implement multiple interfaces",
      "A class can extend multiple classes",
      "Interfaces cannot define default methods",
    ],
    answer: 1,
    explanation:
      "A Java class can implement multiple interfaces. Java does not support extending multiple classes.",
  },
  {
    id: 4,
    topic: "Java",
    difficulty: "Medium",
    question: "What is method overloading?",
    options: [
      "Defining methods with the same name but different parameter lists",
      "Defining two classes with the same name",
      "Overriding a private method",
      "Calling a method recursively",
    ],
    answer: 0,
    explanation:
      "Overloading allows methods to share a name while differing in their parameter lists.",
  },
  {
    id: 5,
    topic: "DSA",
    difficulty: "Easy",
    question: "What is the time complexity of accessing an array element by index?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    answer: 2,
    explanation:
      "Array elements can be accessed directly using their index in constant time, O(1).",
  },
  {
    id: 6,
    topic: "DSA",
    difficulty: "Easy",
    question: "Which data structure follows LIFO?",
    options: ["Queue", "Stack", "Linked List", "Graph"],
    answer: 1,
    explanation:
      "LIFO means Last In, First Out. A stack removes the most recently inserted item first.",
  },
  {
    id: 7,
    topic: "DSA",
    difficulty: "Easy",
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Tree", "Queue", "Heap"],
    answer: 2,
    explanation:
      "FIFO means First In, First Out. A queue removes elements in insertion order.",
  },
  {
    id: 8,
    topic: "DSA",
    difficulty: "Medium",
    question: "What is the average time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    answer: 1,
    explanation:
      "Binary search halves the search interval at each step, resulting in O(log n) time.",
  },
  {
    id: 9,
    topic: "DSA",
    difficulty: "Medium",
    question: "Which algorithmic technique is commonly used to find the maximum subarray sum in O(n) time?",
    options: [
      "Binary Search",
      "Kadane's Algorithm",
      "Selection Sort",
      "Breadth-First Search",
    ],
    answer: 1,
    explanation:
      "Kadane's algorithm tracks the best subarray ending at each position in linear time.",
  },
  {
    id: 10,
    topic: "DBMS",
    difficulty: "Easy",
    question: "Which SQL command retrieves data from a table?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    answer: 2,
    explanation:
      "SELECT retrieves rows and columns from one or more database tables.",
  },
  {
    id: 11,
    topic: "DBMS",
    difficulty: "Easy",
    question: "What is the main purpose of a primary key?",
    options: [
      "To allow duplicate rows",
      "To uniquely identify each row",
      "To sort every column automatically",
      "To encrypt table data",
    ],
    answer: 1,
    explanation:
      "A primary key uniquely identifies a row and cannot contain duplicate or NULL values.",
  },
  {
    id: 12,
    topic: "DBMS",
    difficulty: "Medium",
    question: "Which normal form removes partial functional dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF only"],
    answer: 1,
    explanation:
      "Second Normal Form requires 1NF and eliminates partial dependencies of non-key attributes on candidate keys.",
  },
  {
    id: 13,
    topic: "Operating Systems",
    difficulty: "Easy",
    question: "Which of the following is an operating system?",
    options: ["MySQL", "Linux", "React", "Node.js"],
    answer: 1,
    explanation:
      "Linux is an operating system kernel used in many Linux distributions.",
  },
  {
    id: 14,
    topic: "Operating Systems",
    difficulty: "Medium",
    question: "What is a context switch?",
    options: [
      "Changing a database schema",
      "Switching the CPU from one process or thread to another",
      "Compiling a program",
      "Allocating a file name",
    ],
    answer: 1,
    explanation:
      "A context switch saves the execution state of one process or thread and restores another's state.",
  },
  {
    id: 15,
    topic: "Computer Networks",
    difficulty: "Easy",
    question: "Which protocol is commonly used to securely access websites?",
    options: ["FTP", "HTTP only", "HTTPS", "SMTP"],
    answer: 2,
    explanation:
      "HTTPS uses TLS to protect HTTP communication between a browser and a server.",
  },
  {
    id: 16,
    topic: "Computer Networks",
    difficulty: "Medium",
    question: "Which OSI layer is responsible for routing packets between networks?",
    options: [
      "Physical Layer",
      "Data Link Layer",
      "Network Layer",
      "Application Layer",
    ],
    answer: 2,
    explanation:
      "The Network Layer handles logical addressing and routing packets across interconnected networks.",
  },
  {
    id: 17,
    topic: "Aptitude",
    difficulty: "Easy",
    question: "A product costs ₹800. Its price increases by 25%. What is the new price?",
    options: ["₹900", "₹1,000", "₹1,025", "₹1,200"],
    answer: 1,
    explanation:
      "25% of 800 is 200. The new price is 800 + 200 = ₹1,000.",
  },
  {
    id: 18,
    topic: "Aptitude",
    difficulty: "Easy",
    question: "The average of 10, 20, and 30 is:",
    options: ["15", "20", "25", "30"],
    answer: 1,
    explanation:
      "Average = (10 + 20 + 30) / 3 = 20.",
  },
  {
    id: 19,
    topic: "Aptitude",
    difficulty: "Medium",
    question: "A car travels 150 km in 3 hours. What is its average speed?",
    options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"],
    answer: 2,
    explanation:
      "Average speed = distance / time = 150 / 3 = 50 km/h.",
  },
  {
    id: 20,
    topic: "OOP",
    difficulty: "Easy",
    question: "Which OOP principle hides internal implementation details?",
    options: [
      "Inheritance",
      "Abstraction",
      "Recursion",
      "Compilation",
    ],
    answer: 1,
    explanation:
      "Abstraction exposes essential functionality while hiding unnecessary implementation details.",
  },
];

const TOPICS = [
  "All Topics",
  ...new Set(QUESTIONS.map((question) => question.topic)),
];

const DIFFICULTIES = ["All Levels", "Easy", "Medium"];

function readHistory() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("techpath_campus_quiz_history") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function shuffleQuestions(questions) {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export default function CampusPrepPage() {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [quizQuestions, setQuizQuestions] = useState(QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [history, setHistory] = useState(readHistory);
  const [quizStarted, setQuizStarted] = useState(false);

  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter((question) => {
      const topicMatches =
        selectedTopic === "All Topics" ||
        question.topic === selectedTopic;

      const difficultyMatches =
        selectedDifficulty === "All Levels" ||
        question.difficulty === selectedDifficulty;

      return topicMatches && difficultyMatches;
    });
  }, [selectedTopic, selectedDifficulty]);

  const currentQuestion = quizQuestions[currentIndex];

  const answeredCount = Object.keys(answers).length;

  const correctCount = quizQuestions.reduce((count, question) => {
    return count + (answers[question.id] === question.answer ? 1 : 0);
  }, 0);

  const percentage = quizQuestions.length
    ? Math.round((correctCount / quizQuestions.length) * 100)
    : 0;

  const startQuiz = (shuffle = false) => {
    const questions = shuffle
      ? shuffleQuestions(filteredQuestions)
      : [...filteredQuestions];

    setQuizQuestions(questions);
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setReviewMode(false);
    setQuizStarted(true);
  };

  const selectAnswer = (optionIndex) => {
    if (submitted) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const finishQuiz = () => {
    if (submitted || quizQuestions.length === 0) return;

    const score = quizQuestions.reduce(
      (count, question) =>
        count + (answers[question.id] === question.answer ? 1 : 0),
      0
    );

    const result = {
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      total: quizQuestions.length,
      answered: Object.keys(answers).length,
      correct: score,
      percentage: Math.round((score / quizQuestions.length) * 100),
    };

    const updatedHistory = [result, ...history].slice(0, 20);

    setHistory(updatedHistory);
    setSubmitted(true);

    localStorage.setItem(
      "techpath_campus_quiz_history",
      JSON.stringify(updatedHistory)
    );
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizQuestions(filteredQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setReviewMode(false);
  };

  const clearHistory = () => {
    const confirmed = window.confirm(
      "Delete all saved quiz results from this browser?"
    );

    if (!confirmed) return;

    setHistory([]);
    localStorage.removeItem("techpath_campus_quiz_history");
  };

  const averageScore = history.length
    ? Math.round(
        history.reduce((sum, result) => sum + result.percentage, 0) /
          history.length
      )
    : 0;

  return (
    <main className="min-h-screen space-y-7 bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Placement Preparation
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Campus Prep
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              Practice technical MCQs, strengthen computer science
              fundamentals, and improve your aptitude before placement tests.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startQuiz(false)}
                disabled={filteredQuestions.length === 0}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:opacity-50"
              >
                Start Practice →
              </button>

              <button
                type="button"
                onClick={() => startQuiz(true)}
                disabled={filteredQuestions.length === 0}
                className="rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800 disabled:opacity-50"
              >
                Random Quiz
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Question Bank</p>
              <p className="mt-2 text-3xl font-bold">{QUESTIONS.length}</p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Quiz Attempts</p>
              <p className="mt-2 text-3xl font-bold">{history.length}</p>
            </div>

            <div className="col-span-2 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">Average Quiz Score</p>
                <span className="font-semibold text-indigo-300">
                  {averageScore}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${averageScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Choose Your Practice</h2>
          <p className="mt-1 text-sm text-slate-400">
            Filter questions according to your preparation needs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="campus-topic"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Topic
            </label>

            <select
              id="campus-topic"
              value={selectedTopic}
              onChange={(event) => {
                setSelectedTopic(event.target.value);
                resetQuiz();
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="campus-difficulty"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Difficulty
            </label>

            <select
              id="campus-difficulty"
              value={selectedDifficulty}
              onChange={(event) => {
                setSelectedDifficulty(event.target.value);
                resetQuiz();
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              {DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {filteredQuestions.length} questions match your selected filters.
        </p>
      </section>

      {/* Quiz interface */}
      {quizStarted && currentQuestion && !reviewMode && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
          {!submitted ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">
                  Question {currentIndex + 1} of {quizQuestions.length}
                </span>

                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400">
                    {currentQuestion.topic}
                  </span>

                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      currentQuestion.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${
                      ((currentIndex + 1) / quizQuestions.length) * 100
                    }%`,
                  }}
                />
              </div>

              <h2 className="mt-7 text-xl font-bold leading-8 sm:text-2xl">
                {currentQuestion.question}
              </h2>

              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const selected = answers[currentQuestion.id] === index;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(index)}
                      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-slate-800 bg-slate-950 hover:border-slate-600"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold ${
                          selected
                            ? "border-indigo-500 bg-indigo-600 text-white"
                            : "border-slate-700 bg-slate-900 text-slate-400"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="text-sm leading-6">{option}</span>

                      {selected && (
                        <span className="ml-auto text-indigo-400">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((index) => Math.max(0, index - 1))
                  }
                  disabled={currentIndex === 0}
                  className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                <span className="text-xs text-slate-500">
                  {answeredCount} of {quizQuestions.length} answered
                </span>

                {currentIndex < quizQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((index) =>
                        Math.min(quizQuestions.length - 1, index + 1)
                      )
                    }
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishQuiz}
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold transition hover:bg-emerald-500"
                  >
                    Finish Quiz
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="py-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl">
                  {percentage >= 70 ? "🏆" : percentage >= 40 ? "💪" : "📚"}
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  {percentage >= 70
                    ? "Great work!"
                    : percentage >= 40
                      ? "Good effort!"
                      : "Keep practicing!"}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Your quiz results are ready.
                </p>

                <p className="mt-6 text-5xl font-bold text-indigo-400">
                  {percentage}%
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {correctCount} correct out of {quizQuestions.length} questions
                </p>

                <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Correct</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-400">
                      {correctCount}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Incorrect / Skipped</p>
                    <p className="mt-2 text-2xl font-bold text-red-400">
                      {quizQuestions.length - correctCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-slate-800 pt-6">
                <button
                  type="button"
                  onClick={() => setReviewMode(true)}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800"
                >
                  Review Answers
                </button>

                <button
                  type="button"
                  onClick={() => startQuiz(true)}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500"
                >
                  Try Again
                </button>

                <button
                  type="button"
                  onClick={resetQuiz}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800"
                >
                  Back to Practice
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* Answer review */}
      {quizStarted && reviewMode && submitted && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Answer Review</h2>

            <button
              type="button"
              onClick={() => setReviewMode(false)}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
            >
              Back to Results
            </button>
          </div>

          {quizQuestions.map((question, index) => {
            const selected = answers[question.id];
            const isCorrect = selected === question.answer;

            return (
              <article
                key={question.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Question {index + 1} · {question.topic}
                  </span>

                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      isCorrect
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <h3 className="mt-4 font-semibold leading-7">
                  {question.question}
                </h3>

                <div className="mt-4 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isAnswer = optionIndex === question.answer;
                    const isSelected = optionIndex === selected;

                    return (
                      <div
                        key={option}
                        className={`rounded-xl border p-3 text-sm leading-6 ${
                          isAnswer
                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                            : isSelected
                              ? "border-red-500/30 bg-red-500/5 text-red-300"
                              : "border-slate-800 text-slate-400"
                        }`}
                      >
                        <span className="mr-2 font-semibold">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>

                        {option}

                        {isAnswer && " ✓ Correct answer"}

                        {isSelected && !isAnswer && " · Your answer"}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
                    Explanation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {question.explanation}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Initial question bank */}
      {!quizStarted && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Practice Topics</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Choose a topic and start a quiz. Each question includes an
                explanation so you can understand the concept after practice.
              </p>
            </div>

            <button
              type="button"
              onClick={() => startQuiz(true)}
              disabled={filteredQuestions.length === 0}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:opacity-50"
            >
              Start Random Quiz →
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {TOPICS.filter((topic) => topic !== "All Topics").map((topic) => {
              const count = QUESTIONS.filter(
                (question) => question.topic === topic
              ).length;

              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(topic);
                    setQuizQuestions(
                      QUESTIONS.filter((question) => question.topic === topic)
                    );
                    setSelectedDifficulty("All Levels");
                    setCurrentIndex(0);
                    setAnswers({});
                    setSubmitted(false);
                    setReviewMode(false);
                    setQuizStarted(true);
                  }}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-indigo-500/50"
                >
                  <h3 className="font-semibold">{topic}</h3>

                  <p className="mt-2 text-xs text-slate-500">
                    {count} questions
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Quiz history */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Recent Quiz History</h2>

            <p className="mt-1 text-sm text-slate-400">
              Your latest attempts saved in this browser.
            </p>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="text-sm text-red-400 transition hover:text-red-300"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="mt-5 space-y-3">
            {history.slice(0, 5).map((result) => (
              <article
                key={result.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {result.topic} · {result.difficulty}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(result.date).toLocaleString("en-IN")}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {result.correct}/{result.total} correct · {result.answered}{" "}
                    answered
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>

                  <span className="text-lg font-bold text-indigo-400">
                    {result.percentage}%
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-800 p-8 text-center">
            <p className="font-semibold">No quiz attempts yet</p>

            <p className="mt-2 text-sm text-slate-400">
              Complete your first quiz to start building your practice history.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <section className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
        <h2 className="font-bold">Placement preparation tip</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Don't just memorize the correct option. Read the explanation,
          understand why the other options are incorrect, and revisit
          questions you missed.
        </p>
      </section>
    </main>
  );
}