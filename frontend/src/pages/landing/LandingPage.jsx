import { useState } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Coding Mentor",
    description:
      "Understand difficult concepts, debug code, and get guidance while solving programming problems.",
    color: "indigo",
    link: "/ai-assistant",
    linkText: "Explore AI Mentor",
  },
  {
    icon: "💻",
    title: "Coding Practice",
    description:
      "Solve programming problems, practice different topics, and strengthen your problem-solving skills.",
    color: "cyan",
    link: "/practice",
    linkText: "Start Practicing",
  },
  {
    icon: "🌱",
    title: "Beginner Zone",
    description:
      "Start from programming fundamentals and follow structured lessons designed for beginners.",
    color: "emerald",
    link: "/beginner-zone",
    linkText: "Start Learning",
  },
  {
    icon: "🎯",
    title: "Campus Preparation",
    description:
      "Revise computer science fundamentals and practice MCQs for technical placement assessments.",
    color: "amber",
    link: "/campus-prep",
    linkText: "Prepare for Placements",
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    description:
      "Review your learning activity, monitor solved questions, and identify topics that need more practice.",
    color: "purple",
    link: "/progress",
    linkText: "View Progress",
  },
  {
    icon: "📚",
    title: "Learning Resources",
    description:
      "Discover documentation, tutorials, coding platforms, and computer science learning materials.",
    color: "pink",
    link: "/resources",
    linkText: "Explore Resources",
  },
];

const ROADMAP = [
  {
    number: "01",
    title: "Build Your Foundation",
    description:
      "Learn programming syntax, variables, loops, functions, and object-oriented programming.",
    duration: "Start here",
    icon: "🌱",
  },
  {
    number: "02",
    title: "Master DSA",
    description:
      "Practice arrays, strings, searching, sorting, recursion, trees, graphs, and common patterns.",
    duration: "Practice consistently",
    icon: "🧩",
  },
  {
    number: "03",
    title: "Strengthen CS Fundamentals",
    description:
      "Revise DBMS, operating systems, computer networks, OOP, and SQL concepts.",
    duration: "Revise regularly",
    icon: "🖥️",
  },
  {
    number: "04",
    title: "Prepare for Interviews",
    description:
      "Practice aptitude, technical MCQs, coding assessments, and explaining your solutions.",
    duration: "Test your readiness",
    icon: "🎯",
  },
];

const STATS = [
  { value: "Learn", label: "Programming Fundamentals" },
  { value: "Practice", label: "Coding Problems" },
  { value: "Prepare", label: "For Campus Placements" },
  { value: "Improve", label: "With Consistent Revision" },
];

const FAQS = [
  {
    question: "What is Learn Code?",
    answer:
      "Learn Code is a learning platform concept designed to bring programming lessons, coding practice, AI-assisted learning, progress tracking, and placement preparation together.",
  },
  {
    question: "Can beginners use Learn Code?",
    answer:
      "Yes. The Beginner Zone is designed to help learners start with programming fundamentals and gradually move towards more challenging concepts.",
  },
  {
    question: "Does Learn Code support coding practice?",
    answer:
      "The platform includes a coding practice area and an editor interface. Actual code execution depends on the backend and Judge0 configuration being set up correctly.",
  },
  {
    question: "Will Learn Code guarantee a placement?",
    answer:
      "No platform can guarantee a placement. Learn Code is intended to support preparation through learning, practice, revision, and progress tracking.",
  },
];

const COLOR_STYLES = {
  indigo: {
    icon: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300",
    link: "text-indigo-300 hover:text-indigo-200",
  },
  cyan: {
    icon: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    link: "text-cyan-300 hover:text-cyan-200",
  },
  emerald: {
    icon: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    link: "text-emerald-300 hover:text-emerald-200",
  },
  amber: {
    icon: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    link: "text-amber-300 hover:text-amber-200",
  },
  purple: {
    icon: "border-purple-500/20 bg-purple-500/10 text-purple-300",
    link: "text-purple-300 hover:text-purple-200",
  },
  pink: {
    icon: "border-pink-500/20 bg-pink-500/10 text-pink-300",
    link: "text-pink-300 hover:text-pink-200",
  },
};

function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "About", href: "#about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Learn Code home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold shadow-lg shadow-indigo-950/30">
            T
          </span>

          <span className="text-lg font-bold tracking-tight">
            TechPath<span className="text-indigo-400"> AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Sign in
          </Link>

          <Link
            to="/dashboard"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Explore Platform →
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-xl text-slate-300 md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-900"
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-900"
            >
              Sign in
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold"
            >
              Explore Platform →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold">
            T
          </span>

          <span className="font-bold">
            TechPath<span className="text-indigo-400"> AI</span>
          </span>
        </Link>

        <p className="text-xs leading-6 text-slate-500">
          Learn consistently. Practice deliberately. Grow confidently.
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          <Link to="/resources" className="hover:text-white">
            Resources
          </Link>

          <Link to="/premium" className="hover:text-white">
            Plans
          </Link>

          <Link to="/login" className="hover:text-white">
            Sign in
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-900 px-4 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Learn Code. Keep learning.
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNavbar />

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950 to-slate-950" />

          <div className="pointer-events-none absolute -left-24 top-32 -z-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="pointer-events-none absolute -right-24 top-20 -z-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Your journey from learner to problem solver
              </div>

              <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Your path to
                <span className="block text-indigo-400">
                  coding confidence.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                Learn programming, practice DSA, understand difficult
                concepts with AI assistance, and prepare for placements
                through one structured learning experience.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/beginner-zone"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-semibold shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:bg-indigo-500"
                >
                  Start Learning
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  to="/practice"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Explore Coding Practice
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
                <span>✓ Beginner-friendly lessons</span>
                <span>✓ Hands-on practice</span>
                <span>✓ Placement preparation</span>
              </div>
            </div>

            {/* Preview card */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-black/30">
                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-lg">
                      ⚡
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Your Learning Space</p>
                      <p className="mt-1 text-xs text-slate-500">
                        A path built around practice
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-400">
                    READY TO LEARN
                  </span>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          YOUR NEXT STEP
                        </p>

                        <h2 className="mt-2 font-semibold">
                          Master the fundamentals
                        </h2>
                      </div>

                      <span className="text-2xl">🧩</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Java", "Arrays", "OOP"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <span className="text-xl">💻</span>
                      <p className="mt-3 text-sm font-semibold">
                        Coding Practice
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Turn concepts into solutions.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <span className="text-xl">🤖</span>
                      <p className="mt-3 text-sm font-semibold">
                        AI Assistance
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Get help understanding your code.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg">
                        🎯
                      </span>

                      <div>
                        <p className="text-sm font-semibold">
                          Prepare for placements
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Practice technical questions and aptitude.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 bg-slate-950/70 px-5 py-3 text-xs text-slate-500">
                  Learn → Practice → Review → Improve
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform principles */}
        <section className="border-y border-slate-800/80 bg-slate-900/40">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {STATS.map((item) => (
              <div
                key={item.value}
                className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-center"
              >
                <p className="text-lg font-bold text-indigo-300">
                  {item.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-24 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              One learning workspace
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Everything you need to keep improving
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Move from understanding the basics to solving problems and
              preparing for technical interviews.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl ${
                    COLOR_STYLES[feature.color].icon
                  }`}
                >
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>

                <Link
                  to={feature.link}
                  className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition ${
                    COLOR_STYLES[feature.color].link
                  }`}
                >
                  {feature.linkText}
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section
          id="roadmap"
          className="scroll-mt-24 border-y border-slate-800/80 bg-slate-900/40"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                  Your learning roadmap
                </p>

                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  A clearer path to your goals
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  Follow a sensible learning sequence instead of trying to
                  master everything at once.
                </p>
              </div>

              <Link
                to="/beginner-zone"
                className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:border-indigo-500/50 hover:bg-slate-800 md:self-auto"
              >
                Explore Roadmap →
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {ROADMAP.map((step) => (
                <article
                  key={step.number}
                  className="relative rounded-2xl border border-slate-800 bg-slate-950/80 p-6 transition hover:border-indigo-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-lg font-bold text-indigo-300">
                      {step.number}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-bold">{step.title}</h3>

                        <span className="text-xl">{step.icon}</span>
                      </div>

                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {step.description}
                      </p>

                      <p className="mt-4 text-xs font-semibold text-indigo-300">
                        {step.duration}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          className="scroll-mt-24 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Learn with purpose
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Progress comes from understanding, not just memorizing.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                Strong programming skills grow through consistent practice,
                thoughtful debugging, revision, and the ability to explain
                why a solution works.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Understand the concept before memorizing the solution.",
                  "Practice problems regularly and revisit mistakes.",
                  "Build projects that demonstrate your skills.",
                  "Prepare for interviews with both technical and aptitude practice.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs text-emerald-400">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  The improvement cycle
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    {
                      title: "Learn",
                      detail: "Understand a new concept",
                      icon: "📖",
                    },
                    {
                      title: "Practice",
                      detail: "Apply it to coding problems",
                      icon: "💻",
                    },
                    {
                      title: "Review",
                      detail: "Identify errors and gaps",
                      icon: "🔍",
                    },
                    {
                      title: "Improve",
                      detail: "Try again with better understanding",
                      icon: "🚀",
                    },
                  ].map((item, index) => (
                    <div key={item.title}>
                      <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                          {item.icon}
                        </span>

                        <div>
                          <h3 className="text-sm font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.detail}
                          </p>
                        </div>
                      </div>

                      {index < 3 && (
                        <div className="ml-9 h-4 border-l border-dashed border-indigo-500/40" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-800 bg-slate-900/40">
          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Frequently asked questions
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                Questions about Learn Code
              </h2>
            </div>

            <div className="mt-10 space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <article
                    key={faq.question}
                    className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className="text-sm font-semibold sm:text-base">
                        {faq.question}
                      </span>

                      <span className="shrink-0 text-xl text-indigo-400">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-800 px-5 py-4">
                        <p className="text-sm leading-7 text-slate-400">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 px-6 py-12 text-center sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <span className="text-3xl">🚀</span>

              <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
                Start building your future today.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Take the first step, practice consistently, and build
                confidence one problem at a time.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/beginner-zone"
                  className="rounded-xl bg-indigo-600 px-6 py-4 text-sm font-semibold transition hover:bg-indigo-500"
                >
                  Start Your Journey →
                </Link>

                <Link
                  to="/campus-prep"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-6 py-4 text-sm font-semibold transition hover:bg-slate-800"
                >
                  Practice for Placements
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}