import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
// import axios from "axios";
// import type { Note, NoteTags } from "../types/note";

// const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// const api = axios.create({
//   baseURL: "https://notehub-public.goit.study/api",
//   headers: {
//     Authorization:`Bearer ${ TOKEN }`,
//   }
// });

// export interface FetchNotesParams {
//   page: number;
//   perPage: number;
//   search?: string;
//   tag?: NoteTags;
// }
// export interface FetchNotesResponse {
//   notes: Note[];
//   totalPages: number;
// }
// export async function fetchNotes(
//   params: FetchNotesParams
// ): Promise<FetchNotesResponse> {
//   const response = await api.get<FetchNotesResponse>("/notes", {
//     params: {
//       page: params.page,
//       perPage: params.perPage,
//       search: params.search,
//       tag: params.tag,
//     },
//   });

//   return response.data;
// }

// export interface CreateNotePayload {
//   title: string;
//   content?: string;
//   tag: NoteTags;
// }   
// export async function createNote(
//   payload: CreateNotePayload
// ): Promise<Note> {
//   const response = await api.post<Note>("/notes", payload);
//   return response.data;
// }


// export interface DeleteNoteResponse {
//   note: Note;
// }
// export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
//   const response = await api.delete<DeleteNoteResponse>(`/notes/${id}`);
//   return response.data;
// };

// export const fetchNoteById = async (id: string): Promise<Note> => {
//   const res = await api.get<Note>(`/notes/${id}`);
//   return res.data;
// };

