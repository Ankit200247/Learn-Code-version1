import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://https://leancode.onrender.com"
).replace(/\/$/, "");

const LANGUAGES = {
  java: {
    label: "Java",
    monaco: "java",
    defaultCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Write your solution here

        sc.close();
    }
}`,
  },

  cpp: {
    label: "C++",
    monaco: "cpp",
    defaultCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Write your solution here

    return 0;
}`,
  },

  python: {
    label: "Python",
    monaco: "python",
    defaultCode: `def solve():
    # Write your solution here
    pass


if __name__ == "__main__":
    solve()
`,
  },

  javascript: {
    label: "JavaScript",
    monaco: "javascript",
    defaultCode: `function solve() {
    // Write your solution here
}

solve();
`,
  },
};

const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    acceptance: "Array",
    description:
      "Given an array of integers nums and an integer target, return the indices of two numbers whose sum equals target.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] == 9.",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] == 6.",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "Only one valid answer exists.",
    ],
    input: "4\n2 7 11 15\n9",
    expected: "0 1",
    hint: "Use a hash map to store previously seen values and their indices.",
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    topic: "Strings",
    description:
      "Given a string, print its characters in reverse order.",
    examples: [
      {
        input: "hello",
        output: "olleh",
        explanation: "The characters are printed from the last index to the first.",
      },
    ],
    constraints: [
      "The input contains a single string.",
      "Preserve all characters.",
    ],
    input: "hello",
    expected: "olleh",
    hint: "Traverse the string from its last index to the first.",
  },

  "binary-search": {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Searching",
    description:
      "Given a sorted array and a target, print the target's index or -1 if it is not found.",
    examples: [
      {
        input: "nums = [1, 3, 5, 7, 9], target = 7",
        output: "3",
        explanation: "The target 7 is at index 3.",
      },
    ],
    constraints: [
      "The array is sorted in ascending order.",
      "Array indices are zero-based.",
    ],
    input: "5\n1 3 5 7 9\n7",
    expected: "3",
    hint: "Compare the target with the middle element and reduce the search range.",
  },

  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    description:
      "Determine whether the opening and closing brackets in a string are balanced.",
    examples: [
      {
        input: "()[]{}",
        output: "true",
        explanation: "Every opening bracket has a matching closing bracket.",
      },
      {
        input: "(]",
        output: "false",
        explanation: "The bracket types do not match.",
      },
    ],
    constraints: [
      "The input contains only bracket characters.",
      "Every closing bracket must match the most recent unmatched opening bracket.",
    ],
    input: "()[]{}",
    expected: "true",
    hint: "Use a stack to match each closing bracket with the most recent opening bracket.",
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Arrays",
    description:
      "Find the maximum sum of a non-empty contiguous subarray.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum, 6.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10⁵",
      "The subarray must be contiguous and non-empty.",
    ],
    input: "9\n-2 1 -3 4 -1 2 1 -5 4",
    expected: "6",
    hint: "Kadane's algorithm tracks the best sum ending at each position.",
  },
};

const getToken = () => localStorage.getItem("token") || "";

function getAuthHeaders() {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeLanguage(value) {
  const language = String(value || "").toLowerCase();

  if (language === "c++" || language === "cpp") return "cpp";
  if (language === "py" || language === "python") return "python";
  if (language === "js" || language === "javascript") return "javascript";

  return "java";
}

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    code: (
      <>
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m14 5-4 14" />
      </>
    ),
    play: <path d="m8 5 12 7-12 7z" />,
    submit: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" />
      </>
    ),
    reset: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    back: <path d="m15 18-6-6 6-6" />,
    lightbulb: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M8 14a7 7 0 1 1 8 0c-.8.6-1 1.3-1 2H9c0-.7-.2-1.4-1-2z" />
      </>
    ),
    terminal: (
      <>
        <path d="m4 17 6-6-6-6" />
        <path d="M12 19h8" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),
  };

  return <svg {...common}>{icons[name] || icons.code}</svg>;
}

function PanelHeader({ children, right }) {
  return (
    <div className="tp-editor-panel-header">
      <div>{children}</div>
      {right}
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  const className =
    difficulty === "Easy"
      ? "tp-editor-difficulty easy"
      : difficulty === "Medium"
        ? "tp-editor-difficulty medium"
        : "tp-editor-difficulty hard";

  return <span className={className}>{difficulty}</span>;
}

export default function AiEditorPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const problemId = searchParams.get("problem") || "";
  const problem = PROBLEMS[problemId] || null;

  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(LANGUAGES.java.defaultCode);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState("info");
  const [activeBottomTab, setActiveBottomTab] = useState("testcases");
  const [activeProblemTab, setActiveProblemTab] = useState("description");
  const [running, setRunning] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [mobileProblemOpen, setMobileProblemOpen] = useState(true);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(230);

  const [testInput, setTestInput] = useState("");

  const problemIds = useMemo(() => Object.keys(PROBLEMS), []);

  useEffect(() => {
    const savedCode = localStorage.getItem(`techpath_editor_${language}`);
    setCode(savedCode || LANGUAGES[language].defaultCode);
  }, [language]);

  useEffect(() => {
    setCustomInput(problem?.input || "");
    setTestInput(problem?.input || "");
    setOutput("");
    setError("");
    setFeedback("");
    setShowHint(false);
  }, [problemId]);

  useEffect(() => {
    localStorage.setItem(`techpath_editor_${language}`, code);
  }, [language, code]);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();

        if (!running && !feedbackLoading) {
          handleRunCode();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
    // The handler uses the latest state through the rendered closure.
  });

  function handleLanguageChange(event) {
    const nextLanguage = normalizeLanguage(event.target.value);
    setLanguage(nextLanguage);
    setOutput("");
    setError("");
    setFeedback("");
  }

  async function handleRunCode() {
    if (running) return;

    setRunning(true);
    setOutput("");
    setError("");
    setFeedback("");
    setActiveBottomTab("output");

    try {
      const response = await axios.post(
        `${API_URL}/api/run`,
        {
          code,
          language,
          input: customInput,
        },
        {
          headers: getAuthHeaders(),
          timeout: 60000,
        }
      );

      const data = response.data || {};

      if (data.success === false) {
        throw new Error(data.message || "Code execution failed.");
      }

      const result = data.output ?? data.stdout ?? data.result ?? "";
      const executionError =
        data.stderr || data.compile_output || data.error || "";

      if (executionError) {
        setOutput(String(executionError));
        setOutputType("error");
      } else {
        setOutput(
          result === ""
            ? "Program executed successfully with no output."
            : String(result)
        );
        setOutputType("success");
      }
    } catch (err) {
      setOutput(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to execute code."
      );
      setOutputType("error");
    } finally {
      setRunning(false);
    }
  }

  async function handleGetFeedback(action = "review") {
    if (feedbackLoading) return;

    setFeedbackLoading(true);
    setError("");
    setFeedback("");
    setActiveBottomTab("ai");

    try {
      const response = await axios.post(
        `${API_URL}/api/ai-feedback`,
        {
          code,
          language,
          problem: problem?.title || "",
          description: problem?.description || "",
          input: customInput,
          output,
          action,
        },
        {
          headers: getAuthHeaders(),
          timeout: 60000,
        }
      );

      const data = response.data || {};

      if (data.success === false) {
        throw new Error(data.message || "AI feedback failed.");
      }

      setFeedback(
        data.feedback ||
          data.answer ||
          "The AI did not return feedback. Please try again."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to get AI feedback."
      );
      setFeedback("");
    } finally {
      setFeedbackLoading(false);
    }
  }

  function handleResetCode() {
    if (!window.confirm("Reset your code to the default template?")) return;

    setCode(LANGUAGES[language].defaultCode);
    setOutput("");
    setFeedback("");
    setError("");
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setOutput("Code copied to clipboard.");
      setOutputType("success");
      setActiveBottomTab("output");
    } catch {
      setError("Clipboard access failed. Please copy the code manually.");
    }
  }

  async function handleSubmitCode() {
    if (running) return;

    setRunning(true);
    setOutput("");
    setError("");
    setActiveBottomTab("output");

    try {
      const response = await axios.post(
        `${API_URL}/api/submit`,
        {
          code,
          language,
          problemId: problemId || "custom-problem",
          title: problem?.title || "Custom Problem",
          topic: problem?.topic || "General",
          difficulty: problem?.difficulty || "Easy",
          testCases: problem
            ? [
                {
                  input: problem.input,
                  expectedOutput: problem.expected,
                },
              ]
            : [
                {
                  input: customInput,
                  expectedOutput: "",
                },
              ],
        },
        {
          headers: getAuthHeaders(),
          timeout: 120000,
        }
      );

      const data = response.data || {};

      if (data.success) {
        setOutput(
          data.message ||
            (data.accepted ? "Accepted!" : "Submission evaluated.")
        );
        setOutputType(data.accepted ? "success" : "info");
      } else {
        setOutput(data.message || "Submission failed.");
        setOutputType("error");
      }
    } catch (err) {
      setOutput(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to submit solution."
      );
      setOutputType("error");
    } finally {
      setRunning(false);
    }
  }

  function goToProblem(id) {
    if (id) {
      setSearchParams({ problem: id });
    } else {
      setSearchParams({});
    }

    setMobileProblemOpen(true);
  }

  const currentProblemIndex = problemIds.indexOf(problemId);

  function navigateProblem(direction) {
    const nextIndex = currentProblemIndex + direction;

    if (nextIndex >= 0 && nextIndex < problemIds.length) {
      goToProblem(problemIds[nextIndex]);
    }
  }

  const editorLanguage = LANGUAGES[language].monaco;

  return (
    <div className="tp-leetcode">
      {/* Top navigation */}
      <header className="tp-editor-topbar">
        <div className="tp-editor-brand-group">
          <Link to="/dashboard" className="tp-editor-brand">
            <span className="tp-editor-brand-mark">
              <Icon name="code" size={22} />
            </span>
            <span>
              <strong>TechPath</strong>
              <small>AI Workspace</small>
            </span>
          </Link>

          <span className="tp-editor-top-divider" />

          <Link to="/practice" className="tp-editor-back-link">
            <Icon name="back" size={17} />
            <span>Problems</span>
          </Link>
        </div>

        <div className="tp-editor-top-center">
          <button
            type="button"
            className="tp-editor-icon-button"
            onClick={() => navigateProblem(-1)}
            disabled={currentProblemIndex <= 0}
            aria-label="Previous problem"
            title="Previous problem"
          >
            <Icon name="back" size={18} />
          </button>

          <span className="tp-editor-problem-count">
            {problem
              ? `${currentProblemIndex + 1} / ${problemIds.length}`
              : "Custom workspace"}
          </span>

          <button
            type="button"
            className="tp-editor-icon-button"
            onClick={() => navigateProblem(1)}
            disabled={
              currentProblemIndex < 0 ||
              currentProblemIndex >= problemIds.length - 1
            }
            aria-label="Next problem"
            title="Next problem"
          >
            <Icon name="chevron" size={18} />
          </button>
        </div>

        <div className="tp-editor-top-actions">
          <Link to="/progress" className="tp-editor-top-link">
            Progress
          </Link>
          <Link to="/ai-assistant" className="tp-editor-ai-link">
            <Icon name="code" size={16} />
            AI Assistant
          </Link>
        </div>
      </header>

      {/* Workspace toolbar */}
      <div className="tp-editor-toolbar">
        <div className="tp-editor-toolbar-left">
          <button
            type="button"
            className={`tp-editor-toolbar-button ${
              mobileProblemOpen ? "active" : ""
            }`}
            onClick={() => setMobileProblemOpen((open) => !open)}
          >
            <Icon name="menu" size={17} />
            <span>Problem</span>
          </button>

          <span className="tp-editor-toolbar-separator" />

          <select
            className="tp-editor-problem-select"
            value={problemId}
            onChange={(event) => goToProblem(event.target.value)}
            aria-label="Select problem"
          >
            <option value="">Custom Problem</option>
            {Object.entries(PROBLEMS).map(([id, item]) => (
              <option key={id} value={id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <div className="tp-editor-toolbar-right">
          <span className="tp-editor-save-indicator">
            <span className="tp-editor-save-dot" />
            Local code saving
          </span>

          <button
            type="button"
            className="tp-editor-toolbar-button"
            onClick={handleCopyCode}
            title="Copy code"
          >
            <Icon name="copy" size={16} />
            <span>Copy</span>
          </button>

          <button
            type="button"
            className="tp-editor-toolbar-button"
            onClick={handleResetCode}
            title="Reset code"
          >
            <Icon name="reset" size={16}
            />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main split workspace */}
      <div
        className={`tp-editor-workspace ${
          mobileProblemOpen ? "tp-problem-visible" : "tp-problem-collapsed"
        }`}
      >
        {/* Problem panel */}
        <aside className="tp-editor-problem-panel">
          <div className="tp-editor-panel-tabs">
            <button
              type="button"
              className={`tp-editor-panel-tab ${
                activeProblemTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveProblemTab("description")}
            >
              Description
            </button>

            <button
              type="button"
              className={`tp-editor-panel-tab ${
                activeProblemTab === "hints" ? "active" : ""
              }`}
              onClick={() => setActiveProblemTab("hints")}
            >
              Hints
            </button>
          </div>

          <div className="tp-editor-problem-scroll">
            {activeProblemTab === "description" ? (
              problem ? (
                <>
                  <div className="tp-editor-problem-title-row">
                    <h1>{problem.title}</h1>
                    <span className="tp-editor-problem-number">
                      #{String(currentProblemIndex + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="tp-editor-badges">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    <span className="tp-editor-topic-badge">
                      {problem.topic}
                    </span>
                  </div>

                  <div className="tp-editor-description">
                    <p>{problem.description}</p>
                  </div>

                  <div className="tp-editor-section">
                    <h3>Examples</h3>

                    {problem.examples.map((example, index) => (
                      <div className="tp-editor-example" key={index}>
                        <div className="tp-editor-example-heading">
                          <span>Example {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomInput(problem.input);
                              setTestInput(problem.input);
                              setActiveBottomTab("testcases");
                            }}
                            title="Load sample input"
                          >
                            Use sample
                          </button>
                        </div>

                        <div className="tp-editor-example-content">
                          <p>
                            <strong>Input:</strong>
                          </p>
                          <pre>{example.input}</pre>

                          <p>
                            <strong>Output:</strong>
                          </p>
                          <pre>{example.output}</pre>

                          {example.explanation && (
                            <>
                              <p>
                                <strong>Explanation:</strong>
                              </p>
                              <p className="tp-editor-example-explanation">
                                {example.explanation}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="tp-editor-section">
                    <h3>Constraints</h3>
                    <ul className="tp-editor-constraints">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="tp-editor-section">
                    <h3>Topics</h3>
                    <div className="tp-editor-topic-list">
                      {problem.topic.split(" & ").map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="tp-editor-custom-problem">
                  <span className="tp-editor-custom-icon">
                    <Icon name="code" size={28} />
                  </span>
                  <h1>Custom Coding Workspace</h1>
                  <p>
                    Write and run your own solution. Select a sample problem
                    from the toolbar to view its description, examples, and
                    constraints.
                  </p>

                  <div className="tp-editor-custom-tip">
                    <Icon name="lightbulb" size={19} />
                    <span>
                      Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run your
                      code.
                    </span>
                  </div>
                </div>
              )
            ) : (
              <div className="tp-editor-hints-panel">
                <span className="tp-editor-hint-icon">
                  <Icon name="lightbulb" size={26} />
                </span>

                <h2>Hints & Guidance</h2>

                {problem ? (
                  <>
                    <p>
                      Try to solve the problem yourself before revealing the
                      hint.
                    </p>

                    <button
                      type="button"
                      className="tp-editor-reveal-hint"
                      onClick={() => setShowHint((visible) => !visible)}
                    >
                      {showHint ? "Hide hint" : "Reveal hint"}
                    </button>

                    {showHint && (
                      <div className="tp-editor-hint-content">
                        {problem.hint}
                      </div>
                    )}
                  </>
                ) : (
                  <p>Select a problem to view its hints.</p>
                )}
              </div>
            )}
          </div>

          <div className="tp-editor-problem-footer">
            <span>
              {problem ? problem.topic : "General programming"}
            </span>
            <span>Learn Code</span>
          </div>
        </aside>

        {/* Right editor and results */}
        <section className="tp-editor-main-panel">
          {/* Editor header */}
          <PanelHeader
            right={
              <div className="tp-editor-runtime-actions">
                <button
                  type="button"
                  className="tp-editor-run-button"
                  onClick={handleRunCode}
                  disabled={running || feedbackLoading}
                >
                  <Icon name="play" size={15} />
                  <span>{running ? "Running..." : "Run"}</span>
                </button>

                <button
                  type="button"
                  className="tp-editor-submit-button"
                  onClick={handleSubmitCode}
                  disabled={running || feedbackLoading}
                >
                  <Icon name="submit" size={15} />
                  <span>{running ? "Submitting..." : "Submit"}</span>
                </button>
              </div>
            }
          >
            <div className="tp-editor-section-heading">
              <span className="tp-editor-terminal-icon">
                <Icon name="code" size={17} />
              </span>
              <span>Code</span>
            </div>
          </PanelHeader>

          {/* Editor controls */}
          <div className="tp-editor-code-toolbar">
            <label className="tp-editor-language-control">
              <span>Language</span>
              <select
                value={language}
                onChange={handleLanguageChange}
                aria-label="Programming language"
              >
                {Object.entries(LANGUAGES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>

            <span className="tp-editor-code-toolbar-note">
              <span className="tp-editor-save-dot" />
              Autosaved locally
            </span>
          </div>

          {/* Monaco */}
          <div className="tp-editor-monaco">
            <Editor
              height="100%"
              language={editorLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value ?? "")}
              loading={
                <div className="tp-editor-loading">
                  Loading code editor...
                </div>
              }
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily:
                  "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
                fontLigatures: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 4,
                wordWrap: "on",
                padding: { top: 18, bottom: 18 },
                lineNumbers: "on",
                renderLineHighlight: "all",
                bracketPairColorization: { enabled: true },
                suggestOnTriggerCharacters: true,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                folding: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          </div>

          {/* Bottom panel */}
          <div className="tp-editor-bottom-panel">
            <div className="tp-editor-bottom-tabs">
              <button
                type="button"
                className={`tp-editor-bottom-tab ${
                  activeBottomTab === "testcases" ? "active" : ""
                }`}
                onClick={() => setActiveBottomTab("testcases")}
              >
                Test Cases
              </button>

              <button
                type="button"
                className={`tp-editor-bottom-tab ${
                  activeBottomTab === "output" ? "active" : ""
                }`}
                onClick={() => setActiveBottomTab("output")}
              >
                <Icon name="terminal" size={15} />
                Output
              </button>

              <button
                type="button"
                className={`tp-editor-bottom-tab ${
                  activeBottomTab === "ai" ? "active" : ""
                }`}
                onClick={() => setActiveBottomTab("ai")}
              >
                AI Feedback
              </button>

              <span className="tp-editor-bottom-spacer" />

              <span className="tp-editor-shortcut">
                <kbd>Ctrl</kbd> + <kbd>Enter</kbd> Run
              </span>
            </div>

            <div className="tp-editor-bottom-content">
              {activeBottomTab === "testcases" && (
                <div className="tp-editor-testcase-layout">
                  <div className="tp-editor-testcase-list">
                    <button
                      type="button"
                      className="tp-editor-testcase-chip active"
                      onClick={() => {
                        setCustomInput(testInput || problem?.input || "");
                      }}
                    >
                      <span className="tp-editor-testcase-dot" />
                      Case 1
                    </button>

                    <button
                      type="button"
                      className="tp-editor-add-testcase"
                      onClick={() => {
                        setTestInput("");
                        setCustomInput("");
                      }}
                    >
                      + New input
                    </button>
                  </div>

                  <div className="tp-editor-testcase-input">
                    <label htmlFor="tp-custom-input">Custom input</label>
                    <textarea
                      id="tp-custom-input"
                      value={customInput}
                      onChange={(event) => {
                        setCustomInput(event.target.value);
                        setTestInput(event.target.value);
                      }}
                      placeholder="Enter input for your program..."
                      spellCheck="false"
                    />
                  </div>

                  <div className="tp-editor-testcase-footer">
                    <span>Input is sent to your code execution API.</span>
                    <button
                      type="button"
                      onClick={handleRunCode}
                      disabled={running || feedbackLoading}
                    >
                      <Icon name="play" size={14} />
                      Run test
                    </button>
                  </div>
                </div>
              )}

              {activeBottomTab === "output" && (
                <div className="tp-editor-output-panel">
                  {running ? (
                    <div className="tp-editor-output-empty">
                      <span className="tp-editor-spinner" />
                      <p>Executing your code...</p>
                    </div>
                  ) : output ? (
                    <div
                      className={`tp-editor-output-result ${outputType}`}
                      role="status"
                    >
                      <div className="tp-editor-output-result-header">
                        <span className="tp-editor-output-status">
                          {outputType === "success" ? (
                            <Icon name="check" size={16} />
                          ) : (
                            <Icon name="terminal" size={16} />
                          )}
                          {outputType === "success"
                            ? "Execution result"
                            : outputType === "error"
                              ? "Execution error"
                              : "Result"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setOutput("")}
                          aria-label="Clear output"
                        >
                          <Icon name="close" size={15} />
                        </button>
                      </div>
                      <pre>{output}</pre>
                    </div>
                  ) : (
                    <div className="tp-editor-output-empty">
                      <span className="tp-editor-output-empty-icon">
                        <Icon name="terminal" size={25} />
                      </span>
                      <p>Run your code to see the output here.</p>
                      <span>Output and execution errors will appear here.</span>
                    </div>
                  )}
                </div>
              )}

              {activeBottomTab === "ai" && (
                <div className="tp-editor-ai-panel">
                  <div className="tp-editor-ai-panel-header">
                    <div>
                      <h3>AI Code Review</h3>
                      <p>Review, debug, explain, or optimize your code.</p>
                    </div>
                    <span className="tp-editor-ai-tag">AI</span>
                  </div>

                  <div className="tp-editor-ai-actions">
                    {[
                      ["review", "Review code"],
                      ["debug", "Debug"],
                      ["optimize", "Optimize"],
                      ["complexity", "Complexity"],
                      ["explain", "Explain"],
                    ].map(([action, label]) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => handleGetFeedback(action)}
                        disabled={feedbackLoading || running}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="tp-editor-inline-error" role="alert">
                      {error}
                    </div>
                  )}

                  {feedbackLoading ? (
                    <div className="tp-editor-output-empty">
                      <span className="tp-editor-spinner" />
                      <p>AI is analyzing your code...</p>
                    </div>
                  ) : feedback ? (
                    <pre className="tp-editor-feedback-result">{feedback}</pre>
                  ) : (
                    <div className="tp-editor-output-empty">
                      <p>Select an action to get AI feedback.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}