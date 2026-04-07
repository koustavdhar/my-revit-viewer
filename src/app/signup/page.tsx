"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, PageContainer } from "@/components/ui";

type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate() {
    const next: FormErrors = {};
    if (!fullName.trim()) {
      next.fullName = "Full name is required.";
    }
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
    if (!confirmPassword.trim()) {
      next.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    void (async () => {
      const res = await fetch("/api/demo-auth", { method: "POST" });
      if (!res.ok) return;
      router.push("/dashboard");
    })();
  }

  return (
    <PageContainer className="flex min-h-[calc(100dvh-6rem)] items-center justify-center">
      <div className="w-full max-w-[22rem]">
        <Card className="border-[color:var(--border)] p-[length:var(--card-padding-loose)] shadow-[var(--shadow-sm)]">
          <p className="text-center text-[length:var(--text-2xs)] font-bold uppercase tracking-[0.14em] text-[color:var(--text-subtle)]">
            Workspace access
          </p>
          <h1 className="mt-2 text-center text-[length:var(--text-md)] font-bold tracking-tight text-[color:var(--text)]">
            Create account
          </h1>
          <p className="mt-1 text-center text-[length:var(--text-xs)] text-[color:var(--text-muted)]">
            Demo registration — same cookie-based session as sign-in.
          </p>

          <form className="mt-[length:var(--space-3)] flex flex-col gap-[length:var(--layout-section-gap)]" onSubmit={handleSignup} noValidate>
            <div>
              <label htmlFor="signup-name" className="form-field-label">
                Full name
              </label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Jane Smith"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName ? (
                <p className="mt-0.5 text-[length:var(--text-2xs)] text-[color:var(--error)]">{errors.fullName}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="signup-email" className="form-field-label">
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={!!errors.email}
              />
              {errors.email ? (
                <p className="mt-0.5 text-[length:var(--text-2xs)] text-[color:var(--error)]">{errors.email}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="signup-password" className="form-field-label">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errors.password || errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }));
                  }
                }}
                aria-invalid={!!errors.password}
              />
              {errors.password ? (
                <p className="mt-0.5 text-[length:var(--text-2xs)] text-[color:var(--error)]">{errors.password}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="signup-confirm" className="form-field-label">
                Confirm password
              </label>
              <Input
                id="signup-confirm"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword ? (
                <p className="mt-0.5 text-[length:var(--text-2xs)] text-[color:var(--error)]">
                  {errors.confirmPassword}
                </p>
              ) : null}
            </div>

            <Button type="submit" variant="primary" className="flex w-full" size="md">
              Create account (demo)
            </Button>

            <p className="text-center text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-bold text-[color:var(--primary)] underline-offset-2 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
