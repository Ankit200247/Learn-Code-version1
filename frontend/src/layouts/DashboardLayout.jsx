import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { name: "Beginner Zone", path: "/beginner-zone", icon: "book" },
  { name: "Coding Practice", path: "/practice", icon: "code" },
  { name: "AI Assistant", path: "/ai-assistant", icon: "sparkles" },
  { name: "AI Code Editor", path: "/ai-editor", icon: "terminal" },
  { name: "My Progress", path: "/progress", icon: "chart" },
  { name: "Campus Prep", path: "/campus-prep", icon: "target" },
  { name: "Resources", path: "/resources", icon: "library" },
  { name: "Premium", path: "/premium", icon: "crown" },
];

function Icon({ name, size = 20, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    book: (
      <>
        <path d="M12 7v14" />
        <path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-4a3 3 0 0 0-3 2 3 3 0 0 0-3-2H5a2 2 0 0 1-2-2Z" />
      </>
    ),
    code: (
      <>
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m14 5-4 14" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
        <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
      </>
    ),
    terminal: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m7 9 3 3-3 3" />
        <path d="M13 15h4" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 4 3 6-7" />
      </>
    ),
    crown: (
      <>
        <path d="m2 8 5 4 5-8 5 8 5-4-3 12H5L2 8Z" />
        <path d="M5 16h14" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    library: (
      <>
        <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v16H5.5A1.5 1.5 0 0 0 4 20.5z" />
        <path d="M4 4.5v16" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    arrow: (
      <>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.dashboard}</svg>;
}

function BrandLogo() {
  return (
    <Link
      to="/dashboard"
      className="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400"
      aria-label="TechPath AI dashboard"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200">
        <svg
          width="27"
          height="27"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 3.5 28 10.5v11L16 28.5 4 21.5v-11L16 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m11 12 5-3 5 3v8l-5 3-5-3v-8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m11 12 5 3 5-3M16 15v8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="min-w-0">
        <span className="block whitespace-nowrap text-lg font-extrabold tracking-tight text-slate-900">
          TechPath <span className="text-violet-600">AI</span>
        </span>
        <span className="mt-0.5 block whitespace-nowrap text-[9px] font-bold tracking-[0.16em] text-slate-400">
          YOUR LEARNING JOURNEY
        </span>
      </span>
    </Link>
  );
}

function getPageTitle(pathname) {
  if (pathname.startsWith("/beginner-zone/java/lesson/")) {
    return "Java Lesson";
  }

  if (pathname.startsWith("/beginner-zone/quiz")) {
    return "Beginner Quiz";
  }

  if (pathname.startsWith("/beginner-zone/progress")) {
    return "Beginner Progress";
  }

  if (pathname.startsWith("/beginner-zone/java")) {
    return "Java Learning";
  }

  const match = navigation.find((item) =>
    item.path === "/dashboard"
      ? pathname === item.path
      : pathname === item.path || pathname.startsWith(`${item.path}/`)
  );

  return match?.name || "Your Workspace";
}

function getInitials(email) {
  if (!email) return "TP";

  return email
    .split("@")[0]
    .split(/[._\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userEmail = sessionStorage.getItem("TechPath AIEmail") || "";
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  function handleLogout() {
    sessionStorage.removeItem("TechPath AIEmail");
    sessionStorage.removeItem("TechPath AIVerified");
    localStorage.removeItem("token");

    navigate("/login", { replace: true });
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  const navLinkClass = ({ isActive }) =>
    [
      "group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-violet-600 text-white shadow-md shadow-violet-200"
        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
    ].join(" ");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={closeMobileMenu}
        tabIndex={mobileMenuOpen ? 0 : -1}
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        id="tp-sidebar"
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-slate-200 bg-white shadow-xl shadow-slate-200/30 transition-transform duration-300 ease-in-out md:translate-x-0 md:shadow-none ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex min-h-[84px] items-center justify-between border-b border-slate-100 px-5">
          <BrandLogo />

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            <Icon name="close" size={21} />
          </button>
        </div>

        {/* Navigation and promo */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
            Your workspace
          </p>

          <nav className="space-y-1" aria-label="Workspace">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                title={item.name}
                onClick={closeMobileMenu}
                className={navLinkClass}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-slate-400 group-hover:text-violet-600"
                      }`}
                    >
                      <Icon name={item.icon} size={19} />
                    </span>

                    <span className="min-w-0 flex-1">{item.name}</span>

                    {item.path === "/premium" && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        PRO
                      </span>
                    )}

                    <span
                      className={`transition-transform ${
                        isActive
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    >
                      <Icon name="chevron" size={15} />
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Premium promotion */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-200/40 blur-2xl" />

            <div className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                <Icon name="sparkles" size={21} />
              </span>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">
                Keep growing
              </p>

              <h3 className="mt-1.5 text-sm font-bold leading-5 text-slate-900">
                Your next level starts here.
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Build your skills, practice smarter, and prepare for your next
                opportunity.
              </p>

              <Link
                to="/premium"
                onClick={closeMobileMenu}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
              >
                Explore Premium
                <Icon name="arrow" size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Icon name="shield" size={18} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800">
                Keep moving forward
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                One step at a time.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main workspace */}
      <div className="min-h-screen min-w-0 md:pl-[272px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-controls="tp-sidebar"
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 md:hidden"
            >
              <Icon name="menu" size={22} />
            </button>

            <div className="min-w-0">
              <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
                <span>TechPath AI</span>
                <span>/</span>
                <span className="truncate text-violet-600">{pageTitle}</span>
              </div>

              <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:mt-1 sm:text-xl">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 lg:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Learn. Practice. Grow.
            </div>

            {userEmail && (
              <div
                className="hidden min-w-0 items-center gap-2.5 sm:flex"
                title={userEmail}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  {getInitials(userEmail)}
                </span>

                <div className="hidden min-w-0 xl:block">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Signed in as
                  </p>
                  <p className="max-w-40 truncate text-xs font-semibold text-slate-700">
                    {userEmail}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4 sm:text-sm"
            >
              <Icon name="logout" size={17} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}