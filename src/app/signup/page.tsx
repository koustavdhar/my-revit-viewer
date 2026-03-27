"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, PageContainer, SectionHeader } from "@/components/ui";

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

    document.cookie = "demo_auth=1; path=/; max-age=2592000; samesite=lax";
    router.push("/dashboard");
  }

  return (
    <PageContainer className="items-center justify-center py-10">
      <Card className="w-full max-w-md p-6 md:p-7">
        <p className="label-eyebrow mb-3 text-center">My Revit Viewer</p>
        <SectionHeader
          eyebrow="Workspace Access"
          title="Create Account"
          description="Set up your enterprise viewer account for demo access."
          className="mb-5"
          size="compact"
        />

        <form className="space-y-3.5" onSubmit={handleSignup} noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName ? <p className="mt-1 text-xs text-rose-700">{errors.fullName}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Work Email
            </label>
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              aria-invalid={!!errors.email}
            />
            {errors.email ? <p className="mt-1 text-xs text-rose-700">{errors.email}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
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
            {errors.password ? <p className="mt-1 text-xs text-rose-700">{errors.password}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <Input
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
              <p className="mt-1 text-xs text-rose-700">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <Button type="submit" variant="primary" className="flex w-full">
            Create Account (Demo)
          </Button>

          <p className="text-center text-xs text-slate-600">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-slate-800 hover:text-slate-950">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </PageContainer>
  );
}
