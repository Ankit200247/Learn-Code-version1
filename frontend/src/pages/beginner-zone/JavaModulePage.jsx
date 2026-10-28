import { Link, useParams } from "react-router-dom";
import learningContent from "../../data/learningContent";

export default function JavaModulePage() {
  const { subjectSlug } = useParams();

  const subject = learningContent[subjectSlug || "java"];

  if (!subject) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Subject not found
        </h1>

        <p className="mt-2 text-slate-600">
          This learning subject is not available yet.
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

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link
          to="/beginner-zone"
          className="transition hover:text-indigo-600"
        >
          Beginner Zone
        </Link>

        <span>/</span>

        <span className="font-medium text-slate-800">
          {subject.title}
        </span>
      </div>

      {/* Subject Header */}
      <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
              {subject.level} Level
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {subject.title}
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              {subject.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                📚 {subject.modules.length} Modules
              </span>

              <span className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                📝{" "}
                {subject.modules.reduce(
                  (total, module) => total + module.lessons.length,
                  0
                )}{" "}
                Lessons
              </span>
            </div>
          </div>

          <div className="flex h-24 w-24 shrink-0 items-center justify-center self-start rounded-3xl border border-white bg-white text-5xl shadow-sm sm:self-center">
            {subject.icon}
          </div>
        </div>
      </section>

      {/* Learning Modules */}
      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Learning Modules
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete the lessons in each module to strengthen your fundamentals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {subject.modules.map((module, index) => (
            <article
              key={module.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-700">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {module.duration}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {module.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {module.description}
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-4 text-sm text-slate-500">
                  {module.lessons.length} Lessons
                </p>

                <div className="mb-5 space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">
                        {lessonIndex + 1}
                      </span>

                      <span>{lesson.title}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/beginner-zone/${subject.id}/${module.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Open Module
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Learning Tip */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h3 className="font-bold text-amber-900">
          💡 Learning Tip
        </h3>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          Read each lesson carefully, understand the code example, and try
          writing the program yourself before moving to the next lesson.
        </p>
      </section>
    </div>
  );
}