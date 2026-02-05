"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import css from "./EditProfile.module.css";
import type { User } from "@/types/user";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [user, setLocalUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const me = await getMe();
        if (!isMounted) return;

        setLocalUser(me);
        setUsername(me.username ?? "");
      } catch (e) {
        if (!isMounted) return;
        setError("Failed to load profile.");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  const next = username.trim();
  if (!next) {
    setError("Username is required.");
    return;
  }

  setError("");
  setIsSaving(true);

  try {
    const updated = await updateMe({ username: next });
    setUser(updated);
    router.push("/profile");
  } catch (e) {
    setError("Failed to update profile.");
  } finally {
    setIsSaving(false);
  }
};

  const handleCancel = () => router.back();

  if (!user && !error) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {user && (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <p>Email: {user?.email ?? "user_email@example.com"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isSaving}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
