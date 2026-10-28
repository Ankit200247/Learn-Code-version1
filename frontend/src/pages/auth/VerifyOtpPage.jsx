import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://https://leancode.onrender.com"
).replace(/\/$/, "");

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^\d{6}$/.test(normalizedOtp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        {
          email: normalizedEmail,
          otp: normalizedOtp,
        }
      );

      const data = response.data;

      if (!data?.success || !data?.token) {
        throw new Error(data?.message || "OTP verification failed.");
      }

      // Store authentication details.
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage("Email verified successfully! Redirecting...");

      // Navigate to the dashboard after successful verification.
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to verify OTP. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setResending(true);

      const response = await axios.post(
        `${API_URL}/api/auth/send-otp`,
        {
          email: normalizedEmail,
        }
      );

      setMessage(
        response.data?.message || "A new OTP has been requested."
      );

      setOtp("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend OTP. Please try again later."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <section className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Back to home
          </Link>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl">
            ✉️
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Verify your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Enter the 6-digit verification code sent to your email address.
          </p>

          <form onSubmit={handleVerify} className="mt-8 space-y-5">
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                6-digit OTP
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                pattern="[0-9]{6}"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter OTP"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-xl tracking-[0.5em] text-white outline-none transition placeholder:text-slate-600 placeholder:tracking-normal focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />

              <p className="mt-2 text-xs text-slate-500">
                Enter the code you received in your inbox.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            {message && (
              <div
                role="status"
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || resending}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="mb-3 text-sm text-slate-400">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending || loading}
              className="text-sm font-semibold text-indigo-400 transition hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? "Requesting OTP..." : "Resend OTP"}
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Having trouble? Check your spam folder or try requesting a new code.
          </p>
        </section>
      </div>
    </main>
  );
}