"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Input, PageContainer, SectionHeader } from "@/components/ui";

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

    document.cookie = "demo_auth=1; path=/";
    router.push("/dashboard");
  }

  return (
    <PageContainer className="items-center justify-center py-10">
      <Card className="w-full max-w-md p-6 md:p-7">
        <p className="label-eyebrow mb-3 text-center">My Revit Viewer</p>
        <SectionHeader
          eyebrow="Secure Access"
          title="Sign In"
          description="Access your project control center and viewer workspace."
          className="mb-5"
          size="compact"
        />

        <form className="space-y-3.5" onSubmit={handleLogin} noValidate>
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
                if (errors.email || errors.form) setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
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
              placeholder="••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password || errors.form) setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
              }}
              aria-invalid={!!errors.password}
            />
            {errors.password ? <p className="mt-1 text-xs text-rose-700">{errors.password}</p> : null}
          </div>
          {errors.form ? <p className="text-xs text-rose-700">{errors.form}</p> : null}
          <Button type="submit" variant="primary" className="flex w-full">
            Sign In (Demo)
          </Button>
          <p className="text-center text-xs text-slate-600">
            New workspace user?{" "}
            <Link href="/signup" className="font-medium text-slate-800 hover:text-slate-950">
              Create account
            </Link>
          </p>
        </form>
      </Card>
    </PageContainer>
  );
}
