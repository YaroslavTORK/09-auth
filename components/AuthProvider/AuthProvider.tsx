"use client";

import { useEffect, useState, useRef} from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

const PRIVATE_PREFIXES = ["/notes", "/profile"];
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthPath(pathname: string) {
  return AUTH_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { setUser, clearIsAuthenticated } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);
  const runIdRef = useRef(0);

  useEffect(() => {
    const runId = ++runIdRef.current;
    let alive = true;

    (async () => {
      setIsChecking(true);

      const user = await checkSession();

      if (!alive || runId !== runIdRef.current) return

      if (user) {
        setUser(user);

        if (isAuthPath(pathname)) {
          router.replace("/profile");
        }
      } else {
        if (isPrivatePath(pathname)) {
          try {
            await logout();
          } catch {}
          clearIsAuthenticated();
          router.replace("/sign-in");
        } else {
          clearIsAuthenticated();
        }
      }

      setIsChecking(false);
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
