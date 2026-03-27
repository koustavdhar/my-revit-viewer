"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "demo_auth=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <Button type="button" onClick={handleLogout} variant="secondary" size="sm" className="w-full">
      Logout
    </Button>
  );
}
