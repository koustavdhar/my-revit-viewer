"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    document.cookie = "demo_auth=1; path=/";
    router.push("/dashboard");
  }

  return (
    <main className="app-shell flex flex-1 items-center justify-center py-14">
      <section className="panel w-full max-w-md p-8 md:p-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Secure Access
        </p>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900">
          Login
        </h1>
        <p className="mb-7 text-sm text-slate-600">
          Sign in to access your project dashboards and model viewer.
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Work Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:ring-2"
            />
          </div>
          <button type="submit" className="btn-primary flex w-full">
            Sign In (Demo)
          </button>
        </form>
      </section>
    </main>
  );
}
