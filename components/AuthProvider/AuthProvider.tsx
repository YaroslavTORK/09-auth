"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = { children: React.ReactNode };

const PRIVATE_PREFIXES = ["/notes", "/profile"];
const isPrivatePath = (p: string) => PRIVATE_PREFIXES.some((x) => p.startsWith(x));

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();

  const [isChecking, setIsChecking] = useState(false);
  const runIdRef = useRef(0);

  useEffect(() => {
    if (!isPrivatePath(pathname)) return;

    if (isAuthenticated) return;

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
  }, [pathname, router, setUser, clearIsAuthenticated, isAuthenticated]);

  return (
    <>
      {children}

      {isChecking && isPrivatePath(pathname) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(2px)",
            zIndex: 9999,
          }}
        >
          <div style={{ padding: "10px 14px", borderRadius: 10, background: "white" }}>
            Loading...
          </div>
        </div>
      )}
    </>
  );
}
