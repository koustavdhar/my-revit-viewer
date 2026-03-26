"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "demo_auth=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <button type="button" onClick={handleLogout} className="btn-secondary w-full">
      Logout
    </button>
  );
}
