import { useState } from "react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Start learning and build your foundation.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: "Getting Started",
    featured: false,
    buttonText: "Current Free Plan",
    features: [
      { text: "Beginner Zone access", included: true },
      { text: "Basic DSA practice", included: true },
      { text: "Campus Prep MCQs", included: true },
      { text: "Basic progress tracking", included: true },
      { text: "AI coding assistant", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Unlimited AI requests", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For students preparing seriously for placements.",
    monthlyPrice: 199,
    yearlyPrice: 1499,
    badge: "Most Popular",
    featured: true,
    buttonText: "Explore Pro",
    features: [
      { text: "Everything in Free", included: true },
      { text: "AI coding assistance", included: true },
      { text: "Code explanations and debugging", included: true },
      { text: "Advanced progress analytics", included: true },
      { text: "Personalized learning roadmap", included: true },
      { text: "Priority AI requests", included: true },
      { text: "Unlimited AI requests", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "For learners who want a more personalized experience.",
    monthlyPrice: 399,
    yearlyPrice: 2999,
    badge: "Advanced",
    featured: false,
    buttonText: "Explore Premium",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Advanced coding feedback", included: true },
      { text: "Detailed performance insights", included: true },
      { text: "Personalized revision plans", included: true },
      { text: "Expanded AI usage allowance", included: true },
      { text: "Priority support", included: true },
      { text: "Guaranteed placement", included: false },
    ],
  },
];

const COMPARISON = [
  {
    feature: "Beginner Zone",
    free: "Included",
    pro: "Included",
    premium: "Included",
  },
  {
    feature: "DSA Practice",
    free: "Basic",
    pro: "Advanced",
    premium: "Advanced",
  },
  {
    feature: "Campus Preparation",
    free: "Included",
    pro: "Included",
    premium: "Included",
  },
  {
    feature: "AI Coding Assistant",
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: "Code Debugging",
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: "Progress Analytics",
    free: "Basic",
    pro: "Advanced",
    premium: "Detailed",
  },
  {
    feature: "Personalized Roadmap",
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: "Priority AI Requests",
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: "Priority Support",
    free: false,
    pro: false,
    premium: true,
  },
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN").format(price);
}

function FeatureValue({ value }) {
  if (typeof value === "boolean") {
    return value ? (
      <span
        className="font-semibold text-emerald-400"
        aria-label="Included"
      >
        ✓
      </span>
    ) : (
      <span className="text-slate-600" aria-label="Not included">
        —
      </span>
    );
  }

  return <span className="text-sm text-slate-300">{value}</span>;
}

export default function PremiumPage() {
  const [billing, setBilling] = useState("yearly");
  const [showComparison, setShowComparison] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: "Can I start using Learn Code for free?",
      answer:
        "Yes. The Free plan is designed to help you explore learning resources, practice basic questions, and begin tracking your learning progress.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "The intended plan structure supports different learning levels. Actual upgrades, downgrades, billing, and cancellations require a working subscription and payment integration.",
    },
    {
      question: "Does Premium guarantee a job or placement?",
      answer:
        "No. Learn Code is a learning and preparation platform. Your placement outcome depends on your preparation, performance, eligibility, and the employer's recruitment process.",
    },
    {
      question: "Are the prices shown live subscription prices?",
      answer:
        "No. The prices in this interface are example prices for the proposed plans. They are not a live offer or a processed payment.",
    },
    {
      question: "Will clicking Upgrade activate a paid plan?",
      answer:
        "Not yet. This page provides the pricing interface only. A secure payment gateway, server-side payment verification, and subscription management must be implemented before paid upgrades can work.",
    },
  ];

  return (
    <main className="min-h-screen space-y-9 bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-5 py-12 text-center sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300">
            ✦ Learn Code MEMBERSHIP
          </span>

          <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-5xl">
            Invest in your skills.
            <span className="block text-indigo-400">
              Build your future.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Choose a learning plan that matches your goals. Practice DSA,
            prepare for placements, and build confidence one concept at a time.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2">
              ✓ Learn at your pace
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2">
              ✓ Practice coding
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2">
              ✓ Track your progress
            </span>
          </div>
        </div>
      </section>

      {/* Billing toggle */}
      <section className="text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Choose Your Plan
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          Compare the features and choose what works for you.
        </p>

        <div className="mt-6 inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            aria-pressed={billing === "monthly"}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              billing === "monthly"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() => setBilling("yearly")}
            aria-pressed={billing === "yearly"}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              billing === "yearly"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Yearly
            <span className="ml-2 rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-400">
              Save more
            </span>
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Illustrative pricing only. No payment is collected on this page.
        </p>
      </section>

      {/* Plan cards */}
      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price =
            billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

          const monthlyEquivalent =
            billing === "yearly" && plan.yearlyPrice > 0
              ? Math.round(plan.yearlyPrice / 12)
              : null;

          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition duration-200 hover:-translate-y-1 ${
                plan.featured
                  ? "border-indigo-500/70 bg-gradient-to-b from-indigo-950/70 to-slate-900 shadow-xl shadow-indigo-950/20"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                    {plan.description}
                  </p>
                </div>

                <span className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {plan.badge}
                </span>
              </div>

              <div className="mt-7 border-b border-slate-800 pb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    ₹{formatPrice(price)}
                  </span>

                  <span className="text-sm text-slate-500">
                    /{billing === "yearly" ? "year" : "month"}
                  </span>
                </div>

                {monthlyEquivalent !== null && (
                  <p className="mt-2 text-xs text-slate-400">
                    Approximately ₹{formatPrice(monthlyEquivalent)} per month
                  </p>
                )}

                {plan.id === "free" && (
                  <p className="mt-2 text-xs text-slate-400">
                    No subscription payment required
                  </p>
                )}
              </div>

              <div className="mt-6 flex-1">
                <p className="mb-4 text-sm font-semibold">
                  What's included
                </p>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className={`mt-0.5 ${
                          feature.included
                            ? "text-emerald-400"
                            : "text-slate-600"
                        }`}
                      >
                        {feature.included ? "✓" : "—"}
                      </span>

                      <span
                        className={
                          feature.included
                            ? "text-slate-300"
                            : "text-slate-500"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={plan.id === "free" ? "/dashboard" : "/login"}
                className={`mt-8 block rounded-xl px-4 py-3.5 text-center text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "border border-slate-700 bg-slate-950 text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800"
                }`}
              >
                {plan.id === "free" ? "Go to Dashboard" : plan.buttonText}
                {plan.id !== "free" && " →"}
              </Link>

              {plan.id !== "free" && (
                <p className="mt-3 text-center text-[11px] text-slate-500">
                  Payment integration is not enabled
                </p>
              )}
            </article>
          );
        })}
      </section>

      {/* Feature comparison */}
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <button
          type="button"
          onClick={() => setShowComparison((previous) => !previous)}
          aria-expanded={showComparison}
          className="flex w-full items-center justify-between gap-3 p-5 text-left sm:p-6"
        >
          <div>
            <h2 className="text-xl font-bold">Compare Plans</h2>

            <p className="mt-2 text-sm text-slate-400">
              See which features are included in each plan.
            </p>
          </div>

          <span className="text-xl text-slate-400">
            {showComparison ? "−" : "+"}
          </span>
        </button>

        {showComparison && (
          <div className="overflow-x-auto border-t border-slate-800">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-950/60">
                  <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                    Feature
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold">
                    Free
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-indigo-300">
                    Pro
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold">
                    Premium
                  </th>
                </tr>
              </thead>

              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-t border-slate-800 transition hover:bg-slate-800/30"
                  >
                    <td className="px-5 py-4 text-sm text-slate-300">
                      {row.feature}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <FeatureValue value={row.free} />
                    </td>

                    <td className="px-5 py-4 text-center">
                      <FeatureValue value={row.pro} />
                    </td>

                    <td className="px-5 py-4 text-center">
                      <FeatureValue value={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Frequently asked questions */}
      <section className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

          <p className="mt-3 text-sm text-slate-400">
            Important details about plans and subscriptions.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <article
                key={faq.question}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(isOpen ? -1 : index)
                  }
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
      </section>

      {/* Final CTA */}
      <section className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/80 to-slate-900 p-6 text-center sm:p-9">
        <h2 className="text-2xl font-bold">
          Your next step starts today.
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
          Keep practicing, strengthen your fundamentals, and track your
          progress as you prepare for your next opportunity.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/beginner-zone"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500"
          >
            Explore Beginner Zone
          </Link>

          <Link
            to="/practice"
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800"
          >
            Start Coding Practice
          </Link>
        </div>
      </section>

      <p className="pb-2 text-center text-xs leading-6 text-slate-600">
        Prices and plan features shown here are illustrative. Paid features
        require actual subscription enforcement and a verified payment
        integration. No placement outcome is guaranteed.
      </p>
    </main>
  );
}