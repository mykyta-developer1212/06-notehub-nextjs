import axios from "axios";
import type { Note } from "../types/note";

const API_BASE = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!token) {
  console.warn("NEXT_PUBLIC_NOTEHUB_TOKEN is not defined in .env");
}

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: Note["tag"];
  sortBy?: "created" | "updated";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(params: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 10, search, tag, sortBy } = params;
  const q = new URLSearchParams();
  q.append("page", String(page));
  q.append("perPage", String(perPage));
  if (search) q.append("search", search);
  if (tag) q.append("tag", tag);
  if (sortBy) q.append("sortBy", sortBy);

  const resp = await client.get<FetchNotesResponse>(`/notes?${q.toString()}`);
  return resp.data;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: Note["tag"];
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const resp = await client.post<Note>("/notes", payload);
  return resp.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const resp = await client.delete<Note>(`/notes/${id}`);
  return resp.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const resp = await client.get<Note>(`/notes/${id}`);
  return resp.data;
}