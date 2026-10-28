
import { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const CONVERSATIONS_KEY = "techpath_ai_conversations";
const ACTIVE_CHAT_KEY = "techpath_ai_active_chat";
const LEGACY_STORAGE_KEY = "techpath_ai_chat_history";

const MAX_MESSAGES = 100;
const MAX_CONVERSATIONS = 30;

const QUICK_PROMPTS = [
  {
    icon: "💻",
    title: "Learn Java",
    description: "Understand concepts with examples",
    prompt: "Explain OOP in Java with simple examples.",
  },
  {
    icon: "🧠",
    title: "Solve DSA",
    description: "Learn problem-solving step by step",
    prompt:
      "Teach me how to solve Two Sum in Java. Explain the approach, code, and time complexity.",
  },
  {
    icon: "🐛",
    title: "Debug my code",
    description: "Understand errors and fix them",
    prompt:
      "Explain a systematic step-by-step approach to debugging a Java program, with an example.",
  },
  {
    icon: "🎯",
    title: "Placement prep",
    description: "Prepare for technical interviews",
    prompt:
      "Create a beginner-friendly placement preparation plan covering Java, DSA, aptitude, and interviews.",
  },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createMessage(role, content) {
  return {
    id: createId(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

function createConversation() {
  const now = new Date().toISOString();

  return {
    id: createId(),
    title: "New conversation",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

function getToken() {
  return localStorage.getItem("token") || "";
}

function readConversations() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CONVERSATIONS_KEY) || "null"
    );

    if (Array.isArray(saved)) {
      return saved
        .filter(
          (chat) =>
            chat &&
            typeof chat.id === "string" &&
            Array.isArray(chat.messages)
        )
        .map((chat) => ({
          ...chat,
          title: chat.title || "New conversation",
          messages: chat.messages
            .filter(
              (message) =>
                ["user", "assistant"].includes(message.role) &&
                typeof message.content === "string"
            )
            .slice(-MAX_MESSAGES),
        }))
        .slice(0, MAX_CONVERSATIONS);
    }
  } catch {
    // Recover from invalid browser storage.
  }

  // Migrate previous single-chat history.
  try {
    const legacy = JSON.parse(
      localStorage.getItem(LEGACY_STORAGE_KEY) || "[]"
    );

    if (Array.isArray(legacy) && legacy.length > 0) {
      const messages = legacy
        .filter(
          (message) =>
            ["user", "assistant"].includes(message.role) &&
            typeof message.content === "string"
        )
        .slice(-MAX_MESSAGES);

      if (messages.length > 0) {
        const firstUserMessage = messages.find(
          (message) => message.role === "user"
        );

        return [
          {
            id: createId(),
            title: firstUserMessage
              ? firstUserMessage.content.slice(0, 45)
              : "Previous conversation",
            messages,
            createdAt: messages[0].timestamp || new Date().toISOString(),
            updatedAt:
              messages[messages.length - 1].timestamp ||
              new Date().toISOString(),
          },
        ];
      }
    }
  } catch {
    // Ignore invalid legacy data.
  }

  return [];
}

function readActiveChatId(conversations) {
  try {
    const id = localStorage.getItem(ACTIVE_CHAT_KEY);

    if (id && conversations.some((chat) => chat.id === id)) {
      return id;
    }
  } catch {
    // Ignore storage errors.
  }

  return conversations[0]?.id || "";
}

function formatTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return "Today";
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function getConversationTitle(messages) {
  const firstQuestion = messages.find(
    (message) => message.role === "user"
  );

  if (!firstQuestion) return "New conversation";

  const text = firstQuestion.content.replace(/\s+/g, " ").trim();

  return text.length > 42 ? `${text.slice(0, 42)}…` : text;
}

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  const paths = {
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    chat: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.chat}</svg>;
}

function InlineMarkdown({ text }) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded-md border border-violet-100 bg-violet-50 px-1.5 py-0.5 font-mono text-[0.9em] text-violet-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function FormattedMessage({ content, onCopyCode }) {
  const lines = String(content || "").split("\n");
  const blocks = [];

  let paragraph = [];
  let codeLines = [];
  let codeLanguage = "";
  let insideCode = false;

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({
        type: "paragraph",
        content: paragraph.join("\n"),
      });

      paragraph = [];
    }
  }

  function flushCode() {
    blocks.push({
      type: "code",
      content: codeLines.join("\n"),
      language: codeLanguage,
    });

    codeLines = [];
    codeLanguage = "";
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (insideCode) {
        flushCode();
        insideCode = false;
      } else {
        flushParagraph();
        insideCode = true;
        codeLanguage = trimmed.slice(3).trim() || "code";
      }

      return;
    }

    if (insideCode) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      return;
    }

    paragraph.push(line);
  });

  if (insideCode) flushCode();

  flushParagraph();

  return (
    <div className="space-y-3 break-words text-sm leading-7 text-slate-700">
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950"
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
                <span className="text-xs font-medium text-slate-400">
                  {block.language}
                </span>

                <button
                  type="button"
                  onClick={() => onCopyCode(block.content)}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Copy code
                </button>
              </div>

              <pre className="overflow-x-auto p-4 text-xs leading-6 text-emerald-200 sm:text-sm">
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={index} className="space-y-2">
            {block.content.split("\n").map((line, lineIndex) => {
              const trimmed = line.trim();

              if (/^#{1,3}\s/.test(trimmed)) {
                return (
                  <h3
                    key={lineIndex}
                    className="pt-2 text-base font-bold text-slate-900"
                  >
                    <InlineMarkdown
                      text={trimmed.replace(/^#{1,3}\s/, "")}
                    />
                  </h3>
                );
              }

              if (/^[-*]\s/.test(trimmed)) {
                return (
                  <div key={lineIndex} className="flex gap-2 pl-1">
                    <span className="font-bold text-violet-600">•</span>

                    <div className="min-w-0 flex-1">
                      <InlineMarkdown
                        text={trimmed.replace(/^[-*]\s/, "")}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <p key={lineIndex}>
                  <InlineMarkdown text={trimmed} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function PromptCard({ item, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item.prompt)}
      disabled={disabled}
      className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl transition group-hover:bg-violet-100">
        {item.icon}
      </span>

      <span className="mt-3 block text-sm font-semibold text-slate-900">
        {item.title}
      </span>

      <span className="mt-1.5 block text-xs leading-5 text-slate-500">
        {item.description}
      </span>
    </button>
  );
}

export default function AiAssistantPage({ onNavigate }) {
  const initialConversations = useRef(null);

  if (initialConversations.current === null) {
    initialConversations.current = readConversations();
  }

  const [conversations, setConversations] = useState(
    initialConversations.current
  );

  const [activeChatId, setActiveChatId] = useState(() =>
    readActiveChatId(initialConversations.current)
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);
  const copiedTimeoutRef = useRef(null);

  const activeChat =
    conversations.find((chat) => chat.id === activeChatId) || null;

  const messages = activeChat?.messages || [];

  useEffect(() => {
    try {
      localStorage.setItem(
        CONVERSATIONS_KEY,
        JSON.stringify(conversations.slice(0, MAX_CONVERSATIONS))
      );

      if (activeChatId) {
        localStorage.setItem(ACTIVE_CHAT_KEY, activeChatId);
      } else {
        localStorage.removeItem(ACTIVE_CHAT_KEY);
      }
    } catch {
      setError("Chat history could not be saved in browser storage.");
    }
  }, [conversations, activeChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();

      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const updateConversationMessages = useCallback(
    (chatId, nextMessages) => {
      setConversations((current) =>
        current.map((chat) => {
          if (chat.id !== chatId) return chat;

          return {
            ...chat,
            messages: nextMessages.slice(-MAX_MESSAGES),
            title: getConversationTitle(nextMessages),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const handleNewChat = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setLoading(false);
    setError("");
    setInput("");

    const newChat = createConversation();

    setConversations((current) =>
      [newChat, ...current].slice(0, MAX_CONVERSATIONS)
    );

    setActiveChatId(newChat.id);
    setSidebarOpen(false);

    window.setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSelectChat = (chatId) => {
    if (loading) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }

    setActiveChatId(chatId);
    setError("");
    setInput("");
    setSidebarOpen(false);
  };

  const handleDeleteChat = (event, chatId) => {
    event.stopPropagation();

    if (
      !window.confirm(
        "Delete this conversation? This action cannot be undone."
      )
    ) {
      return;
    }

    if (activeChatId === chatId) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }

    setConversations((current) => {
      const remaining = current.filter((chat) => chat.id !== chatId);

      if (activeChatId === chatId) {
        setActiveChatId(remaining[0]?.id || "");
      }

      return remaining;
    });

    setError("");
  };

  const handleSend = async (providedPrompt) => {
    const text = String(providedPrompt ?? input).trim();

    if (!text || loading) return;

    setError("");
    setInput("");

    let chatId = activeChatId;
    let currentMessages = messages;

    if (!chatId || !conversations.some((chat) => chat.id === chatId)) {
      const newChat = createConversation();

      chatId = newChat.id;
      currentMessages = [];

      setConversations((current) =>
        [newChat, ...current].slice(0, MAX_CONVERSATIONS)
      );

      setActiveChatId(chatId);
    }

    const userMessage = createMessage("user", text);

    const updatedMessages = [
      ...currentMessages,
      userMessage,
    ].slice(-MAX_MESSAGES);

    updateConversationMessages(chatId, updatedMessages);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const token = getToken();

      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        {
          message: text,
          history: updatedMessages.slice(-20).map((message) => ({
            role: message.role,
            content: message.content,
          })),
        },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
          timeout: 90000,
          signal: controller.signal,
        }
      );

      const data = response.data || {};

      if (!data.success) {
        throw new Error(data.message || "The AI could not answer.");
      }

      const answer =
        data.answer ||
        data.response ||
        data.message ||
        "I couldn't generate a response. Please try again.";

      const assistantMessage = createMessage("assistant", answer);

      setConversations((current) =>
        current.map((chat) => {
          if (chat.id !== chatId) return chat;

          const nextMessages = [
            ...chat.messages,
            assistantMessage,
          ].slice(-MAX_MESSAGES);

          return {
            ...chat,
            messages: nextMessages,
            title: getConversationTitle(nextMessages),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    } catch (err) {
      if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
        return;
      }

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to connect to the AI assistant."
      );
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setLoading(false);
      }

      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedId(id);

      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopiedId("");
      }, 1500);
    } catch {
      setError("Unable to copy. Please select the text and copy it manually.");
    }
  };

  const filteredConversations = conversations.filter((chat) =>
    chat.title.toLowerCase().includes(searchHistory.trim().toLowerCase())
  );

  return (
    <div className="min-w-0 space-y-5">
      {/* Page header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-2xl text-white shadow-lg shadow-violet-200">
            ✦
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                AI Assistant
              </h1>

              <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                Your AI Mentor
              </span>
            </div>

            <p className="mt-1.5 text-sm text-slate-500">
              Learn concepts, solve coding problems, and prepare for placements.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
<button
  type="button"
  onClick={() => onNavigate?.("Coding Practice")}
  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
>
  <Icon name="book" className="h-4 w-4" />
  Coding Practice
</button>
          <button
            type="button"
            onClick={handleNewChat}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            <Icon name="plus" className="h-4 w-4" />
            New Chat
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="relative grid min-w-0 gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close conversation sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col gap-4 overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:overflow-visible lg:border-r-0 lg:bg-transparent lg:p-0`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <span className="font-bold text-slate-900">
              Your conversations
            </span>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <Icon name="close" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            <Icon name="plus" className="h-4 w-4" />
            Start a new conversation
          </button>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Chat history
              </h2>

              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                {conversations.length}
              </span>
            </div>

            {conversations.length > 3 && (
              <label className="relative mt-3 block">
                <span className="sr-only">Search conversations</span>

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="search" className="h-4 w-4" />
                </span>

                <input
                  value={searchHistory}
                  onChange={(event) => setSearchHistory(event.target.value)}
                  placeholder="Find a conversation"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                />
              </label>
            )}

            <div className="mt-3 max-h-[350px] space-y-1.5 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex min-w-0 items-center gap-1 rounded-xl border transition ${
                      chat.id === activeChatId
                        ? "border-violet-100 bg-violet-50"
                        : "border-transparent hover:border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectChat(chat.id)}
                      className="min-w-0 flex-1 px-3 py-2.5 text-left"
                    >
                      <span
                        className={`block truncate text-xs font-semibold ${
                          chat.id === activeChatId
                            ? "text-violet-800"
                            : "text-slate-700"
                        }`}
                      >
                        {chat.title}
                      </span>

                      <span className="mt-1 block text-[10px] text-slate-400">
                        {formatDate(chat.updatedAt)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(event) =>
                        handleDeleteChat(event, chat.id)
                      }
                      title="Delete conversation"
                      aria-label={`Delete ${chat.title}`}
                      className="mr-1 rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="px-2 py-5 text-center text-xs leading-5 text-slate-400">
                  {conversations.length
                    ? "No matching conversations."
                    : "Your chats will appear here."}
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">
              Try asking about
            </h2>

            <div className="mt-3 space-y-1.5">
              {QUICK_PROMPTS.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    setInput(item.prompt);
                    setSidebarOpen(false);

                    window.setTimeout(
                      () => textareaRef.current?.focus(),
                      0
                    );
                  }}
                  disabled={loading}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-violet-50 disabled:opacity-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg">
                    {item.icon}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-slate-800">
                      {item.title}
                    </span>

                    <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
            <span className="text-lg">💡</span>

            <h3 className="mt-2 text-sm font-bold text-slate-900">
              Learn by asking why
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-slate-600">
              Ask follow-up questions, request examples, or ask the assistant
              to explain code line by line.
            </p>
          </section>
        </aside>

        {/* Chat panel: fixed available height; only messages scroll */}
        <section className="flex h-[calc(100vh-180px)] min-h-[560px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Chat header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open chat history"
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              >
                <Icon name="menu" className="h-4 w-4" />
              </button>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-xl text-white">
                ✦
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-900">
                  {activeChat?.title || "TechPath AI"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {loading
                    ? "Preparing your answer..."
                    : "AI learning companion"}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold sm:text-xs ${
                loading
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  loading ? "animate-pulse bg-amber-500" : "bg-emerald-500"
                }`}
              />

              {loading ? "Thinking" : "Ready"}
            </span>
          </div>

          {/* Independently scrolling messages area */}
          <div
            className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain bg-gradient-to-b from-white to-slate-50/60 p-4 sm:p-6"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.length === 0 && (
              <div className="flex min-h-full flex-col items-center justify-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-600 text-3xl text-white shadow-lg shadow-violet-200">
                  ✦
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                  Your personal coding mentor
                </p>

                <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  What are we learning today?
                </h2>

                <p className="mt-3 max-w-md text-center text-sm leading-6 text-slate-500">
                  Explore programming concepts, get help with DSA, debug your
                  code, or prepare for your next placement interview.
                </p>

                <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {QUICK_PROMPTS.map((item) => (
                    <PromptCard
                      key={item.title}
                      item={item}
                      onClick={(prompt) => {
                        setInput(prompt);

                        window.setTimeout(
                          () => textareaRef.current?.focus(),
                          0
                        );
                      }}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex min-w-0 gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-lg text-white shadow-sm">
                    ✦
                  </div>
                )}

                <div
                  className={`min-w-0 max-w-[92%] sm:max-w-[84%] ${
                    message.role === "user" ? "order-1" : ""
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3.5 sm:px-5 ${
                      message.role === "user"
                        ? "rounded-br-md bg-violet-600 text-white shadow-sm shadow-violet-100"
                        : "rounded-bl-md border border-slate-200 bg-white shadow-sm"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <FormattedMessage
                        content={message.content}
                        onCopyCode={(code) =>
                          handleCopy(code, message.id)
                        }
                      />
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-white">
                        {message.content}
                      </p>
                    )}
                  </div>

                  <div
                    className={`mt-2 flex items-center gap-3 px-1 text-[10px] text-slate-400 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    <span>
                      {message.role === "user" ? "You" : "TechPath AI"} ·{" "}
                      {formatTime(message.timestamp)}
                    </span>

                    {message.role === "assistant" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(message.content, message.id)
                        }
                        className="inline-flex items-center gap-1 rounded px-1 py-0.5 font-medium transition hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Icon name="copy" className="h-3 w-3" />
                        {copiedId === message.id ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                    You
                  </div>
                )}
              </article>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-lg text-white">
                  ✦
                </div>

                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:300ms]" />

                    <span className="ml-2 text-xs text-slate-500">
                      Thinking through your question...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Error area stays above the composer */}
          {error && (
            <div
              role="alert"
              className="mx-4 mb-3 flex shrink-0 items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 sm:mx-5"
            >
              <div>
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-1 break-words text-xs leading-5">{error}</p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="rounded-lg p-1 hover:bg-rose-100"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Composer stays visible at the bottom of the chat panel */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 shrink-0 border-t border-slate-100 bg-white p-3 sm:p-4"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-50">
              <textarea
                ref={textareaRef}
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about coding, DSA, Java, or placements..."
                maxLength={10000}
                disabled={loading}
                aria-label="Your message"
                className="max-h-32 min-h-[56px] w-full resize-y bg-transparent px-1 py-1 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">
                    {input.length}/10000
                  </span>

                  <span className="hidden text-[11px] text-slate-400 sm:inline">
                    Enter to send · Shift + Enter for new line
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  {loading ? "Generating..." : "Send"}
                  <Icon name="send" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mt-2 text-center text-[10px] leading-4 text-slate-400">
              AI can make mistakes. Verify important answers and test code
              before using it in your projects.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}