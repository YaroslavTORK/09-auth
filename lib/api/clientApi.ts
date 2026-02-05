import { api } from "./api";
import type { Note, NoteTags } from "@/types/note";
import type { User } from "@/types/user";

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

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search,
      tag: params.tag,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTags;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await api.post<Note>("/notes", payload);
  return response.data;
}

export interface DeleteNoteResponse {
  note: Note;
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const response = await api.delete<DeleteNoteResponse>(`/notes/${id}`);
  return response.data;
}

export type AuthCredentials = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: User;
};

export async function register(data: AuthCredentials): Promise<User> {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data.user;
}

export async function login(data: AuthCredentials): Promise<User> {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data.user;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {

  await api.get("/auth/session");
  
  try {
    const res = await api.get<User>("/users/me");
    return res.data;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}

export type UpdateMePayload = Partial<Pick<User, "username">>;

export async function updateMe(payload: UpdateMePayload): Promise<User> {
  const res = await api.patch<User>("/users/me", payload);
  return res.data;
}
