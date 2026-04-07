"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    void (async () => {
      await fetch("/api/demo-auth", { method: "DELETE" });
      router.push("/login");
    })();
  }

  return (
    <Button type="button" onClick={handleLogout} variant="secondary" size="sm" className="w-full">
      Logout
    </Button>
  );
}
