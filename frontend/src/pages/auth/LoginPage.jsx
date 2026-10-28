import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

  const API_URL = (
    import.meta.env.VITE_API_URL || "https://leancode.onrender.com"
  ).replace(/\/$/, "");
export default function LoginPage() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (event) => {
event.preventDefault();
setError("");


const normalizedEmail = email.trim().toLowerCase();

if (!normalizedEmail || !password) {
  setError("Please enter your email and password.");
  return;
}

try {
  setLoading(true);

  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email: normalizedEmail,
    password,
  });

  const { token, user } = response.data || {};

  if (!token || !user) {
    throw new Error("The server returned an invalid login response.");
  }

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  navigate("/dashboard");
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.message ||
      "Login failed. Please check your details and try again."
  );
} finally {
  setLoading(false);
}


};

return ( <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"> <div className="mx-auto flex min-h-[80vh] max-w-md items-center"> <section className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"> <Link
         to="/"
         className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
       > <span aria-hidden="true">←</span>
Back to home </Link>

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl">
        🚀
      </div>

      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
        Learn Code
      </p>

      <h1 className="text-3xl font-bold tracking-tight">
        Welcome back
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Sign in using your registered email address and password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            maxLength={254}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm font-medium text-slate-200">
          🔐 Secure password login
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Use the email and password you registered with. Your password
          should be stored securely by the server.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to Learn Code?{" "}
        <Link
          to="/signup"
          className="font-semibold text-indigo-400 transition hover:text-indigo-300"
        >
          Create an account
        </Link>
      </p>
    </section>
  </div>
</main>
);
}
