import { Link } from "react-router-dom";

export default function ComingSoon({ title, description }) {
  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
      <span className="inline-flex rounded-xl bg-violet-100 px-3 py-2 text-xs font-bold text-violet-700">
        TechPath AI WORKSPACE
      </span>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>

      <p className="mt-4 max-w-xl leading-7 text-slate-500">
        {description}
      </p>

      <Link
        to="/"
        className="mt-7 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700"
      >
        Back to home
      </Link>
    </section>
  );
}