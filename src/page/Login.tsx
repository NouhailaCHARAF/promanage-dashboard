import { useState, type FormEvent } from "react";
import { Info, Lock, Mail } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("nouhaila@promanage.com");
  const [password, setPassword] = useState("promanage123");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      email.trim() === "nouhaila@promanage.com" &&
      password === "promanage123"
    ) {
      setError("");
      onLogin();
    } else {
      setError("Invalid email or password. Use the demo credentials above.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-between bg-slate-900 p-8 text-white sm:p-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 font-bold text-slate-100">
                P
              </div>
              <span className="text-xl font-bold tracking-wide">ProManage</span>
            </div>

            <h1 className="mt-10 text-3xl font-bold">Welcome back!</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Manage your projects, track team tasks, and monitor deadlines from
              one clean workspace.
            </p>
          </div>

          <p className="mt-8 text-xs text-slate-400">
            Portfolio Project • React + TypeScript + Supabase
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">
            Click Login below to explore the dashboard
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3.5 text-xs text-blue-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <div>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                nouhaila@promanage.com
              </p>
              <p className="mt-0.5">
                <span className="font-semibold">Password:</span> promanage123
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                * Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                * Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
