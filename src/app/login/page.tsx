"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Input, PageContainer } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>(
    {},
  );

  function validate() {
    const next: { email?: string; password?: string; form?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      next.email = "Work email is required.";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      next.email = "Enter a valid email address.";
    }
    if (!password.trim()) {
      next.password = "Password is required.";
    } else if (password.trim().length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    void (async () => {
      const res = await fetch("/api/demo-auth", { method: "POST" });
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, form: "Sign-in failed. Please try again." }));
        return;
      }
      router.push("/dashboard");
    })();
  }

  return (
    <PageContainer className="flex min-h-[calc(100dvh-6rem)] items-center justify-center">
      <div className="w-full max-w-[22rem]">
        <Card className="border-[color:var(--border)] p-[length:var(--card-padding-loose)] shadow-[var(--shadow-sm)]">
          <p className="text-center text-[length:var(--text-2xs)] font-bold uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
            Workspace sign-in
          </p>
          <h1 className="mt-2 text-center text-[length:var(--text-md)] font-bold tracking-tight text-[color:var(--text)]">
            Sign in
          </h1>
          <p className="mt-1 text-center text-[length:var(--text-xs)] text-[color:var(--text-muted)]">
            Demo authentication — sets a session cookie only.
          </p>

          <form className="mt-[length:var(--space-3)] flex flex-col gap-[length:var(--layout-section-gap)]" onSubmit={handleLogin} noValidate>
            <div>
              <label htmlFor="login-email" className="form-field-label">
                Email
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email || errors.form)
                    setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
                }}
                aria-invalid={!!errors.email}
              />
              {errors.email ? (
                <p className="mt-0.5 text-[length:var(--text-2xs)] text-[color:var(--error)]">{errors.email}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="login-password" className="form-field-label">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password || errors.form)
                    setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
                }}
                aria-invalid={!!errors.password}
              />
              {errors.password ? (
                <p className="mt-0.5 text-[length:var(--text-2xs)] text-[color:var(--error)]">{errors.password}</p>
              ) : null}
            </div>
            {errors.form ? (
              <p className="text-[length:var(--text-2xs)] text-[color:var(--error)]">{errors.form}</p>
            ) : null}
            <Button type="submit" variant="primary" className="flex w-full" size="md">
              Sign in (demo)
            </Button>
            <p className="text-center text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
              New user?{" "}
              <Link
                href="/signup"
                className="font-bold text-[color:var(--primary)] underline-offset-2 hover:underline"
              >
                Create account
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
