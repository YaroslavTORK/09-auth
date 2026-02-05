import { cookies } from "next/headers";
import type { Note, NoteTags } from "@/types/note";
import type { User } from "@/types/user";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = cookies();

  const res = await fetch(`${baseURL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Server API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTags;
}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [
      string,
      string,
    ][],
  ).toString();

  return serverFetch<{
    notes: Note[];
    totalPages: number;
  }>(`/notes?${query}`);
}

export async function fetchNoteById(id: string): Promise<Note> {
  return serverFetch<Note>(`/notes/${id}`);
}

export async function getMe(): Promise<User> {
  return serverFetch<User>("/users/me");
}
