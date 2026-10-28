import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "./BeginnerZone.css";
import "./DailyChallengeCalendar.css";

const LANGUAGES = [
  { id: "java", name: "Java", icon: "☕" },
  { id: "c", name: "C", icon: "C" },
  { id: "cpp", name: "C++", icon: "⚙️" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "javascript", name: "JavaScript", icon: "🟨" },
];

const DAILY_CHALLENGES = [
  { id: "sum-two", title: "Sum of Two Numbers", difficulty: "Easy", points: 10, topic: "Fundamentals", statement: "Read two integers and print their sum.", input: "7 5", output: "12", hint: "Read two values, add them, then print the result." },
  { id: "even-odd", title: "Even or Odd", difficulty: "Easy", points: 10, topic: "Conditionals", statement: "Read an integer. Print Even if it is divisible by 2; otherwise print Odd.", input: "8", output: "Even", hint: "Use the remainder operator (%)." },
  { id: "largest-three", title: "Largest of Three", difficulty: "Easy", points: 15, topic: "Conditionals", statement: "Read three integers and print the largest number.", input: "4 9 6", output: "9", hint: "Compare all three values, or use a built-in maximum function." },
  { id: "count-to-n", title: "Count from 1 to N", difficulty: "Easy", points: 10, topic: "Loops", statement: "Read N and print the numbers from 1 to N, each on a new line.", input: "5", output: "1\n2\n3\n4\n5", hint: "Use a loop that starts at 1 and ends at N." },
  { id: "factorial", title: "Factorial", difficulty: "Medium", points: 20, topic: "Loops", statement: "Read a non-negative integer N and print N factorial. For 0, print 1.", input: "5", output: "120", hint: "Start the product at 1 and multiply by each number from 1 through N." },
  { id: "reverse-string", title: "Reverse a String", difficulty: "Easy", points: 15, topic: "Strings", statement: "Read a single word and print it in reverse order.", input: "hello", output: "olleh", hint: "Walk through the characters from the end to the beginning." },
  { id: "sum-array", title: "Sum of Array", difficulty: "Medium", points: 20, topic: "Arrays", statement: "Read N followed by N integers, then print their sum.", input: "5\n1 2 3 4 5", output: "15", hint: "Keep a running total as you read each value." },
  { id: "positive-negative", title: "Positive, Negative or Zero", difficulty: "Easy", points: 10, topic: "Conditionals", statement: "Read an integer and print Positive, Negative, or Zero.", input: "-3", output: "Negative", hint: "Compare the value with zero." },
  { id: "multiplication-table", title: "Multiplication Table", difficulty: "Easy", points: 10, topic: "Loops", statement: "Read N and print its multiplication table from 1 to 5, one result per line.", input: "3", output: "3\n6\n9\n12\n15", hint: "Multiply N by each number from 1 through 5." },
  { id: "count-vowels", title: "Count Vowels", difficulty: "Easy", points: 10, topic: "Strings", statement: "Read a lowercase word and print how many vowels it contains.", input: "education", output: "5", hint: "Check each character against a, e, i, o, and u." },
  { id: "digit-sum", title: "Sum of Digits", difficulty: "Easy", points: 10, topic: "Numbers", statement: "Read a non-negative integer and print the sum of its digits.", input: "1234", output: "10", hint: "Use % 10 to get the last digit and / 10 to remove it." },
  { id: "palindrome-number", title: "Palindrome Number", difficulty: "Easy", points: 15, topic: "Numbers", statement: "Print Yes if the given number reads the same backwards, otherwise print No.", input: "121", output: "Yes", hint: "Reverse the digits and compare with the original number." },
  { id: "max-array", title: "Maximum in an Array", difficulty: "Easy", points: 15, topic: "Arrays", statement: "Read N and N integers, then print the maximum value.", input: "5\n2 9 1 7 4", output: "9", hint: "Track the largest value seen so far." },
  { id: "linear-search", title: "Linear Search", difficulty: "Easy", points: 15, topic: "Arrays", statement: "Read N, N integers, and target X. Print the zero-based index of X, or -1 if missing.", input: "5\n4 8 2 9 6\n9", output: "3", hint: "Check each array item until the target is found." },
  { id: "second-largest", title: "Second Largest Distinct", difficulty: "Medium", points: 20, topic: "Arrays", statement: "Read N and N integers. Print the second-largest distinct value. Assume it exists.", input: "5\n4 9 9 6 2", output: "6", hint: "Track the largest and second-largest distinct values." },
  { id: "fibonacci", title: "Fibonacci Number", difficulty: "Medium", points: 20, topic: "Loops", statement: "Read N and print the Nth Fibonacci number using F(0)=0 and F(1)=1.", input: "7", output: "13", hint: "Build the sequence by adding the previous two values." },
  { id: "remove-spaces", title: "Remove Spaces", difficulty: "Medium", points: 20, topic: "Strings", statement: "Read a line and print it with all space characters removed.", input: "code mentor ai", output: "codementorai", hint: "Build a result using only non-space characters." },
  { id: "frequency-target", title: "Count Target Frequency", difficulty: "Medium", points: 20, topic: "Arrays", statement: "Read N, N integers, and X. Print how many times X appears.", input: "6\n2 3 2 5 2 7\n2", output: "3", hint: "Increase a counter whenever an item equals X." },
  { id: "gcd", title: "Greatest Common Divisor", difficulty: "Medium", points: 20, topic: "Math", statement: "Read two positive integers and print their GCD.", input: "18 24", output: "6", hint: "Use the Euclidean algorithm: repeatedly replace (a,b) with (b,a%b)." },
  { id: "valid-brackets", title: "Balanced Parentheses", difficulty: "Medium", points: 25, topic: "Stack", statement: "Input contains only '(' and ')'. Print Yes if parentheses are balanced, otherwise No.", input: "(()())", output: "Yes", hint: "Track the balance; it must never go negative and must finish at zero." },
  { id: "binary-search", title: "Binary Search", difficulty: "Medium", points: 25, topic: "Searching", statement: "Given a sorted array, N, its values and target X, print the zero-based index or -1.", input: "5\n1 3 5 7 9\n7", output: "3", hint: "Compare the target with the middle element and discard half each step." },
  { id: "two-sum", title: "Two Sum", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read N, N integers, and target T. Print Yes if any two different elements sum to T; otherwise No.", input: "5\n2 7 11 15 1\n9", output: "Yes", hint: "A simple nested loop can check every pair." },
  { id: "merge-sorted", title: "Merge Two Sorted Arrays", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read lengths N and M followed by two sorted arrays. Print all values in sorted order.", input: "3 3\n1 4 7\n2 3 8", output: "1 2 3 4 7 8", hint: "Use two pointers, one for each array." },
  { id: "anagram", title: "Check Anagram", difficulty: "Medium", points: 25, topic: "Strings", statement: "Read two lowercase words. Print Yes if they contain the same letters with the same frequencies.", input: "listen silent", output: "Yes", hint: "Compare sorted characters or character-frequency counts." },
  { id: "missing-number", title: "Missing Number", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read N then N-1 distinct values from 1 to N. Print the missing value.", input: "5\n1 2 4 5", output: "3", hint: "Subtract the actual sum from N*(N+1)/2." },
  { id: "move-zeros", title: "Move Zeros to End", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read N integers and print them with all zeros moved to the end, preserving other order.", input: "5\n0 1 0 3 12", output: "1 3 12 0 0", hint: "First output non-zero values, then the zeros." },
  { id: "longest-word", title: "Longest Word", difficulty: "Medium", points: 25, topic: "Strings", statement: "Read a line of words separated by spaces and print the longest word. If tied, print the first.", input: "code mentor platform", output: "platform", hint: "Split the line and keep the first word with the greatest length." },
  { id: "two-sum-indices", title: "Two Sum Indices", difficulty: "Hard", points: 30, topic: "Hashing", statement: "Read N, N integers, and target T. Print the two zero-based indices of a pair that sums to T. Assume one solution exists.", input: "4\n2 7 11 15\n9", output: "0 1", hint: "Store previously seen values and their indices in a map." },
  { id: "longest-unique", title: "Longest Unique Substring", difficulty: "Hard", points: 35, topic: "Strings", statement: "Read a string and print the length of its longest substring without repeated characters.", input: "abcabcbb", output: "3", hint: "Use a sliding window and remember each character's last position." },
  { id: "subarray-sum", title: "Subarray Sum Equals K", difficulty: "Hard", points: 35, topic: "Arrays", statement: "Read N, target K, then N integers. Print the number of contiguous subarrays whose sum equals K.", input: "5 3\n1 2 1 2 1", output: "4", hint: "Prefix sums with a frequency map handle negative values too." },
  { id: "valid-brackets-stack", title: "Validate Brackets", difficulty: "Hard", points: 35, topic: "Stack", statement: "Given a string containing (), [], and {}, print Yes if brackets are correctly nested, otherwise No.", input: "{[()]}", output: "Yes", hint: "Push opening brackets onto a stack and match each closing bracket." },
  { id: "rotate-array", title: "Rotate Array Right", difficulty: "Hard", points: 35, topic: "Arrays", statement: "Read N, K, and N integers. Rotate the array right by K positions and print it.", input: "5 2\n1 2 3 4 5", output: "4 5 1 2 3", hint: "Reduce K modulo N, then use reversal or indexing." },
  { id: "majority-element", title: "Majority Element", difficulty: "Hard", points: 35, topic: "Arrays", statement: "Read N integers. Print the value appearing more than N/2 times. Assume it exists.", input: "5\n2 2 1 2 3", output: "2", hint: "Boyer-Moore voting finds it in linear time and constant extra space." },
  { id: "is-prime", title: "Prime Number", difficulty: "Easy", points: 10, topic: "Math", statement: "Read an integer N and print Prime or Not Prime.", input: "17", output: "Prime", hint: "Try divisors only up to the square root of N." },
  { id: "binary-to-decimal", title: "Binary to Decimal", difficulty: "Medium", points: 20, topic: "Math", statement: "Read a binary number as a string and print its decimal value.", input: "1011", output: "11", hint: "For each bit, multiply the accumulated value by 2 and add the bit." },
  { id: "deduplicate", title: "Remove Duplicates", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read N integers and print distinct values in their first-seen order.", input: "6\n1 2 1 3 2 4", output: "1 2 3 4", hint: "Track seen values while preserving the original order." },
  { id: "max-subarray", title: "Maximum Subarray Sum", difficulty: "Hard", points: 40, topic: "Dynamic Programming", statement: "Read N integers and print the maximum sum of a non-empty contiguous subarray.", input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", hint: "Kadane's algorithm decides whether to extend or restart the current subarray." },
];

const CHALLENGE_STARTERS = {
  "sum-two": {
    java: 'import java.util.Scanner;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    // Write your solution here\n  }\n}',
    c: '#include <stdio.h>\nint main(void) {\n  int a, b;\n  scanf("%d %d", &a, &b);\n  // Write your solution here\n  return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int a, b;\n  cin >> a >> b;\n  // Write your solution here\n  return 0;\n}',
    python: 'a, b = map(int, input().split())\n# Write your solution here',
    javascript: 'const fs = require("fs");\nconst [a, b] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\n// Write your solution here'
  },
  "even-odd": {
    java: 'import java.util.Scanner;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // Write your solution here\n  }\n}',
    c: '#include <stdio.h>\nint main(void) {\n  int n; scanf("%d", &n);\n  // Write your solution here\n  return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n; cin >> n;\n  // Write your solution here\n  return 0;\n}',
    python: 'n = int(input())\n# Write your solution here',
    javascript: 'const fs = require("fs");\nconst n = Number(fs.readFileSync(0, "utf8").trim());\n// Write your solution here'
  },
  "largest-three": {
    java: 'import java.util.Scanner;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n    // Write your solution here\n  }\n}',
    c: '#include <stdio.h>\nint main(void) {\n  int a, b, c; scanf("%d %d %d", &a, &b, &c);\n  // Write your solution here\n  return 0;\n}',
    cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n  int a, b, c; cin >> a >> b >> c;\n  // Write your solution here\n  return 0;\n}',
    python: 'a, b, c = map(int, input().split())\n# Write your solution here',
    javascript: 'const fs = require("fs");\nconst [a, b, c] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\n// Write your solution here'
  }
};

function challengeStarter(challengeId, lang) {
  if (CHALLENGE_STARTERS[challengeId]?.[lang]) return CHALLENGE_STARTERS[challengeId][lang];
  const generic = {
    java: 'import java.util.*;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Read input and write your solution here\n  }\n}',
    c: '#include <stdio.h>\nint main(void) {\n  // Read input and write your solution here\n  return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  // Read input and write your solution here\n  return 0;\n}',
    python: '# Read input and write your solution here',
    javascript: 'const fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim();\n// Write your solution here'
  };
  return generic[lang];
}

const DAILY_START_DATE = "2026-10-18";
function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function dayNumberSinceStart(date = new Date()) {
  const start = new Date(`${DAILY_START_DATE}T00:00:00`);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000));
}
function getStreakStats(history = {}, now = new Date()) {
  const solvedDates = new Set(Object.keys(history).filter((key) => /^\d{4}-\d{2}-\d{2}$/.test(key)));
  const sorted = [...solvedDates].sort();
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const key of sorted) {
    const date = new Date(`${key}T00:00:00`);
    const diff = previous ? Math.round((date - previous) / 86400000) : 0;
    run = previous && diff === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  const todayKey = localDateKey(now);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!solvedDates.has(todayKey)) {
    if (!solvedDates.has(localDateKey(yesterday))) return { current: 0, longest, solvedDates };
    cursor = yesterday;
  }
  let current = 0;
  while (solvedDates.has(localDateKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, longest, solvedDates };
}
function getTodayChallenge() {
  const day = dayNumberSinceStart();
  const base = DAILY_CHALLENGES[day % DAILY_CHALLENGES.length];
  const difficulty = day < 10 ? "Easy" : day < 20 ? "Medium" : "Hard";
  const points = 10; // Fixed reward: 10 points per uniquely solved daily question.
  return { ...base, difficulty, points, dayNumber: day + 1 };
}


function getUserStorageKey() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id || user?._id;
    return `codementor_beginner_zone_v1_${userId || "guest"}`;
  } catch {
    return "codementor_beginner_zone_v1_guest";
  }
}
function readSaved(storageKey) { try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; } }

export default function DailyChallenge() {
  const storageKey = getUserStorageKey();
  const [saved, setSaved] = useState(() => readSaved(storageKey));
  const [challengeLanguage, setChallengeLanguage] = useState("java");
  const [challengeDrafts, setChallengeDrafts] = useState({});
  const [challengeOutput, setChallengeOutput] = useState("");
  const [challengeRunning, setChallengeRunning] = useState(false);
  const [showChallengeHint, setShowChallengeHint] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(() => readSaved(storageKey).dailyChallenges || {});
  const [challengeInput, setChallengeInput] = useState("");
  const activeDailyChallenge = getTodayChallenge();
  const dailyChallengeId = activeDailyChallenge.id;
  const todayKey = localDateKey();
  const now = new Date();
  const challengeDraftKey = `${todayKey}:${dailyChallengeId}:${challengeLanguage}`;
  const challengeCode = challengeDrafts[challengeDraftKey] ?? challengeStarter(dailyChallengeId, challengeLanguage);
  // Count each solved question once, at a fixed 10 points per unique challenge.
  const uniqueSolvedChallengeIds = new Set(
    Object.values(challengeCompleted)
      .map((item) => item?.challengeId)
      .filter(Boolean)
  );
  const dailyChallengePoints = uniqueSolvedChallengeIds.size * 10;
  const streakStats = getStreakStats(challengeCompleted);
  const calendarYear = now.getFullYear();
  const calendarMonth = now.getMonth();
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const calendarDays = [
    ...Array.from({ length: firstWeekday }, (_, i) => ({ key: `empty-${i}`, day: null })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(calendarYear, calendarMonth, i + 1);
      return { key: localDateKey(date), day: i + 1 };
    }),
  ];

  async function runDailyChallenge() {
    if (challengeLanguage !== "java") {
      setChallengeOutput(`Your ${LANGUAGES.find((l) => l.id === challengeLanguage)?.name} solution is ready to edit. The current server runner executes Java only, so this language must be enabled in the backend before it can run.`);
      return;
    }
    setChallengeRunning(true); setChallengeOutput("Running your solution…");
    try {
      const response = await axios.post("http://localhost:5000/api/run", { code: challengeCode, language: challengeLanguage, input: challengeInput || activeDailyChallenge.input });
      const output = response.data.output ?? response.data.error ?? response.data.message ?? "No output returned.";
      setChallengeOutput(output);
      if (response.data.success && String(output).trim() === activeDailyChallenge.output.trim()) {
        const updated = { ...challengeCompleted, [todayKey]: { challengeId: activeDailyChallenge.id, title: activeDailyChallenge.title, points: 10, solvedAt: new Date().toISOString() } };
        setChallengeCompleted(updated);
        const nextSaved = { ...saved, dailyChallenges: updated };
        setSaved(nextSaved); localStorage.setItem(storageKey, JSON.stringify(nextSaved));
        setChallengeOutput(`${output}\n\n✓ Correct! You earned ${activeDailyChallenge.points} points.`);
      } else if (response.data.success) setChallengeOutput(`${output}\n\nOutput does not match the expected result yet. Check your solution and try again.`);
    } catch (error) { setChallengeOutput(error.response?.data?.output || error.response?.data?.message || error.response?.data?.error || "Could not connect to the backend. Make sure the server is running."); }
    finally { setChallengeRunning(false); }
  }

  return (
      <section className="bz-panel bz-daily-panel">
        <div className="bz-panel-heading bz-daily-heading">
          <div><span className="bz-eyebrow">DAILY CODING CHALLENGE</span><h2>One challenge. Every day. 🔥</h2><p>A new problem is selected automatically each day. Solve today's challenge to protect your streak.</p></div>
          <div className="bz-daily-stats"><span><strong>{streakStats.current} 🔥</strong><small>Current streak</small></span><span><strong>{streakStats.longest}</strong><small>Longest streak</small></span><span><strong>{dailyChallengePoints}</strong><small>Total points</small></span></div>
        </div>

        <div className="bz-daily-layout bz-daily-single-layout">
          <div className="bz-daily-main">
            <article className="bz-daily-problem-card bz-todays-problem">
              <div className="bz-daily-problem-top"><div><span className="bz-pill">Day {activeDailyChallenge.dayNumber}</span><span className={`bz-difficulty ${activeDailyChallenge.difficulty.toLowerCase()}`}>{activeDailyChallenge.difficulty}</span><span className="bz-pill">{activeDailyChallenge.topic}</span></div><strong>＋{activeDailyChallenge.points} points</strong></div>
              <h3>{activeDailyChallenge.title}</h3><p>{activeDailyChallenge.statement}</p>
              <div className="bz-challenge-sample"><div><strong>Sample input</strong><pre>{activeDailyChallenge.input}</pre></div><div><strong>Expected output</strong><pre>{activeDailyChallenge.output}</pre></div></div>
              <button type="button" className="bz-text-button bz-hint-toggle" onClick={() => setShowChallengeHint((v) => !v)}>{showChallengeHint ? "Hide hint ↑" : "Show hint 💡"}</button>{showChallengeHint && <p className="bz-challenge-hint">{activeDailyChallenge.hint}</p>}
              {challengeCompleted[todayKey] && <div className="bz-today-solved">✓ Today's challenge solved! Your streak is protected.</div>}
            </article>
            <article className="bz-daily-editor-card"><div className="bz-daily-editor-toolbar"><div><span className="bz-eyebrow">YOUR SOLUTION</span><strong>Write your solution</strong></div><label>Language<select value={challengeLanguage} onChange={(e) => { setChallengeLanguage(e.target.value); setChallengeOutput(""); }}><option value="java">Java</option><option value="c">C</option><option value="cpp">C++</option><option value="python">Python</option><option value="javascript">JavaScript</option></select></label></div><Editor key={challengeDraftKey} height="340px" language={challengeLanguage === "cpp" || challengeLanguage === "c" ? "cpp" : challengeLanguage} theme="vs-dark" value={challengeCode} onChange={(value) => setChallengeDrafts((prev) => ({ ...prev, [challengeDraftKey]: value ?? "" }))} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, scrollBeyondLastLine: false, wordWrap: "on", padding: { top: 14 } }} /><label className="bz-challenge-input">Custom input <textarea rows="2" value={challengeInput} onChange={(e) => setChallengeInput(e.target.value)} placeholder={`Leave empty to use sample input: ${activeDailyChallenge.input.replace(/\n/g, " / ")}`} /></label><div className="bz-daily-editor-actions"><button type="button" className="bz-secondary-button" onClick={() => { setChallengeDrafts((prev) => ({ ...prev, [challengeDraftKey]: challengeStarter(dailyChallengeId, challengeLanguage) })); setChallengeOutput(""); }}>Reset code</button><button type="button" className="bz-primary" onClick={runDailyChallenge} disabled={challengeRunning || Boolean(challengeCompleted[todayKey])}>{challengeRunning ? "Running…" : challengeCompleted[todayKey] ? "✓ Completed today" : "▶ Run & check"}</button></div>{challengeOutput && <div className={`bz-daily-result ${challengeOutput.includes("✓ Correct!") ? "success" : ""}`}><strong>Result</strong><pre>{challengeOutput}</pre></div>}</article>
          </div>
          <aside className="bz-streak-side">
        <div className="daily-calendar" aria-label="Monthly coding activity calendar">
          <div className="daily-calendar-header">
            <div>
              <span className="daily-calendar-label">YOUR ACTIVITY</span>
              <h3>{monthName}</h3>
              <p>Complete a daily challenge to turn its date green.</p>
            </div>
            <div className="daily-calendar-legend">
              <span><i className="legend-solved" /> Solved</span>
              <span><i className="legend-today" /> Today</span>
            </div>
          </div>
          <div className="daily-calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div className="daily-calendar-weekday" key={day}>{day}</div>
            ))}
            {calendarDays.map((date) => {
              if (date.day === null) return <div key={date.key} className="daily-calendar-empty" />;
              const solved = streakStats.solvedDates.has(date.key);
              const isToday = date.key === todayKey;
              return (
                <div
                  key={date.key}
                  className={`daily-calendar-date ${solved ? "is-solved" : ""} ${isToday ? "is-today" : ""}`}
                  title={solved ? "Challenge solved!" : isToday ? "Today's challenge" : "Challenge not solved"}
                >
                  <span>{date.day}</span>
                  {solved && <small aria-label="Solved">✓</small>}
                  {isToday && !solved && <small>Today</small>}
                </div>
              );
            })}
          </div>
          <div className="daily-calendar-footer">
            <span>🔥 Current streak</span>
            <strong>{streakStats.current} {streakStats.current === 1 ? "day" : "days"}</strong>
            <span className="daily-calendar-total">{streakStats.solvedDates.size} days completed</span>
          </div>
        </div><article className="bz-streak-info-card"><span className="bz-streak-fire">🔥</span><h3>Keep your streak alive</h3><p>Solve today's problem to count this day. Miss a day and the current streak resets.</p><div className="bz-streak-rule"><span>Days 1–10</span><strong>Easy</strong></div><div className="bz-streak-rule"><span>Days 11–20</span><strong>Medium</strong></div><div className="bz-streak-rule"><span>Days 21+</span><strong>Hard</strong></div></article><article className="bz-streak-info-card bz-streak-history"><h3>Recent solved days</h3>{Object.entries(challengeCompleted).filter(([key]) => /^\d{4}-\d{2}-\d{2}$/.test(key)).sort(([a],[b]) => b.localeCompare(a)).slice(0,5).map(([date, record]) => <div className="bz-history-row" key={date}><span><strong>{record.title || "Daily challenge"}</strong><small>{date}</small></span><b>+10</b></div>)}{!Object.keys(challengeCompleted).some((key) => /^\d{4}-\d{2}-\d{2}$/.test(key)) && <p className="bz-history-empty">Your solved challenges will appear here.</p>}</article></aside>
        </div>
        <p className="bz-daily-runtime-note">The challenge changes automatically by date. The current backend runs Java only; other languages can be selected for editing, but their execution requires language runners on the backend.</p>
      </section>
  );
}
