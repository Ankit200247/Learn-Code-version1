import { useEffect, useMemo, useState } from "react";

const QUIZ_DATA = {
  Java: [
    {
      question: "Which keyword is used to create a class in Java?",
      options: ["function", "class", "struct", "define"],
      answer: 1,
      explanation: "Java mein class define karne ke liye class keyword use hota hai.",
    },
    {
      question: "Which method is the entry point of a Java application?",
      options: ["start()", "run()", "main()", "execute()"],
      answer: 2,
      explanation: "Java application execution public static void main(String[] args) se start hota hai.",
    },
    {
      question: "Which data type stores true or false?",
      options: ["int", "char", "boolean", "String"],
      answer: 2,
      explanation: "boolean data type sirf true ya false value store karta hai.",
    },
    {
      question: "Which keyword creates an object in Java?",
      options: ["this", "new", "object", "create"],
      answer: 1,
      explanation: "Java mein new keyword ka use object create karne ke liye hota hai.",
    },
    {
      question: "Which concept allows the same method name with different parameters?",
      options: ["Inheritance", "Encapsulation", "Method overloading", "Abstraction"],
      answer: 2,
      explanation: "Method overloading mein same method name ke saath different parameter lists hoti hain.",
    },
  ],

  "C++": [
    {
      question: "Which symbol ends a statement in C++?",
      options: [".", ":", ";", ","],
      answer: 2,
      explanation: "C++ mein most statements semicolon (;) se end hote hain.",
    },
    {
      question: "Which header is commonly used for cout and cin?",
      options: ["<stdio.h>", "<iostream>", "<string.h>", "<math.h>"],
      answer: 1,
      explanation: "<iostream> header input/output objects jaise cin aur cout provide karta hai.",
    },
    {
      question: "Which operator is used to access a class member through an object?",
      options: [".", "::", "->", "&"],
      answer: 0,
      explanation: "Object ke through member access karne ke liye dot (.) operator use hota hai.",
    },
    {
      question: "Which loop executes its body at least once?",
      options: ["for", "while", "do-while", "None"],
      answer: 2,
      explanation: "do-while loop condition check karne se pehle body execute karta hai.",
    },
    {
      question: "What is the usual return type of the main function in modern C++?",
      options: ["void", "char", "int", "float"],
      answer: 2,
      explanation: "C++ mein main function ka standard return type int hota hai.",
    },
  ],

  DSA: [
    {
      question: "Which data structure follows FIFO?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: 1,
      explanation: "FIFO ka matlab First In, First Out hai, jo Queue follow karti hai.",
    },
    {
      question: "Which data structure follows LIFO?",
      options: ["Queue", "Array", "Stack", "Graph"],
      answer: 2,
      explanation: "LIFO ka matlab Last In, First Out hai, jo Stack follow karta hai.",
    },
    {
      question: "What is the time complexity of binary search on a sorted array?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1) always"],
      answer: 1,
      explanation: "Binary search har step mein search space ko approximately half kar deta hai.",
    },
    {
      question: "Which data structure stores elements in indexed positions?",
      options: ["Array", "Tree only", "Graph only", "Queue only"],
      answer: 0,
      explanation: "Array ke elements ko index ke through access kiya ja sakta hai.",
    },
    {
      question: "Which data structure is commonly used in recursion?",
      options: ["Stack", "Queue only", "Hash table only", "Graph only"],
      answer: 0,
      explanation: "Function calls aur recursion ko manage karne ke liye call stack use hota hai.",
    },
  ],

  DBMS: [
    {
      question: "What does DBMS stand for?",
      options: [
        "Data Backup Management System",
        "Database Management System",
        "Digital Base Management Service",
        "Database Machine Setup",
      ],
      answer: 1,
      explanation: "DBMS ka full form Database Management System hai.",
    },
    {
      question: "Which SQL command retrieves data from a table?",
      options: ["GET", "OPEN", "SELECT", "FETCHTABLE"],
      answer: 2,
      explanation: "SELECT statement database tables se data retrieve karta hai.",
    },
    {
      question: "Which key uniquely identifies each row in a table?",
      options: ["Foreign key", "Primary key", "Duplicate key", "Secondary value"],
      answer: 1,
      explanation: "Primary key table ki har row ko uniquely identify karti hai.",
    },
    {
      question: "What is the purpose of a foreign key?",
      options: [
        "To connect related tables",
        "To delete every row",
        "To format a database",
        "To rename SQL",
      ],
      answer: 0,
      explanation: "Foreign key tables ke beech relationship establish karne mein help karti hai.",
    },
    {
      question: "Which SQL command removes selected rows from a table?",
      options: ["REMOVE", "DROP", "DELETE", "CLEAR"],
      answer: 2,
      explanation: "DELETE command condition ke basis par table se rows remove kar sakti hai.",
    },
  ],

  "Operating Systems": [
    {
      question: "What is the main role of an operating system?",
      options: [
        "Only create websites",
        "Manage computer resources",
        "Only edit images",
        "Only store passwords",
      ],
      answer: 1,
      explanation: "Operating system hardware resources aur software processes ko manage karta hai.",
    },
    {
      question: "Which is an example of an operating system?",
      options: ["Linux", "HTML", "MySQL", "React"],
      answer: 0,
      explanation: "Linux ek operating system hai.",
    },
    {
      question: "What is a process?",
      options: [
        "A program in execution",
        "A type of monitor",
        "A database table",
        "A programming language",
      ],
      answer: 0,
      explanation: "Process ek program hota hai jo currently execute ho raha hota hai.",
    },
    {
      question: "Which memory is generally faster?",
      options: ["Hard disk", "Cache memory", "DVD", "USB drive"],
      answer: 1,
      explanation: "Cache memory CPU ke frequently used data ko quickly access karne mein help karti hai.",
    },
    {
      question: "What is multitasking?",
      options: [
        "Running or managing multiple tasks over time",
        "Deleting all files",
        "Using one keyboard key",
        "Formatting RAM",
      ],
      answer: 0,
      explanation: "Multitasking OS ko multiple tasks ke execution ko manage karne deta hai.",
    },
  ],

  "Computer Networks": [
    {
      question: "What does LAN stand for?",
      options: [
        "Large Access Node",
        "Local Area Network",
        "Logical Application Network",
        "Long Area Network",
      ],
      answer: 1,
      explanation: "LAN ka full form Local Area Network hai.",
    },
    {
      question: "Which protocol is commonly used to browse secure websites?",
      options: ["FTP", "HTTP only", "HTTPS", "SMTP"],
      answer: 2,
      explanation: "HTTPS web communication ko TLS ke through secure karta hai.",
    },
    {
      question: "Which device forwards packets between different networks?",
      options: ["Keyboard", "Router", "Monitor", "Scanner"],
      answer: 1,
      explanation: "Router different networks ke beech packets forward karta hai.",
    },
    {
      question: "What does IP stand for in IP address?",
      options: [
        "Internet Protocol",
        "Internal Program",
        "Integrated Process",
        "Information Port",
      ],
      answer: 0,
      explanation: "IP ka full form Internet Protocol hai.",
    },
    {
      question: "Which protocol is commonly used to send email?",
      options: ["SMTP", "FTP", "ARP", "DHCP"],
      answer: 0,
      explanation: "SMTP ka use email send karne ke liye commonly hota hai.",
    },
  ],
};

const STORAGE_KEY = "techpath_quiz_best_scores";

function readBestScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function BeginnerZoneQuiz() {
  const topics = useMemo(() => Object.keys(QUIZ_DATA), []);

  const [selectedTopic, setSelectedTopic] = useState("Java");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [bestScores, setBestScores] = useState(readBestScores);

  const questions = QUIZ_DATA[selectedTopic];
  const currentQuestion = questions[questionIndex];
  const totalQuestions = questions.length;
  const answered = selectedAnswer !== null;
  const progress = quizFinished
    ? 100
    : ((questionIndex + (answered ? 1 : 0)) / totalQuestions) * 100;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bestScores));
    } catch {
      // Quiz remains usable if browser storage is unavailable.
    }
  }, [bestScores]);

  function changeTopic(topic) {
    setSelectedTopic(topic);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  }

  function chooseAnswer(optionIndex) {
    if (answered || quizFinished) return;

    setSelectedAnswer(optionIndex);

    if (optionIndex === currentQuestion.answer) {
      setScore((previousScore) => previousScore + 1);
    }
  }

  function goToNextQuestion() {
    if (!answered) return;

    if (questionIndex === totalQuestions - 1) {
      setQuizFinished(true);

      const finalScore = score;
      const previousBest = bestScores[selectedTopic] || 0;
      const newBest = Math.max(previousBest, finalScore);

      setBestScores((previous) => ({
        ...previous,
        [selectedTopic]: newBest,
      }));

      return;
    }

    setQuestionIndex((previousIndex) => previousIndex + 1);
    setSelectedAnswer(null);
  }

  function restartQuiz() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  }

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <section className="my-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">
            Beginner Practice
          </span>

          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Interactive MCQ Quiz
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Practice important computer science concepts and track your best scores.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 sm:min-w-36">
          <p className="text-xs font-medium text-slate-500">Your Best Score</p>
          <p className="mt-1 text-xl font-bold text-indigo-700">
            {bestScores[selectedTopic] ?? 0}/{totalQuestions}
          </p>
          <p className="text-xs text-slate-500">{selectedTopic}</p>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="beginner-quiz-topic"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Choose a topic
        </label>

        <select
          id="beginner-quiz-topic"
          value={selectedTopic}
          onChange={(event) => changeTopic(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:max-w-sm"
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            {quizFinished
              ? "Quiz completed"
              : `Question ${questionIndex + 1} of ${totalQuestions}`}
          </span>
          <span className="font-semibold text-indigo-700">
            {Math.round(progress)}%
          </span>
        </div>

        <ProgressBar value={progress} />
      </div>

      {quizFinished ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
            {percentage >= 80 ? "🏆" : percentage >= 50 ? "🎉" : "💪"}
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-900">
            {percentage >= 80
              ? "Excellent work!"
              : percentage >= 50
                ? "Good effort!"
                : "Keep practising!"}
          </h3>

          <p className="mt-2 text-slate-600">
            You completed the {selectedTopic} quiz.
          </p>

          <div className="my-6">
            <p className="text-4xl font-extrabold text-indigo-700">
              {score}/{totalQuestions}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Correct answers · {percentage}%
            </p>
          </div>

          <button
            type="button"
            onClick={restartQuiz}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Retry Quiz
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
            {selectedTopic} · MCQ
          </p>

          <h3 className="mt-3 text-lg font-bold leading-relaxed text-slate-900 sm:text-xl">
            {currentQuestion.question}
          </h3>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.answer;
              const isSelected = selectedAnswer === index;

              let optionStyle =
                "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50";

              if (answered && isCorrect) {
                optionStyle =
                  "border-green-500 bg-green-50 text-green-800";
              } else if (answered && isSelected && !isCorrect) {
                optionStyle =
                  "border-red-400 bg-red-50 text-red-800";
              }

              return (
                <button
                  key={`${questionIndex}-${option}`}
                  type="button"
                  onClick={() => chooseAnswer(index)}
                  disabled={answered}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${optionStyle}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="flex-1 text-sm font-medium sm:text-base">
                    {option}
                  </span>

                  {answered && isCorrect && (
                    <span className="font-bold text-green-700">✓</span>
                  )}

                  {answered && isSelected && !isCorrect && (
                    <span className="font-bold text-red-600">✕</span>
                  )}
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={`mt-5 rounded-xl border p-4 ${
                selectedAnswer === currentQuestion.answer
                  ? "border-green-200 bg-green-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <p className="font-bold text-slate-900">
                {selectedAnswer === currentQuestion.answer
                  ? "Correct answer! 🎉"
                  : "Not quite. Keep learning!"}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Score: <strong className="text-slate-900">{score}</strong> /{" "}
              {totalQuestions}
            </p>

            <button
              type="button"
              onClick={goToNextQuestion}
              disabled={!answered}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {questionIndex === totalQuestions - 1
                ? "Finish Quiz"
                : "Next Question →"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <strong className="text-slate-800">Tip:</strong> Answer each question
          before moving forward. Your best score for each topic is saved in
          this browser.
        </p>
      </div>
    </section>
  );
}