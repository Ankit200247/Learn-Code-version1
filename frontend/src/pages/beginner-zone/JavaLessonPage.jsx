import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import learningContent from "../../data/learningContent";

export default function JavaLessonPage() {
  const { subjectSlug, moduleId } = useParams();
  const navigate = useNavigate();

  const subject = learningContent[subjectSlug || "java"];

  const module = subject?.modules.find(
    (item) => item.id === moduleId
  );

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!subject || !module) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Lesson not found
        </h1>

        <p className="mt-2 text-slate-600">
          The requested learning module could not be found.
        </p>

        <Link
          to="/beginner-zone"
          className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Back to Beginner Zone
        </Link>
      </div>
    );
  }

  const lessons = module.lessons;
  const lesson = lessons[currentLessonIndex];

  const quizQuestions = [
    {
      question: `Which language are you currently learning in ${subject.title}?`,
      options: [
        subject.title,
        "HTML",
        "CSS",
        "SQL",
      ],
      correctAnswer: 0,
      explanation: `This module belongs to ${subject.title}.`,
    },
    {
      question: "What should you do when learning a new programming concept?",
      options: [
        "Only memorize the definition",
        "Understand it and practise with code",
        "Skip all examples",
        "Avoid practising",
      ],
      correctAnswer: 1,
      explanation:
        "Understanding a concept and practising it helps develop programming skills.",
    },
    {
      question: "What is the best way to improve programming skills?",
      options: [
        "Never write code",
        "Only read titles",
        "Practise regularly",
        "Avoid solving problems",
      ],
      correctAnswer: 2,
      explanation:
        "Regular practice helps improve problem-solving and programming ability.",
    },
    {
      question: "What should you do if your program produces an error?",
      options: [
        "Read the error and debug the code",
        "Immediately stop learning",
        "Delete the whole project",
        "Ignore the error",
      ],
      correctAnswer: 0,
      explanation:
        "Reading errors and debugging helps you identify and fix problems.",
    },
    {
      question: "When should you move to the next lesson?",
      options: [
        "Without reading anything",
        "After understanding and practising the current lesson",
        "Immediately after opening it",
        "Only after memorizing every word",
      ],
      correctAnswer: 1,
      explanation:
        "Understanding and practising the current lesson gives you a stronger foundation.",
    },
  ];

  const handleLessonChange = (index) => {
    setCurrentLessonIndex(index);
    setShowQuiz(false);
    setSelectedAnswers({});
    setQuizSubmitted(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (quizSubmitted) return;

    setSelectedAnswers((previous) => ({
      ...previous,
      [questionIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    return quizQuestions.reduce((score, question, index) => {
      return score +
        (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      handleLessonChange(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      handleLessonChange(currentLessonIndex - 1);
    }
  };

  const progressPercentage = Math.round(
    ((currentLessonIndex + 1) / lessons.length) * 100
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link
          to="/beginner-zone"
          className="hover:text-indigo-600"
        >
          Beginner Zone
        </Link>

        <span>/</span>

        <Link
          to={`/beginner-zone/${subject.id}`}
          className="hover:text-indigo-600"
        >
          {subject.title}
        </Link>

        <span>/</span>

        <span className="font-medium text-slate-800">
          {module.title}
        </span>
      </div>

      {/* Header */}
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-700">
              {subject.title} · {module.title}
            </p>

            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {lesson.title}
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Lesson {currentLessonIndex + 1} of {lessons.length}
              {" · "}
              {lesson.duration}
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
            {subject.icon}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
            <span>Module progress</span>
            <span>{progressPercentage}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Lesson Sidebar */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 px-2 text-sm font-bold uppercase tracking-wider text-slate-500">
            Module Lessons
          </h2>

          <div className="space-y-2">
            {lessons.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLessonChange(index)}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                  index === currentLessonIndex
                    ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    index === currentLessonIndex
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {index + 1}
                </span>

                <span className="pt-1 text-sm font-medium">
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          <Link
            to={`/beginner-zone/${subject.id}`}
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            ← All Modules
          </Link>
        </aside>

        {/* Lesson Body */}
        <main className="min-w-0 space-y-6">
          {!showQuiz ? (
            <>
              {/* Explanation */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900">
                  Lesson Explanation
                </h2>

                <div className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 sm:text-base">
                  {lesson.content.trim()}
                </div>
              </section>

              {/* Key Points */}
              <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-7">
                <h2 className="text-lg font-bold text-slate-900">
                  Key Takeaways
                </h2>

                <ul className="mt-4 space-y-3">
                  {lesson.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        ✓
                      </span>

                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Code Example */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Code Example
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Study the code and its output.
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {subject.title}
                  </span>
                </div>

                <pre className="overflow-x-auto bg-slate-950 p-5 text-sm leading-6 text-emerald-300 sm:p-6">
                  <code>{lesson.code}</code>
                </pre>

                <div className="border-t border-slate-200 p-5">
                  <h3 className="mb-3 text-sm font-bold text-slate-900">
                    Expected Output
                  </h3>

                  <pre className="overflow-x-auto rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <code>{lesson.output}</code>
                  </pre>
                </div>
              </section>

              {/* Lesson Navigation */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous Lesson
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowQuiz(true);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Take Lesson Quiz →
                </button>

                <button
                  type="button"
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next Lesson →
                </button>
              </div>
            </>
          ) : (
            /* Quiz */
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
              <div className="mb-6">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  Knowledge Check
                </span>

                <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
                  Test Your Understanding
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Answer all five questions and submit your answers.
                </p>
              </div>

              <div className="space-y-6">
                {quizQuestions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="rounded-xl border border-slate-200 p-4 sm:p-5"
                  >
                    <h3 className="font-semibold leading-6 text-slate-900">
                      {questionIndex + 1}. {question.question}
                    </h3>

                    <div className="mt-4 space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected =
                          selectedAnswers[questionIndex] === optionIndex;

                        const isCorrect =
                          question.correctAnswer === optionIndex;

                        let optionStyle =
                          "border-slate-200 hover:bg-slate-50";

                        if (isSelected) {
                          optionStyle =
                            "border-indigo-400 bg-indigo-50 text-indigo-800";
                        }

                        if (quizSubmitted && isCorrect) {
                          optionStyle =
                            "border-emerald-300 bg-emerald-50 text-emerald-800";
                        } else if (
                          quizSubmitted &&
                          isSelected &&
                          !isCorrect
                        ) {
                          optionStyle =
                            "border-red-300 bg-red-50 text-red-800";
                        }

                        return (
                          <button
                            key={optionIndex}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() =>
                              handleAnswerSelect(
                                questionIndex,
                                optionIndex
                              )
                            }
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${optionStyle}`}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current/20 text-xs font-bold">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        <strong>Explanation:</strong>{" "}
                        {question.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {quizSubmitted ? (
                <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                  <h3 className="text-xl font-bold text-indigo-900">
                    Your Score: {calculateScore()} / {quizQuestions.length}
                  </h3>

                  <p className="mt-2 text-sm text-indigo-800">
                    {calculateScore() === quizQuestions.length
                      ? "Excellent! You answered every question correctly."
                      : "Review the explanations and try again to improve your score."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="rounded-xl border border-indigo-200 bg-white px-5 py-3 font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      Try Again
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowQuiz(false);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                    >
                      Back to Lesson
                    </button>

                    {currentLessonIndex < lessons.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          handleLessonChange(currentLessonIndex + 1);
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Next Lesson →
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={
                    Object.keys(selectedAnswers).length !==
                    quizQuestions.length
                  }
                  onClick={() => setQuizSubmitted(true)}
                  className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit Answers
                </button>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}