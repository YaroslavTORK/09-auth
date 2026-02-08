"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const PRIVATE_PREFIXES = ["/notes", "/profile"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(() => isPrivatePath(pathname));
  const runIdRef = useRef(0);

  useEffect(() => {
    if (!isPrivatePath(pathname)) {
      setIsChecking(false);
      return;
    }

    const runId = ++runIdRef.current;
    let alive = true;

    setIsChecking(true);

    (async () => {
      const user = await checkSession();

      if (!alive || runId !== runIdRef.current) return;

      if (user) {
        setUser(user);
        setIsChecking(false);
        return;
      }

      clearIsAuthenticated();
      setIsChecking(false);
      router.replace("/sign-in");
    })();

    return () => {
      alive = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isChecking && isPrivatePath(pathname)) {
    return (
      <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
