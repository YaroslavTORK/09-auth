import { cookies } from "next/headers";
import type { Note, NoteTags } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";
import type { AxiosResponse } from "axios";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTags;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

type CookieItem = { name: string; value: string };

async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }: CookieItem) => `${name}=${value}`)
    .join("; ");
}

type AuthSessionResponse = { user: User } | null;

export async function checkSession(): Promise<AxiosResponse<AuthSessionResponse>> {
  const cookieHeader = await buildCookieHeader();

  return api.get<AuthSessionResponse>("/auth/session", {
    headers: { Cookie: cookieHeader },
  });
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const cookieHeader = await buildCookieHeader();

  const res = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await buildCookieHeader();

  const res = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await buildCookieHeader();

  const res = await api.get<User>("/users/me", {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}